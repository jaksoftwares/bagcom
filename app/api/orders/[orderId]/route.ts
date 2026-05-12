import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Get single order by ID
 * URL: /api/orders/[orderId]
 */
export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createServerClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        product:products(id, title, slug, price, condition),
        buyer:users!orders_buyer_id_fkey(id, first_name, last_name, phone_number),
        seller:users!orders_seller_id_fkey(id, first_name, last_name, phone_number)
      `)
      .eq('id', params.orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
