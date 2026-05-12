import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type UserRole = Database['public']['Tables']['users']['Row']['role'];

export async function signUp({
  email,
  password,
  first_name,
  last_name,
  role = 'BUYER'
}: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        role
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) throw error;

  // Manually insert into public.users to ensure the profile exists immediately
  if (data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email!,
      first_name,
      last_name,
      role
    });
  }

  return data;
}


export async function signIn({
  email,
  password
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  if (error) throw error;
  return data;
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password
  });
  if (error) throw error;
  return data;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}
