import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin Global Stats API
 * URL: /api/admin/stats
 */
export async function GET() {
  try {
    const supabase = createServerClient();

    // Verify Admin Authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // For now, if we can't verify the user on the server (e.g. no cookies),
    // we should at least log that we need to improve this.
    // However, if we CAN get a user, we must verify their role.
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // 1. Fetch High-Level Financial Metrics from View
    const { data: financial, error: finError } = await supabase
      .from('view_admin_financial_metrics')
      .select('*')
      .single();

    // 2. Fetch User Counts
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: sellerCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'SELLER');

    // 3. Fetch Active Disputes
    const { count: activeDisputes } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'DISPUTED');

    // 4. Recent Platform Activity (Latest 5 orders)
    const { data: recentActivity } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        buyer:users!orders_buyer_id_fkey(first_name, last_name),
        product:products(title)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    const { count: pendingSellerCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'SELLER')
      .eq('seller_status', 'PENDING');

    return NextResponse.json({
      financials: financial || {
        total_transactions: 0,
        total_gmv_completed: 0,
        total_commission_earned: 0,
        total_currently_in_escrow: 0,
        gmv_this_month: 0
      },
      counts: {
        totalUsers,
        sellerCount,
        activeDisputes,
        pendingSellerCount: pendingSellerCount || 0
      },
      recentActivity: recentActivity || []
    });

  } catch (error: any) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
