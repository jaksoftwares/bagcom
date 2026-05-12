import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Admin Ticket Response API
 * URL: /api/admin/tickets/[id]/respond
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { message, isInternal = false } = await request.json();

    const { data: { user: admin } } = await supabase.auth.getUser();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Insert the response
    const { data: response, error: responseError } = await supabase
      .from('support_responses')
      .insert({
        ticket_id: params.id,
        sender_id: admin.id,
        message,
        is_internal: isInternal
      })
      .select()
      .single();

    if (responseError) throw responseError;

    // 2. Update ticket status to IN_PROGRESS if it was OPEN
    await supabase
      .from('support_tickets')
      .update({ 
        status: 'IN_PROGRESS', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', params.id)
      .eq('status', 'OPEN');

    // 3. Notify the user if it's not an internal note
    if (!isInternal) {
      const { data: ticket } = await supabase
        .from('support_tickets')
        .select('user_id, subject')
        .eq('id', params.id)
        .single();

      if (ticket) {
        await supabase.from('notifications').insert({
          user_id: ticket.user_id,
          type: 'SUPPORT',
          title: `Update on: ${ticket.subject}`,
          body: 'An admin has responded to your support ticket.',
          channel: 'IN_APP'
        });
      }
    }

    await logAdminAction(admin.id, 'RESPOND_TO_TICKET', 'TICKET', params.id, { isInternal });

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
