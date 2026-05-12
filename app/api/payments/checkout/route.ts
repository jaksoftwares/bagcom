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
    const { orderId, orderIds, phoneNumber } = await request.json();

    const targetOrderId = orderId || (orderIds && orderIds[0]);
    
    if (!targetOrderId || !phoneNumber) {
      return NextResponse.json({ error: 'Order ID and phone number are required' }, { status: 400 });
    }

    // 1. Fetch order details (using the first order to get the amount if not provided, 
    // or we calculate total from all orders)
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('*, product:products(title)')
      .in('id', orderIds || [targetOrderId]);

    if (orderError || !orders || orders.length === 0) {
      return NextResponse.json({ error: 'Orders not found' }, { status: 404 });
    }

    const totalAmount = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const orderNumber = orders.length > 1 ? `BULK-${Date.now()}` : orders[0].order_number;

    // 2. Initiate STK Push via MpesaService
    const stkResponse = await MpesaService.initiateSTKPush(
      phoneNumber,
      totalAmount,
      orderNumber
    );

    // 3. Log the transaction attempt
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        order_id: targetOrderId,
        checkout_request_id: stkResponse.CheckoutRequestID,
        merchant_request_id: stkResponse.MerchantRequestID,
        payer_phone: phoneNumber,
        amount: totalAmount,
        status: 'PENDING',
        metadata: { order_ids: orderIds || [targetOrderId] }
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
