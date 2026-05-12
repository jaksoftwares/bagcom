import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';


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


      // Update Order Status
      if (transaction.order_id) {
        await supabase
          .from('orders')
          .update({
            status: 'PAYMENT_SUCCESS' as const,
            updated_at: now
          })
          .eq('id', transaction.order_id);

        // Create Escrow Record
        await supabase
          .from('escrow_transactions')
          .insert({
            order_id: transaction.order_id,
            held_amount: Number(amount),
            escrow_status: 'HELD_IN_ESCROW',
            held_at: now
          });
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


      if (transaction.order_id) {
        await supabase
          .from('orders')
          .update({
            status: 'FAILED' as const,
            updated_at: now
          })
          .eq('id', transaction.order_id);
      }

    }

    // Safaricom expects a success response so they don't retry
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error('STK Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Server Error' });
  }
}
