import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendEmail, EmailTemplates } from '@/lib/mail';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Approve or Reject Seller Application
 * URL: /api/admin/sellers/approve
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { sellerId, action, reason } = await request.json();

    if (!sellerId || !action) {
      return NextResponse.json({ error: 'Seller ID and action are required' }, { status: 400 });
    }

    const { data: { user: admin } } = await supabase.auth.getUser();
    const now = new Date().toISOString();

    let updateData: any = {};
    if (action === 'APPROVE') {
      updateData = {
        seller_status: 'APPROVED'
      };
    } else if (action === 'REJECT') {
      updateData = {
        seller_status: 'REJECTED',
        kyc_notes: reason ? `Rejected: ${reason}` : 'Rejected by administrator'
      };
    }

    const { data: user, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', sellerId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Record Audit Log
    if (admin) {
      await logAdminAction(admin.id, `${action}_SELLER`, 'USER', sellerId, { status: updateData.seller_status });
    }

    // Send Notification Email
    try {
      if (user.email) {
        let template;
        if (action === 'APPROVE') {
          template = EmailTemplates.sellerApprovedEmail(user.first_name || 'Seller', user.business_name || 'your store');
        } else {
          template = EmailTemplates.sellerRejectedEmail(user.first_name || 'Seller', reason);
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
