import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendEmail, EmailTemplates } from '@/lib/mail';

/**
 * Approve or Reject Seller Application
 * URL: /api/admin/sellers/approve
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { sellerId, action } = await request.json();

    if (!sellerId || !action) {
      return NextResponse.json({ error: 'Seller ID and action are required' }, { status: 400 });
    }

    const { data: { user: admin } } = await supabase.auth.getUser();
    const now = new Date().toISOString();

    let updateData: any = {};
    if (action === 'APPROVE') {
      updateData = {
        seller_status: 'APPROVED',
        approved_at: now,
        approved_by: admin?.id
      };
    } else if (action === 'REJECT') {
      updateData = {
        seller_status: 'REJECTED'
      };
    }

    const { data: user, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', sellerId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Send Notification Email
    try {
      if (user.email) {
        let template;
        if (action === 'APPROVE') {
          template = EmailTemplates.sellerApprovedEmail(user.first_name || 'Seller', user.business_name || 'your store');
        } else {
          template = EmailTemplates.sellerRejectedEmail(user.first_name || 'Seller');
        }

        if (template) {
          await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html
          });
        }
      }
    } catch (mailError) {
      console.error('Approval Mail Error:', mailError);
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Seller Approval Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
