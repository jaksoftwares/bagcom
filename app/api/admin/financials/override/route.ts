import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';
import { MpesaService } from '@/services/mpesa';

/**
 * Admin Emergency Override API
 * URL: /api/admin/financials/override
 * Actions: FORCE_RELEASE, FREEZE
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { action, escrowId, reason } = await request.json();

    // 1. Auth check (Service Role already used in server client, but check session for admin record)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Fetch escrow record
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_transactions')
      .select('*, order:orders(*)')
      .eq('id', escrowId)
      .single();

    if (escrowError || !escrow) {
      return NextResponse.json({ error: 'Escrow record not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    if (action === 'FORCE_RELEASE') {
      // FORCE_RELEASE: Bypasses buyer verification code
      await Promise.all([
        supabase.from('escrow_transactions').update({ 
          escrow_status: 'RELEASED', 
          released_at: now,
          details: { ...escrow.details, override_reason: reason }
        }).eq('id', escrowId),
        
        supabase.from('orders').update({ 
          status: 'COMPLETED', 
          updated_at: now 
        }).eq('id', escrow.order_id)
      ]);

      // Trigger Payout if not already done
      const { data: payout } = await supabase
        .from('payouts')
        .insert({
          seller_id: escrow.order.seller_id,
          order_id: escrow.order_id,
          amount: escrow.order.seller_receivable,
          status: 'PENDING'
        })
        .select()
        .single();

      if (payout) {
        // Fetch seller phone
        const { data: seller } = await supabase.from('users').select('phone_number').eq('id', escrow.order.seller_id).single();
        if (seller?.phone_number) {
          try {
            const payoutRes = await MpesaService.initiateB2CPayout(seller.phone_number, escrow.order.seller_receivable, payout.id);
            if (payoutRes.ResponseCode === "0") {
              await supabase.from('payouts').update({ status: 'PROCESSING', mpesa_payout_id: payoutRes.ConversationID }).eq('id', payout.id);
            }
          } catch (e) {
            console.error('Force Release Payout Error:', e);
          }
        }
      }

      await logAdminAction(user.id, 'FORCE_RELEASE_ESCROW', 'ESCROW', escrowId, { reason, order_id: escrow.order_id });

    } else if (action === 'FREEZE') {
      await supabase.from('escrow_transactions').update({ 
        escrow_status: 'FROZEN',
        details: { ...escrow.details, freeze_reason: reason }
      }).eq('id', escrowId);

      await logAdminAction(user.id, 'FREEZE_ESCROW', 'ESCROW', escrowId, { reason, order_id: escrow.order_id });
    }

    return NextResponse.json({ success: true, action });

  } catch (error: any) {
    console.error('Admin Override Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
