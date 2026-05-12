import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin Financials API
 * URL: /api/admin/financials
 */
export async function GET() {
  try {
    const supabase = createServerClient();

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

    const { data: transactions, error } = await supabase
      .from('escrow_transactions')
      .select('*, order:orders(order_number, total_amount, status)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error('Admin Financials GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
