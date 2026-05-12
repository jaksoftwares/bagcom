import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin Financials API
 * URL: /api/admin/financials
 */
export async function GET() {
  try {
    const supabase = createServerClient();

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
