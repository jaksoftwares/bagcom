import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin User Detail API
 * URL: /api/admin/users/[id]
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const userId = params.id;

    // 1. Auth check (Note: in current setup, getUser() may return null on server due to lack of SSR cookie handling)
    const { data: { user: admin } } = await supabase.auth.getUser();
    if (admin) {
      const { data: profile } = await supabase.from('users').select('role').eq('id', admin.id).single();
      if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // 2. Fetch User Profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Fetch User Statistics (Orders & Sales)
    const { data: buyerOrders } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    const { data: sellerOrders } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    // 4. Fetch Support Tickets
    const { data: tickets } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // 5. Fetch User Products
    const { data: products } = await supabase
      .from('products')
      .select('id, title, price, is_available, created_at')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    // 6. Fetch Audit Logs for this user
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select(`
        *,
        admin:users!audit_logs_admin_id_fkey(first_name, last_name)
      `)
      .eq('entity_type', 'USER')
      .eq('entity_id', userId)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      user: userData,
      stats: {
        totalSpent: buyerOrders?.reduce((sum, o) => sum + (o.status === 'COMPLETED' ? o.total_amount : 0), 0) || 0,
        totalEarned: sellerOrders?.reduce((sum, o) => sum + (o.status === 'COMPLETED' ? o.total_amount : 0), 0) || 0,
        orderCount: buyerOrders?.length || 0,
        salesCount: sellerOrders?.length || 0,
        productCount: products?.length || 0
      },
      activity: {
        orders: [...(buyerOrders || []), ...(sellerOrders || [])].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 10),
        products: products || [],
        tickets: tickets || [],
        auditLogs: auditLogs || []
      }
    });

  } catch (error: any) {
    console.error('User Detail Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
