import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { MpesaService } from '@/services/mpesa';
import { logAdminAction } from '@/lib/admin-audit';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { payoutId } = await request.json();

    if (!payoutId) return NextResponse.json({ error: 'Payout ID is required' }, { status: 400 });

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch Payout Details
    const { data: payout, error: pError } = await supabase
      .from('payouts')
      .select('*')
      .eq('id', payoutId)
      .single();

    if (pError || !payout) throw new Error('Payout record not found');
    if (payout.status === 'SUCCESS' || payout.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Payout already completed' }, { status: 400 });
    }

    // 3. Mark as PROCESSING to prevent double execution
    await supabase.from('payouts').update({ status: 'PROCESSING' }).eq('id', payoutId);

    // 4. Trigger M-Pesa B2C
    const mpesaResponse = await MpesaService.initiateB2CPayout(
      payout.payout_phone_number,
      payout.amount,
      payout.id
    );

    // 5. Update Record with M-Pesa tracking info
    await supabase.from('payouts').update({
      originator_conversation_id: mpesaResponse.OriginatorConversationID,
      conversation_id: mpesaResponse.ConversationID,
      response_code: mpesaResponse.ResponseCode,
      response_description: mpesaResponse.ResponseDescription,
      attempted_at: new Date().toISOString()
    }).eq('id', payoutId);

    // 6. Log Admin Action
    await logAdminAction(user.id, 'EXECUTE_PAYOUT', 'PAYOUT', payoutId, { 
      amount: payout.amount,
      phone: payout.payout_phone_number
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payout request sent to Safaricom.',
      mpesa: mpesaResponse 
    });

  } catch (error: any) {
    console.error('Payout Execution Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
