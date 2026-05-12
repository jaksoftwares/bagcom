import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Support Tickets Management API
 * URL: /api/admin/tickets
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ tickets });
  } catch (error: any) {
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
