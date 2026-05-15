import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Support Tickets Management API
 * URL: /api/admin/tickets
 */
export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type'); // LIST or STATS

    if (type === 'STATS') {
      const { data: tickets, error: statsError } = await supabase
        .from('support_tickets')
        .select('status, priority');
      
      if (statsError) throw statsError;

      return NextResponse.json({
        stats: {
          total: tickets.length,
          open: tickets.filter(t => t.status === 'OPEN').length,
          high: tickets.filter(t => t.priority === 'HIGH' && t.status !== 'RESOLVED').length,
          resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
        }
      });
    }

    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'ALL') {
      if (status === 'ACTIVE') {
        query = query.in('status', ['OPEN', 'IN_PROGRESS']);
      } else {
        query = query.eq('status', status);
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ tickets: data });
  } catch (error: any) {
    console.error('Admin Tickets GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient();
    const { ticketId, status, priority } = await request.json();

    const { data: { user: admin } } = await supabase.auth.getUser();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .update({ 
        status, 
        priority, 
        assigned_admin_id: admin.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;

    await logAdminAction(admin.id, 'UPDATE_TICKET', 'TICKET', ticketId, { status, priority });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
