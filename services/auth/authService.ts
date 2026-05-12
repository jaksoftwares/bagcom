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
  planned_categories?: string;
  store_description?: string;
  physical_address?: string;
  phone_number?: string;
  city?: string;
}) {
  console.log('Initiating Bagcom Signup for:', email, 'Role:', role);

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

  if (error) {
    console.error('CRITICAL AUTH ERROR:', error.message, '| Code:', error.status);
    throw error;
  }

  // Use UPSERT instead of INSERT to handle potential trigger conflicts in Supabase
  if (data.user) {
    console.log('Auth User Created:', data.user.id, 'Syncing to public.users...');
    
    const { error: dbError } = await supabase.from('users').upsert({
      id: data.user.id,
      email: data.user.email!,
      first_name,
      last_name,
      role,
      business_name,
      id_number,
      planned_categories,
      store_description,
      physical_address,
      phone_number,
      city,
      is_active: true,
      seller_status: role === 'SELLER' ? 'PENDING' : 'APPROVED'
    }, { onConflict: 'id' });

    if (dbError) {
      console.error('DATABASE SYNC FAILED:', dbError.message, '| Hint:', dbError.hint);
    } else {
      console.log('Database Profile Synced Successfully.');
    }
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
