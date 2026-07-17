import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Check user role for dynamic redirection
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      let redirectPath = next;
      // Only override the default root path with role-based routing
      if (next === '/') { 
        if (profile?.role === 'SELLER') {
          redirectPath = '/seller';
        } else if (profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') {
          redirectPath = '/admin';
        }
      }

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Verification failed`);
}
