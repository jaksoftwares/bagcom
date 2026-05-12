import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { MpesaService } from '@/services/mpesa';


/**
 * Payments Checkout API Endpoint
 * URL: /api/payments/checkout
 */

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { orderId, phoneNumber } = await request.json();

    
    if (!orderId || !phoneNumber) {
      return NextResponse.json({ error: 'Order ID and phone number are required' }, { status: 400 });
    }

    // 1. Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, product:products(title)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'PENDING_PAYMENT') {
      return NextResponse.json({ error: 'Order is not in a payable state' }, { status: 400 });
    }

    // 2. Initiate STK Push via MpesaService
    const stkResponse = await MpesaService.initiateSTKPush(
      phoneNumber,
      order.total_amount,
      order.order_number
    );

    // 3. Log the transaction attempt
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        order_id: orderId,
        checkout_request_id: stkResponse.CheckoutRequestID,
        merchant_request_id: stkResponse.MerchantRequestID,
        payer_phone: phoneNumber,
        amount: order.total_amount,
        status: 'PENDING'
      });

    if (transactionError) console.error('Transaction logging error:', transactionError);

    return NextResponse.json({ 
      success: true, 
      message: 'Payment request sent to your phone. Please enter PIN.',
      checkoutRequestId: stkResponse.CheckoutRequestID
    });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
