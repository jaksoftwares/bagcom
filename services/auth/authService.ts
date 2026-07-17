import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type UserRole = Database['public']['Tables']['users']['Row']['role'];

export async function signUp({
  email,
  password,
  first_name,
  last_name,
  role = 'BUYER',
  business_name,
  id_number,
  seller_type,
  business_registration_number,
  id_document_url,
  business_certificate_url,
  planned_categories,
  store_description,
  physical_address,
  phone_number,
  city,
}: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  business_name?: string;
  id_number?: string;
  seller_type?: 'INDIVIDUAL' | 'BUSINESS';
  business_registration_number?: string;
  id_document_url?: string;
  business_certificate_url?: string;
  planned_categories?: string;
  store_description?: string;
  physical_address?: string;
  phone_number?: string;
  city?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        role,
        business_name,
        id_number,
        seller_type,
        business_registration_number,
        id_document_url,
        business_certificate_url,
        planned_categories,
        store_description,
        physical_address,
        phone_number,
        city,
        seller_status: role === 'SELLER' ? 'PENDING' : 'APPROVED'
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) throw error;

  // Profile creation is now securely handled by a Postgres Trigger on auth.users
  // No client-side upsert needed.

  // Trigger professional email notifications for sellers
  if (data.user && role === 'SELLER') {
    try {
      await fetch('/api/auth/notify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name,
          last_name,
          role,
          business_name,
          id_number
        })
      });
    } catch (e) {
      console.error('NOTIFICATION_TRIGGER_FAILED:', e);
    }
  }

  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
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
