import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the Service Role key to bypass RLS
// This allows us to securely check if a phone number exists across all users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(req: Request) {
  try {
    const { phone_number } = await req.json();

    if (!phone_number) {
      return NextResponse.json({ success: true });
    }

    // Check if the phone number already exists
    const { data: existingUser, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone_number', phone_number)
      .maybeSingle();

    if (error) {
      console.error('Validation query error:', error);
      return NextResponse.json({ success: false, error: 'Database error during validation' }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'This phone number is already registered to another account.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('VALIDATION_ERROR:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to validate user details.' }, { status: 500 });
  }
}
