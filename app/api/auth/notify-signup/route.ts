import { NextResponse } from 'next/server';
import { sendEmail, EmailTemplates } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { 
      email, 
      first_name, 
      last_name, 
      role, 
      business_name, 
      id_number 
    } = await req.json();

    if (role === 'SELLER') {
      // 1. Send "Under Review" email to the Seller
      const sellerTemplate = EmailTemplates.sellerUnderReview(`${first_name} ${last_name}`, business_name || '');
      await sendEmail({
        to: email,
        subject: sellerTemplate.subject,
        html: sellerTemplate.html
      });

      // 2. Send "New Seller Signup" notification to Admin
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@dovepeakdigital.com';
      const adminTemplate = EmailTemplates.adminNewSellerSignup(
        `${first_name} ${last_name}`, 
        email, 
        business_name || 'Individual', 
        id_number || 'PENDING'
      );
      
      await sendEmail({
        to: adminEmail,
        subject: adminTemplate.subject,
        html: adminTemplate.html
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('NOTIFY_ERROR:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
