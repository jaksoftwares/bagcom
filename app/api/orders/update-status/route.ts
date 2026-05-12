import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendEmail, EmailTemplates } from '@/lib/mail';

/**
 * Generic Order Status Update API
 * URL: /api/orders/update-status
 */
export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient();
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    // 1. Update Order Status
    const now = new Date().toISOString();
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        status: status,
        updated_at: now
      })
      .eq('id', orderId)
      .select(`
        order_number,
        product:products(title),
        buyer:users!orders_buyer_id_fkey(email, first_name)
      `)
      .single();

    if (updateError || !order) {
      throw new Error(updateError?.message || 'Failed to update order status');
    }

    const { order_number, product, buyer } = order as any;

    // 2. Trigger Email Notification based on Status
    if (buyer?.email) {
      let template;
      
      switch (status) {
        case 'PRODUCT_LOCKED':
          template = EmailTemplates.itemReservedBuyer(
            buyer.first_name || 'Customer',
            order_number,
            product?.title || 'Your Item'
          );
          break;
          
        case 'OUT_FOR_DELIVERY':
          template = EmailTemplates.outForDeliveryBuyer(
            buyer.first_name || 'Customer',
            order_number,
            product?.title || 'Your Item'
          );
          break;
      }

      if (template) {
        await sendEmail({
          to: buyer.email,
          subject: template.subject,
          html: template.html
        });
      }
    }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error('Update Status Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
