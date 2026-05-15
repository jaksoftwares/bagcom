import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch Payouts with Order and Seller details
    const { data: payouts, error } = await supabase
      .from('payouts')
      .select(`
        *,
        order:orders(order_number, total_amount, status),
        seller:users(first_name, last_name, business_name, phone_number)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate Stats
    const stats = {
      pending: payouts.filter(p => p.status === 'PENDING').length,
      processing: payouts.filter(p => p.status === 'PROCESSING').length,
      completed: payouts.filter(p => p.status === 'SUCCESS' || p.status === 'COMPLETED').length,
      totalValue: payouts.reduce((sum, p) => sum + p.amount, 0)
    };

    return NextResponse.json({ payouts, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
