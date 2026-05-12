import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { MpesaService } from '@/services/mpesa';
import { sendEmail, EmailTemplates } from '@/lib/mail';


/**
 * Delivery Confirmation Endpoint
 * URL: /api/orders/confirm-delivery
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { orderId, deliveryCode } = await request.json();

    
    if (!orderId || !deliveryCode) {
      return NextResponse.json({ error: 'Order ID and delivery code are required' }, { status: 400 });
    }

    // 1. Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Validate status and code
    // We allow confirmation if payment is successful and order is in delivery phase
    const validStatuses = ['PAYMENT_SUCCESS', 'HELD_IN_ESCROW', 'PROCESSING_DELIVERY'];
    if (!validStatuses.includes(order.status)) {
      return NextResponse.json({ error: 'Order is not in a state where delivery can be confirmed' }, { status: 400 });
    }

    if (order.delivery_code !== deliveryCode) {
      return NextResponse.json({ error: 'Invalid delivery code. Please check with the buyer.' }, { status: 401 });
    }

    // 3. Confirm delivery and release escrow
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'DELIVERED',
        is_delivery_confirmed: true,
        confirmed_at: now,
        updated_at: now
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // 4. Update Escrow status (if exists)
    const { error: escrowError } = await supabase
      .from('escrow_transactions')
      .update({
        escrow_status: 'RELEASED',
        released_at: now
      })
      .eq('order_id', orderId);

    if (escrowError) console.error('Escrow update error:', escrowError);

    // 5. Create Payout record for the seller
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        seller_id: order.seller_id as string,
        order_id: orderId,
        amount: order.seller_receivable,
        status: 'PENDING'
      })
      .select()
      .single();

    if (payoutError) {
      console.error('Payout record creation error:', payoutError);
    } else {
      // 6. Trigger actual M-PESA B2C Payout
      try {
        const seller = await supabase.from('users').select('phone_number').eq('id', order.seller_id).single();
        if (seller.data?.phone_number) {
          const payoutResponse = await MpesaService.initiateB2CPayout(
            seller.data.phone_number,
            order.seller_receivable,
            payout.id
          );

          if (payoutResponse.ResponseCode === "0") {
            await supabase
              .from('payouts')
              .update({ 
                status: 'PROCESSING',
                mpesa_payout_id: payoutResponse.ConversationID || payoutResponse.OriginatorConversationID
              })
              .eq('id', payout.id);
          }
        }
      } catch (error) {
        console.error('Automated B2C Payout failed:', error);
      }
    }

    // 7. Send Notifications (Email)
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          order_number,
          seller_receivable,
          product:products(title),
          buyer:users!orders_buyer_id_fkey(email, first_name),
          seller:users!orders_seller_id_fkey(email, first_name)
        `)
        .eq('id', orderId)
        .single();

      if (orderData) {
        const { order_number, seller_receivable, product, buyer, seller } = orderData as any;

        // Notify Buyer of Completion
        if (buyer?.email) {
          const buyerTemplate = EmailTemplates.orderCompletedBuyer(
            buyer.first_name || 'Customer',
            order_number,
            product?.title || 'Your Item'
          );
          await sendEmail({
            to: buyer.email,
            subject: buyerTemplate.subject,
            html: buyerTemplate.html
          });
        }

        // Notify Seller of Payout
        if (seller?.email) {
          const sellerTemplate = EmailTemplates.payoutInitiatedSeller(
            seller.first_name || 'Seller',
            seller_receivable.toLocaleString(),
            order_number
          );
          await sendEmail({
            to: seller.email,
            subject: sellerTemplate.subject,
            html: sellerTemplate.html
          });
        }
      }
    } catch (mailError) {
      console.error('Completion Mail Error:', mailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Delivery confirmed! Funds are being processed for payout to your wallet.' 
    });
  } catch (error: any) {
    console.error('Confirm Delivery Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
