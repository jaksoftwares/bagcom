import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { MpesaService } from '@/services/mpesa';

/**
 * Admin Dispute Resolution API
 * URL: /api/admin/disputes/[disputeId]
 */
export async function POST(
  request: Request,
  { params }: { params: { disputeId: string } }
) {
  try {
    const supabase = createServerClient();
    const { action } = await request.json(); // 'RELEASE' or 'REFUND'

    // 1. Fetch dispute and order details
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .select('*, order:orders(*)')
      .eq('id', params.disputeId)
      .single();

    if (disputeError || !dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    const orderId = dispute.order_id;
    const order = dispute.order;

    if (action === 'RELEASE') {
      // RELEASE FUNDS TO SELLER
      // a. Update order status
      await supabase
        .from('orders')
        .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      // b. Update escrow status
      await supabase
        .from('escrow_transactions')
        .update({ escrow_status: 'RELEASED', released_at: new Date().toISOString() })
        .eq('order_id', orderId);

      // c. Trigger Payout (Similar to delivery confirmation)
      const { data: payout } = await supabase
        .from('payouts')
        .insert({
          seller_id: order.seller_id,
          order_id: orderId,
          amount: order.seller_receivable,
          status: 'PENDING'
        })
        .select()
        .single();

      if (payout) {
        const seller = await supabase.from('users').select('phone_number').eq('id', order.seller_id).single();
        if (seller.data?.phone_number) {
          await MpesaService.initiateB2CPayout(seller.data.phone_number, order.seller_receivable, payout.id);
        }
      }

    } else if (action === 'REFUND') {
      // REFUND BUYER
      // a. Update order status
      await supabase
        .from('orders')
        .update({ status: 'REFUNDED', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      // b. Update escrow status
      await supabase
        .from('escrow_transactions')
        .update({ escrow_status: 'REFUNDED', released_at: new Date().toISOString() })
        .eq('order_id', orderId);

      // c. Trigger B2C Refund to Buyer
      const buyer = await supabase.from('users').select('phone_number').eq('id', order.buyer_id).single();
      if (buyer.data?.phone_number) {
        // In a real system, this would be an M-PESA Reversal or a B2C Refund
        await MpesaService.initiateB2CPayout(buyer.data.phone_number, order.total_amount, `REF-${orderId}`);
      }
    }

    // 2. Resolve the dispute record
    await supabase
      .from('disputes')
      .update({ 
        status: 'RESOLVED', 
        resolution_notes: `Resolved by admin action: ${action}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.disputeId);

    return NextResponse.json({ success: true, message: `Dispute resolved with action: ${action}` });

  } catch (error: any) {
    console.error('Admin Dispute Resolution Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
