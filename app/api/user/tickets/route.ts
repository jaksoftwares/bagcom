import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/mail';

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('Fetch User Tickets Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { userId, subject, description, priority = 'MEDIUM' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }



    if (!subject || !description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 });
    }

    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        subject,
        description,
        status: 'OPEN',
        priority
      })
      .select()
      .single();

    if (ticketError) throw ticketError;

    // Optional: Notify admin via email
    const adminEmail = process.env.ADMIN_EMAIL || 'dovepeakdigital@gmail.com';
    try {
      const { data: profile } = await supabase.from('users').select('email, first_name').eq('id', userId).single();
      
      await sendEmail({
        to: adminEmail,
        subject: `NEW SUPPORT TICKET: ${subject}`,
        html: `
          <h1>New Support Ticket</h1>
          <p><strong>From:</strong> ${profile?.first_name || 'User'} (${profile?.email || 'Unknown'})</p>
          <p><strong>Topic:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${description}</p>
          <hr />
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/tickets">View in Admin Panel</a>
        `
      });
    } catch (mailError) {
      console.error('Ticket Notification Mail Error:', mailError);
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error('Create User Ticket Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
