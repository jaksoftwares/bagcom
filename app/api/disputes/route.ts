import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Disputes API Endpoint
 * URL: /api/disputes
 * Handles the initiation of an order dispute, freezing escrow funds.
 */
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

    // TODO: Send notifications to admin and seller

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
