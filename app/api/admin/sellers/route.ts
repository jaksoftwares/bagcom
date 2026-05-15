import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Unified Admin Sellers API
 * URL: /api/admin/sellers
 */
export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ALL'; // PENDING, APPROVED, REJECTED, ALL
    const type = searchParams.get('type') || 'LIST'; // LIST or STATS

    if (type === 'STATS') {
      const { data: statsData, error: statsError } = await supabase
        .from('users')
        .select('seller_status, role');
      
      if (statsError) throw statsError;

      const sellers = statsData.filter(u => u.role === 'SELLER');
      
      return NextResponse.json({
        stats: {
          pending: sellers.filter(s => s.seller_status === 'PENDING').length,
          approved: sellers.filter(s => s.seller_status === 'APPROVED').length,
          rejected: sellers.filter(s => s.seller_status === 'REJECTED').length,
          total: sellers.length
        }
      });
    }

    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'SELLER')
      .order('created_at', { ascending: false });

    if (status !== 'ALL') {
      query = query.eq('seller_status', status);
    }

    const { data: sellers, error } = await query;
    if (error) throw error;

    return NextResponse.json({ sellers });
  } catch (error: any) {
    console.error('Admin Sellers GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
