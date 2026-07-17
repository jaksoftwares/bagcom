import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { userId, first_name, last_name, shop_name, bio, mpesa_number, profile_photo_url } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Update Users Table
    const { error: userError } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        profile_photo_url,
        phone_number: mpesa_number // We keep mpesa number synced with phone number for payouts
      })
      .eq('id', userId);

    if (userError) throw userError;

    // 2. Update Seller Profiles Table
    const { error: sellerError } = await supabase
      .from('seller_profiles')
      .update({
        shop_name,
        bio,
        mpesa_number
      })
      .eq('user_id', userId);

    if (sellerError) throw sellerError;

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    console.error('Settings Update Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
