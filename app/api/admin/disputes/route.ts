import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin Dispute Management API
 * URL: /api/admin/disputes
 */
export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type'); //

    if (type === 'STATS') {
      const { data: allDisputes, error: statsError } = await supabase
        .from('disputes')
        .select('status, order:orders(total_amount)');
      
      if (statsError) throw statsError;

      const active = allDisputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW');
      const resolved = allDisputes.filter(d => d.status === 'RESOLVED' || d.status === 'CLOSED');
      const totalAmount = active.reduce((sum: number, d: any) => {
        const order = Array.isArray(d.order) ? d.order[0] : d.order;
        return sum + (order?.total_amount || 0);
      }, 0);

      return NextResponse.json({
        stats: {
          total: allDisputes.length,
          active: active.length,
          resolved: resolved.length,
          frozenAmount: totalAmount
        }
      });
    }

    let query = supabase
      .from('disputes')
      .select(`
        *,
        order:orders(
          *,
          product:products(*, images:product_images(image_url)),
          buyer:users!orders_buyer_id_fkey(*),
          seller:users!orders_seller_id_fkey(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'ALL') {
      if (status === 'ACTIVE') {
        query = query.in('status', ['OPEN', 'UNDER_REVIEW']);
      } else {
        query = query.eq('status', status);
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ disputes: data });
  } catch (error: any) {
    console.error('Admin Disputes GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
