import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { ticketId: string } }) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('id, user_id')
      .eq('id', params.ticketId)
      .single();

    if (ticketError || !ticket || ticket.user_id !== userId) {
      return NextResponse.json({ error: 'Ticket not found or unauthorized' }, { status: 404 });
    }

    const { data: responses, error } = await supabase
      .from('support_responses')
      .select(`
        id,
        message,
        created_at,
        is_internal,
        sender:users!support_responses_sender_id_fkey(id, first_name, last_name, role)
      `)
      .eq('ticket_id', params.ticketId)
      .eq('is_internal', false) // Users cannot see internal notes
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ responses });
  } catch (error: any) {
    console.error('Fetch Ticket Responses Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { ticketId: string } }) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { userId, message } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('id, user_id')
      .eq('id', params.ticketId)
      .single();

    if (ticketError || !ticket || ticket.user_id !== userId) {
      return NextResponse.json({ error: 'Ticket not found or unauthorized' }, { status: 404 });
    }

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { data: response, error } = await supabase
      .from('support_responses')
      .insert({
        ticket_id: params.ticketId,
        sender_id: userId,
        message,
        is_internal: false
      })
      .select()
      .single();

    if (error) throw error;

    // Update ticket updated_at
    await supabase.from('support_tickets').update({ updated_at: new Date().toISOString() }).eq('id', params.ticketId);

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error('Create Ticket Response Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
