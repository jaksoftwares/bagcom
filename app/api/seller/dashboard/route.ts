import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Fetch Stats using the RPC function
    const { data: statsData, error: statsError } = await supabase.rpc(
      'get_seller_dashboard_stats',
      { p_seller_id: userId }
    );

    if (statsError) {
      console.error('Stats RPC Error:', statsError);
      // Fallback if RPC is not yet created in the DB (for graceful degradation)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    // 2. Fetch Recent Orders (Limit to 5)
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        seller_receivable,
        created_at,
        product:products(id, title, slug, price, condition, location:locations(city, formatted_address)),
        buyer:users!orders_buyer_id_fkey(id, first_name, last_name, phone_number),
        seller:users!orders_seller_id_fkey(id, first_name, last_name, phone_number, city)
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (ordersError) {
      console.error('Recent Orders Error:', ordersError);
    }

    // Stats comes as a JSON object from the RPC
    const defaultStats = {
      totalEarnings: 0,
      pendingEscrow: 0,
      activeListings: 0,
      totalOrders: 0,
      availableBalance: 0,
      totalWithdrawn: 0
    };

    return NextResponse.json({ 
      stats: statsData || defaultStats, 
      recentOrders: recentOrders || [] 
    });

  } catch (error: any) {
    console.error('Seller Dashboard API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
