import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin Financials API
 * URL: /api/admin/financials
 */
export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // LIST or STATS

    // Verify Admin Authorization
    const { data: { user } } = await supabase.auth.getUser();
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

    if (type === 'STATS') {
      // 1. Fetch Escrow Stats
      const { data: escrowItems } = await supabase
        .from('escrow_transactions')
        .select('held_amount, escrow_status');

      // 2. Fetch M-Pesa Balance
      const { data: balanceData } = await supabase
        .from('mpesa_account_status')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(1);

      const activeEscrow = (escrowItems || []).reduce((sum, item) => 
        item.escrow_status === 'HELD' ? sum + item.held_amount : sum, 0);
      
      const settledRevenue = (escrowItems || []).reduce((sum, item) => 
        item.escrow_status === 'RELEASED' ? sum + (item.held_amount * 0.1) : sum, 0); // 10% platform fee assumption

      return NextResponse.json({
        stats: {
          mpesaBalance: balanceData?.[0]?.working_account || 0,
          activeEscrow: activeEscrow,
          settledRevenue: settledRevenue,
          totalTransactions: (escrowItems || []).length
        }
      });
    }

    // LIST VIEW
    const { data: transactions, error } = await supabase
      .from('escrow_transactions')
      .select(`
        *, 
        order:orders(
          order_number, 
          total_amount, 
          status, 
          buyer:users!orders_buyer_id_fkey(first_name, last_name, phone_number),
          seller:users!orders_seller_id_fkey(first_name, last_name, business_name, phone_number),
          payouts(*)
        )
      `)
      .order('held_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error('Admin Financials GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
