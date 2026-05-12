import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * User Profile API
 * URL: /api/user/profile
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Profile GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerClient();
    const { userId, first_name, last_name, phone_number, profile_photo_url } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Update Core User Table
    const { data: user, error: userError } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        phone_number,
        profile_photo_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (userError) throw userError;

    // 2. Also update seller/buyer profiles if they exist to keep data in sync
    // In a real app, this might be handled by DB triggers
    await supabase.from('seller_profiles').update({ mpesa_number: phone_number }).eq('user_id', userId);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Profile PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
