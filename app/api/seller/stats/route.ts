import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Seller Analytics API
 * URL: /api/seller/stats
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    
    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Fetch performance from the database view
    const { data: performance, error: perfError } = await supabase
      .from('view_seller_performance')
      .select('*')
      .eq('seller_id', sellerId)
      .single();

    // 2. Fetch recent earnings trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: earnings } = await supabase
      .from('payouts')
      .select('amount, created_at')
      .eq('seller_id', sellerId)
      .eq('status', 'COMPLETED')
      .gte('created_at', thirtyDaysAgo.toISOString());

    // 3. Fetch orders by status for breakdown
    const { data: orderStats } = await supabase
      .from('orders')
      .select('status, total_amount')
      .eq('seller_id', sellerId);

    const statusBreakdown = orderStats?.reduce((acc: any, curr: any) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      performance: performance || {
        total_products_listed: 0,
        total_product_views: 0,
        total_completed_sales: 0,
        total_revenue_earned: 0,
        pending_revenue_in_escrow: 0
      },
      earningsHistory: earnings || [],
      statusBreakdown: statusBreakdown || {}
    });

  } catch (error: any) {
    console.error('Seller Stats Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
