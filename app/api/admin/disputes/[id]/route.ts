import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendEmail, EmailTemplates } from '@/lib/mail';
import { MpesaService } from '@/services/mpesa';

/**
 * Admin Dispute Resolution API
 * URL: /api/admin/disputes/[id]
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { action } = await request.json(); // 'RELEASE' or 'REFUND'

    // 1. Fetch dispute and order details
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .select(`
        *,
        order:orders(
          *,
          product:products(title),
          buyer:users!orders_buyer_id_fkey(email, first_name, last_name, phone_number),
          seller:users!orders_seller_id_fkey(email, first_name, last_name, phone_number)
        )
      `)
      .eq('id', params.id)
      .single();

    if (disputeError || !dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    const order = dispute.order;
    const now = new Date().toISOString();

    if (action === 'RELEASE') {
      // RELEASE: Funds go to seller (Order COMPLETED)
      await Promise.all([
        supabase.from('orders').update({ status: 'COMPLETED', updated_at: now }).eq('id', order.id),
        supabase.from('disputes').update({ status: 'RESOLVED', resolution: 'RELEASED_TO_SELLER', resolved_at: now }).eq('id', params.id),
        supabase.from('escrow_transactions').update({ escrow_status: 'RELEASED', released_at: now }).eq('order_id', order.id)
      ]);

      // Trigger Payout
      const { data: payout } = await supabase
        .from('payouts')
        .insert({
          seller_id: order.seller_id,
          order_id: order.id,
          amount: order.seller_receivable,
          status: 'PENDING'
        })
        .select()
        .single();

      if (payout && order.seller?.phone_number) {
         try {
           const payoutRes = await MpesaService.initiateB2CPayout(order.seller.phone_number, order.seller_receivable, payout.id);
           if (payoutRes.ResponseCode === "0") {
              await supabase.from('payouts').update({ status: 'PROCESSING', mpesa_payout_id: payoutRes.ConversationID }).eq('id', payout.id);
           }
         } catch (e) {
           console.error('Resolution Payout Error:', e);
         }
      }

      // Notify Parties
      if (order.seller?.email) {
        const sellerTemplate = EmailTemplates.payoutInitiatedSeller(order.seller.first_name, order.seller_receivable.toLocaleString(), order.order_number);
        await sendEmail({ to: order.seller.email, subject: sellerTemplate.subject, html: sellerTemplate.html });
      }

    } else if (action === 'REFUND') {
      // REFUND: Funds go back to buyer (Order REFUNDED)
      await Promise.all([
        supabase.from('orders').update({ status: 'REFUNDED', updated_at: now }).eq('id', order.id),
        supabase.from('disputes').update({ status: 'RESOLVED', resolution: 'REFUNDED_TO_BUYER', resolved_at: now }).eq('id', params.id),
        supabase.from('escrow_transactions').update({ escrow_status: 'REFUNDED', released_at: now }).eq('order_id', order.id)
      ]);

      // Notify Buyer of Refund
      if (order.buyer?.email) {
        const buyerTemplate = EmailTemplates.disputeResolvedRefundBuyer(
          order.buyer.first_name,
          order.order_number,
          order.total_amount.toLocaleString()
        );
        await sendEmail({
          to: order.buyer.email,
          subject: buyerTemplate.subject,
          html: buyerTemplate.html
        });
      }
    }

    return NextResponse.json({ success: true, action });
  } catch (error: any) {
    console.error('Admin Dispute Resolution Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
