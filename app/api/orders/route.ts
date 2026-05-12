import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Orders API Endpoint
 * URL: /api/orders
 * Uses service-role client to bypass RLS for server-side operations.
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
    const body = await request.json();
    const { buyer_id, product_id, quantity = 1 } = body;

    if (!buyer_id || !product_id) {
      return NextResponse.json({ error: 'Missing required fields: buyer_id and product_id' }, { status: 400 });
    }

    // 0. Ensure buyer profile exists in public.users (JIT Sync)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', buyer_id)
      .single();

    if (!existingUser) {
      console.log('User profile missing in public.users, attempting JIT sync for:', buyer_id);
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

    // 1. Fetch product and verify it is available

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.is_available) {
      return NextResponse.json({ error: 'This item is no longer available' }, { status: 409 });
    }

    // 2. Calculate amounts (10% platform commission, escrow holds full amount)
    const subtotal = product.price * quantity;
    const commission = Math.round(subtotal * 0.10);
    const total = subtotal;            // Buyer pays the base price
    const escrow = subtotal;           // Full amount held in escrow
    const sellerReceivable = subtotal - commission;

    // 3. Generate unique order number — format: BGC-YYYYMMDD-XXXXXX
    const today = new Date();
    const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderNumber = `BGC-${datePart}-${randPart}`;

    // 4. Generate unique delivery/verification code — format: BGX-XXXXXX
    // This is the code the buyer shares with the seller upon delivery confirmation.
    const verificationCode = 'BGX-' + Math.floor(100000 + Math.random() * 900000).toString();
    const deliveryCodeExpires = new Date();
    deliveryCodeExpires.setDate(deliveryCodeExpires.getDate() + 7); // Valid for 7 days

    // 5. Insert order using service role (bypasses RLS)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id,
        seller_id: product.seller_id,
        product_id,
        order_number: orderNumber,
        quantity,
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

    if (orderError) throw orderError;

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('Orders POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
