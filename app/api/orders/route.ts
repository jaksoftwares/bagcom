import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isMaintenanceMode, getCommissionRate } from '@/lib/settings';

/**
 * Orders API Endpoint
 * URL: /api/orders
 */

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role'); // 'buyer' or 'seller'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        product:products(id, title, slug, price, condition),
        buyer:users!orders_buyer_id_fkey(id, first_name, last_name, phone_number),
        seller:users!orders_seller_id_fkey(id, first_name, last_name, phone_number)
      `);

    if (role === 'buyer') {
      query = query.eq('buyer_id', userId);
    } else if (role === 'seller') {
      query = query.eq('seller_id', userId);
    } else {
      query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders: data });
  } catch (error: any) {
    console.error('Orders GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();

    // 0. Check Maintenance Mode
    if (await isMaintenanceMode()) {
      return NextResponse.json({ 
        error: 'The marketplace is currently undergoing scheduled maintenance. Please try again later.' 
      }, { status: 503 });
    }

    const body = await request.json();
    const { buyer_id, product_id, quantity = 1, items } = body;

    if (!buyer_id && !items) {
      return NextResponse.json({ error: 'Missing buyer_id' }, { status: 400 });
    }

    // 1. Ensure buyer profile exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', buyer_id)
      .single();

    if (!existingUser) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(buyer_id);
      if (!authError && authUser) {
        await supabase.from('users').insert({
          id: authUser.id,
          email: authUser.email!,
          first_name: authUser.user_metadata?.first_name || 'Buyer',
          last_name: authUser.user_metadata?.last_name || '',
          role: authUser.user_metadata?.role || 'BUYER'
        });
      }
    }

    // 2. Prepare items to process
    const itemsToProcess = items || [{ product_id, quantity }];
    const createdOrders = [];
    const rate = await getCommissionRate();

    for (const item of itemsToProcess) {
      const { product_id: p_id, quantity: qty } = item;
      
      // Fetch product
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', p_id)
        .single();

      if (!product || !product.is_available) continue;

      // Calculate amounts
      const subtotal = product.price * qty;
      const commission = Math.round(subtotal * rate);
      const total = subtotal;
      const escrow = subtotal;
      const sellerReceivable = subtotal - commission;

      // Metadata
      const today = new Date();
      const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
      const randPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const orderNumber = `BGC-${datePart}-${randPart}`;
      const verificationCode = 'BGX-' + Math.floor(100000 + Math.random() * 900000).toString();
      const deliveryCodeExpires = new Date();
      deliveryCodeExpires.setDate(deliveryCodeExpires.getDate() + 7);

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id,
          seller_id: product.seller_id,
          product_id: p_id,
          order_number: orderNumber,
          quantity: qty,
          subtotal_amount: subtotal,
          commission_amount: commission,
          total_amount: total,
          escrow_amount: escrow,
          seller_receivable: sellerReceivable,
          status: 'PENDING_PAYMENT',
          delivery_code: verificationCode,
          delivery_code_expires_at: deliveryCodeExpires.toISOString()
        })
        .select()
        .single();

      if (!orderError && order) {
        createdOrders.push(order);
      }
    }

    if (createdOrders.length === 0) {
      return NextResponse.json({ error: 'No orders could be created' }, { status: 400 });
    }

    return NextResponse.json({ success: true, orders: createdOrders, order: createdOrders[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Orders POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
