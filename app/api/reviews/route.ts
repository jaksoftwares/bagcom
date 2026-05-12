import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';


/**
 * User Reviews API Endpoint
 * URL: /api/reviews
 */

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: 'sellerId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*, reviewer:users!reviews_reviewer_id_fkey(first_name, last_name, profile_photo_url)')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reviews: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { reviewer_id, seller_id, order_id, rating, comment } = body;

    if (!reviewer_id || !seller_id || !order_id || !rating) {
      return NextResponse.json({ error: 'reviewer_id, seller_id, order_id, and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Verify the order is completed and the reviewer is the buyer
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, buyer_id')
      .eq('id', order_id)
      .eq('buyer_id', reviewer_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'No completed order found for this review' }, { status: 403 });
    }

    if (order.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'You can only review a seller after the order is completed' }, { status: 403 });
    }

    // Check for duplicate review on same order
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('order_id', order_id)
      .eq('reviewer_id', reviewer_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this order' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({ reviewer_id, seller_id, order_id, rating, comment })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

