import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin Ticket Responses List API
 * URL: /api/admin/tickets/[id]/responses
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    const { data: responses, error } = await supabase
      .from('support_responses')
      .select(`
        *,
        sender:users!support_responses_sender_id_fkey(first_name, last_name, role)
      `)
      .eq('ticket_id', params.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ responses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
