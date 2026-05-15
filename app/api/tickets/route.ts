import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/mail';

/**
 * Public Ticket Submission API
 * URL: /api/tickets
 * Allows users to raise support tickets.
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { name, email, topic, message, priority = 'NORMAL' } = await request.json();

    if (!email || !topic || !message) {
      return NextResponse.json({ error: 'Email, Topic, and Message are required' }, { status: 400 });
    }

    // 1. Get user if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Create ticket record
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user?.id || null, // Link to user if logged in
        subject: `[${topic}] from ${name || email}`,
        description: message,
        status: 'OPEN',
        priority: priority,
        metadata: {
          guest_name: name,
          guest_email: email,
          submitted_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (ticketError) throw ticketError;

    // 3. Optional: Notify admin via email
    const adminEmail = process.env.ADMIN_EMAIL || 'dovepeakdigital@gmail.com';
    try {
      await sendEmail({
        to: adminEmail,
        subject: `NEW TICKET: ${topic}`,
        html: `
          <h1>New Support Ticket</h1>
          <p><strong>From:</strong> ${name || 'Guest'} (${email})</p>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr />
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/tickets">View in Admin Panel</a>
        `
      });
    } catch (mailError) {
      console.error('Ticket Notification Mail Error:', mailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Ticket received. Our team will contact you shortly.',
      ticketId: ticket.id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Public Ticket POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
