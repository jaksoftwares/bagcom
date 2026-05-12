import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * KYC Submission API Endpoint
 * URL: /api/users/kyc
 */

export async function POST(request: Request) {
  try {
    const { userId, idNumber, idType, idFrontUrl, idBackUrl } = await request.json();

    if (!userId || !idNumber || !idFrontUrl) {
      return NextResponse.json({ error: 'Missing required KYC documents' }, { status: 400 });
    }

    const { error } = await supabase
      .from('seller_profiles')
      .update({
        id_number: idNumber,
        verification_status: 'PENDING',
        verification_date: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'KYC documents submitted for review' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
