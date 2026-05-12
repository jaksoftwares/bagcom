import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Fetch Pending Seller Applications
 * URL: /api/admin/sellers/pending
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data: sellers, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'SELLER')
      .eq('seller_status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ sellers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
