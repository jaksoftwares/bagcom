import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendEmail, EmailTemplates } from '@/lib/mail';

/**
 * Disputes API Endpoint
 * URL: /api/disputes
 * Handles the initiation of an order dispute, freezing escrow funds.
 */

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    
    const { data: disputes, error } = await supabase
      .from('disputes')
      .select(`
        *,
        order:orders(
          id,
          order_number,
          total_amount,
          status,
          product:products(title),
          buyer:users!orders_buyer_id_fkey(first_name, last_name, email),
          seller:users!orders_seller_id_fkey(first_name, last_name, email)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ disputes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { order_id, user_id, reason, description, evidence_urls = [] } = await request.json();
    
    if (!order_id || !user_id || !reason) {
      return NextResponse.json({ error: 'Order ID, User ID, and Reason are required' }, { status: 400 });
    }

    // 1. Fetch order to verify state and ownership
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, escrow_transactions(*)')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Verify order is in a disputable state
    const disputableStatuses = ['PAYMENT_SUCCESS', 'DELIVERED', 'HELD_IN_ESCROW', 'OUT_FOR_DELIVERY'];
    if (!disputableStatuses.includes(order.status)) {
      return NextResponse.json({ error: 'Order is not in a disputable state' }, { status: 400 });
    }

    // 3. Create dispute record
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .insert({
        order_id,
        raised_by: user_id,
        reason,
        description,
        evidence_urls,
        status: 'OPEN'
      })
      .select()
      .single();

    if (disputeError) throw disputeError;

    // 4. Freeze Escrow and Update Order Status
    const now = new Date().toISOString();
    
    await Promise.all([
      // Update order status
      supabase
        .from('orders')
        .update({ 
          status: 'DISPUTED',
          updated_at: now
        })
        .eq('id', order_id),
      
      // Update escrow status
      supabase
        .from('escrow_transactions')
        .update({ 
          escrow_status: 'DISPUTED',
          updated_at: now
        })
        .eq('order_id', order_id)
    ]);

    // 5. Send notifications
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          order_number,
          product:products(title),
          buyer:users!orders_buyer_id_fkey(email, first_name),
          seller:users!orders_seller_id_fkey(email, first_name)
        `)
        .eq('id', order_id)
        .single();

      if (orderData) {
        const { order_number, product, buyer, seller } = orderData as any;

        // Notify Buyer
        if (buyer?.email) {
          const buyerTemplate = EmailTemplates.disputeRaisedBuyer(
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

        // Notify Seller
        if (seller?.email) {
          const sellerTemplate = EmailTemplates.disputeNotificationSeller(
            seller.first_name || 'Seller',
            order_number,
            product?.title || 'Your Item'
          );
          await sendEmail({
            to: seller.email,
            subject: sellerTemplate.subject,
            html: sellerTemplate.html
          });
        }

        // Notify Admin
        const adminEmail = process.env.ADMIN_EMAIL || 'dovepeakdigital@gmail.com';
        await sendEmail({
          to: adminEmail,
          subject: `URGENT: New Dispute Case - Order #${order_number}`,
          html: `
            <h1>New Dispute Case Raised</h1>
            <p><strong>Order:</strong> #${order_number}</p>
            <p><strong>Product:</strong> ${product?.title}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Description:</strong> ${description}</p>
            <hr />
            <a href="https://bagcom.dovepeakdigital.com/admin/disputes">Resolve in Admin Dashboard</a>
          `
        });
      }
    } catch (mailError) {
      console.error('Dispute Mail Error:', mailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Dispute opened successfully. Escrow funds have been frozen.',
      dispute
    }, { status: 201 });
  } catch (error: any) {
    console.error('Dispute POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
