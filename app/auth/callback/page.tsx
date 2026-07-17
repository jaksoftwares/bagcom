'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getUserProfile } from '@/services/auth/authService';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/shared/Logo';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleAuthRedirect() {
      try {
        // 1. Get the session. 
        // For Implicit Flow (Google Auth / Email links), Supabase automatically 
        // parses the #access_token from the URL and saves it to localStorage.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          // 2. Fetch user profile to determine their role
          const profile = await getUserProfile(session.user.id);
          
          if (!isMounted) return;

          // 3. Dynamic Routing based on Role
          if (profile?.role === 'SELLER') {
            router.push('/seller');
          } else if (profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } else {
          // If no session is found immediately, it might still be parsing.
          // Wait for the onAuthStateChange event to fire.
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (newSession?.user && isMounted) {
              const profile = await getUserProfile(newSession.user.id);
              if (profile?.role === 'SELLER') {
                router.push('/seller');
              } else if (profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') {
                router.push('/admin');
              } else {
                router.push('/');
              }
            } else if (event === 'SIGNED_OUT') {
               if (isMounted) router.push('/login?error=Authentication failed');
            }
          });

          // Cleanup listener if component unmounts
          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        console.error('Auth Callback Error:', err);
        if (isMounted) {
          setError(err.message || 'An error occurred during authentication.');
          setTimeout(() => router.push('/login'), 3000);
        }
      }
    }

    handleAuthRedirect();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Logo className="mb-6" />
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 max-w-md text-center shadow-sm">
          <p className="font-bold text-lg mb-1">Authentication Failed</p>
          <p className="text-sm font-medium opacity-90">{error}</p>
          <p className="text-xs mt-3 opacity-70">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Logo className="mb-8 animate-pulse" />
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Completing sign in...</h2>
        <p className="text-sm text-gray-500 font-medium">Please wait while we securely set up your session.</p>
      </div>
    </div>
  );
}
