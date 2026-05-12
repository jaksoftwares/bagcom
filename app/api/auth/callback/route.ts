import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get the user to check their role/metadata if needed
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is a SELLER, you might want to redirect them to a "Waiting for Approval" page
      // but for now, we redirect to home.
      return NextResponse.redirect(`${requestUrl.origin}/`);
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not verify email`);
}
