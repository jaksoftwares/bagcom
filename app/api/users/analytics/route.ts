import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * Seller Analytics API Endpoint
 * URL: /api/users/analytics
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 });
    }

    // 1. Query the 'view_seller_performance' SQL View
    const { data: sellerMetrics, error } = await supabase
      .from('view_seller_performance')
      .select('*')
      .eq('seller_id', sellerId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows found
    
    return NextResponse.json({
      sellerMetrics: sellerMetrics || {
        total_products_listed: 0,
        total_product_views: 0,
        total_completed_sales: 0,
        total_revenue_earned: 0,
        pending_revenue_in_escrow: 0
      }
    });
  } catch (error: any) {
    console.error('Seller Analytics Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
