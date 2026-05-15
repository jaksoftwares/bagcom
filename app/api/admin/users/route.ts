import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';
import { sendEmail, EmailTemplates } from '@/lib/mail';

/**
 * Admin Users List API
 * URL: /api/admin/users
 */
export async function GET() {
  try {
    const supabase = createServerClient();

    // Verify Admin Authorization
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Admin Users GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Admin Update User Role/Status
 * URL: /api/admin/users
 */
export async function PUT(request: Request) {
  try {
    const supabase = createServerClient();
    
    // Verify Admin Authorization Early
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    if (adminUser) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', adminUser.id)
        .single();
        
      if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const { userId, action, ...updates } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let resultUser = null;

    if (action === 'RESET_PASSWORD') {
      const { data: userData } = await supabase.from('users').select('email').eq('id', userId).single();
      if (userData?.email) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(userData.email, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
        });
        if (resetError) throw resetError;
      }
    } else if (action === 'DELETE_ACCOUNT') {
      // Soft delete user
      const { error: deleteError } = await supabase
        .from('users')
        .update({ deleted_at: new Date().toISOString(), is_active: false })
        .eq('id', userId);
      if (deleteError) throw deleteError;

      // Mark products as unavailable
      await supabase
        .from('products')
        .update({ is_available: false })
        .eq('seller_id', userId);
    } else {
      const { data: userData } = await supabase.from('users').select('first_name, email, is_active').eq('id', userId).single();
      
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Send Suspension/Reactivation Email
      if (updates.is_active === false && userData?.is_active === true) {
        await sendEmail({
          to: userData.email,
          ...EmailTemplates.accountSuspended(userData.first_name || 'User', updates.kyc_notes || 'Violation of platform terms.')
        });
      } else if (updates.is_active === true && userData?.is_active === false) {
        await sendEmail({
          to: userData.email,
          ...EmailTemplates.accountReactivated(userData.first_name || 'User')
        });
      }

      resultUser = updatedUser;
    }

    const { data: { user: admin } } = await supabase.auth.getUser();
    if (admin) {
      await logAdminAction(admin.id, action || 'UPDATE_USER_ACCOUNT', 'USER', userId, updates);
    }

    return NextResponse.json({ success: true, user: resultUser });
  } catch (error: any) {
    console.error('Admin Users PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
