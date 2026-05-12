import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendEmail, EmailTemplates } from '@/lib/mail';


/**
 * Safaricom M-PESA STK Push Callback Endpoint
 * URL: /api/mpesa/stk/callback
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { Body } = body;
    
    if (!Body || !Body.stkCallback) {
      console.error('M-PESA Callback: Invalid payload structure', body);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
    }

    const { stkCallback } = Body;
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // 1. Fetch the original transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('checkout_request_id', checkoutRequestID)
      .single();

    if (fetchError || !transaction) {
      console.error('M-PESA Callback: Transaction not found', checkoutRequestID);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Transaction not found' });
    }

    const now = new Date().toISOString();

    if (resultCode === 0) {
      // Success
      const callbackMetadata = stkCallback.CallbackMetadata.Item;
      const amount = callbackMetadata.find((i: any) => i.Name === 'Amount')?.Value;
      const mpesaReceipt = callbackMetadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      
      // Update Transaction
      await supabase
        .from('payment_transactions')
        .update({
          status: 'SUCCESS' as const,
          mpesa_receipt_number: (mpesaReceipt as string) || null,
          result_code: resultCode?.toString() || '0',
          result_description: resultDesc as string,
          callback_received_at: now,
          raw_callback: body as any
        })
        .eq('id', transaction.id);


      // Get all associated orders from metadata
      const orderIds = (transaction.metadata as any)?.order_ids || [transaction.order_id];
      
      for (const order_id of orderIds) {
        if (!order_id) continue;

        // Update Order Status
        await supabase
          .from('orders')
          .update({
            status: 'PAYMENT_SUCCESS' as const,
            updated_at: now
          })
          .eq('id', order_id);

        // Create Escrow Record
        // Note: For bulk orders, we'd ideally split the amount, but for now we'll fetch the order's total
        const { data: currentOrder } = await supabase.from('orders').select('total_amount').eq('id', order_id).single();
        
        await supabase
          .from('escrow_transactions')
          .insert({
            order_id: order_id,
            held_amount: currentOrder?.total_amount || 0,
            escrow_status: 'HELD_IN_ESCROW',
            held_at: now
          });

        // 4. Send Notifications (Email)
        try {
          const { data: orderData } = await supabase
            .from('orders')
            .select(`
              order_number,
              delivery_code,
              total_amount,
              product:products(title),
              buyer:users!orders_buyer_id_fkey(email, first_name),
              seller:users!orders_seller_id_fkey(email, first_name)
            `)
            .eq('id', order_id)
            .single();

          if (orderData) {
            const { order_number, delivery_code, total_amount, product, buyer, seller } = orderData as any;
            
            // Notify Buyer
            if (buyer?.email) {
              const buyerTemplate = EmailTemplates.orderConfirmation(
                buyer.first_name || 'Customer',
                order_number,
                product?.title || 'Your Item',
                total_amount.toLocaleString(),
                delivery_code
              );
              await sendEmail({
                to: buyer.email,
                subject: buyerTemplate.subject,
                html: buyerTemplate.html
              });
            }

            // Notify Seller
            if (seller?.email) {
              const sellerTemplate = EmailTemplates.newOrderForSeller(
                seller.first_name || 'Seller',
                order_number,
                product?.title || 'Your Item',
                total_amount.toLocaleString()
              );
              await sendEmail({
                to: seller.email,
                subject: sellerTemplate.subject,
                html: sellerTemplate.html
              });
            }
          }
        } catch (mailError) {
          console.error('Callback Mail Error:', mailError);
        }
      }


    } else {
      // Failed (ResultCode != 0)
      await supabase
        .from('payment_transactions')
        .update({
          status: 'FAILED' as const,
          result_code: resultCode?.toString() || '1',
          result_description: resultDesc as string,
          callback_received_at: now,
          raw_callback: body as any
        })
        .eq('id', transaction.id);


      const orderIds = (transaction.metadata as any)?.order_ids || [transaction.order_id];
      for (const order_id of orderIds) {
        if (!order_id) continue;
        await supabase
          .from('orders')
          .update({
            status: 'FAILED' as const,
            updated_at: now
          })
          .eq('id', order_id);
      }

    }

    // Safaricom expects a success response so they don't retry
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error('STK Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Server Error' });
  }
}
