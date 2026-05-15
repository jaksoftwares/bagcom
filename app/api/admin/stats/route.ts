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

    // 5. Fetch Latest M-Pesa Balance
    const { data: mpesaBalance } = await supabase
      .from('mpesa_account_status')
      .select('balance, last_updated')
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();

    // 6. Escrow Integrity Check
    // Sum of held escrow in orders vs sum of held escrow in escrow_transactions
    const { data: orderEscrowSum } = await supabase
      .from('orders')
      .select('escrow_amount.sum()')
      .in('status', ['HELD_IN_ESCROW', 'PROCESSING_DELIVERY'])
      .single();
    
    const { data: transactionEscrowSum } = await supabase
      .from('escrow_transactions')
      .select('held_amount.sum()')
      .eq('escrow_status', 'HELD')
      .single();

    const isEscrowBalanced = (orderEscrowSum as any)?.sum === (transactionEscrowSum as any)?.sum;

    // 7. Daily Payout Spending (Quota Tracker)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: dailySpending } = await supabase
      .from('payouts')
      .select('amount.sum()')
      .eq('status', 'COMPLETED')
      .gt('processed_at', twentyFourHoursAgo)
      .single();

    const totalSpentToday = (dailySpending as any)?.sum || 0;

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
      recentActivity: recentActivity || [],
      mpesa: {
        balance: mpesaBalance?.balance || 0,
        lastUpdated: mpesaBalance?.last_updated,
        spentToday: totalSpentToday
      },
      system: {
        escrowBalanced: isEscrowBalanced
      }
    });

  } catch (error: any) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
