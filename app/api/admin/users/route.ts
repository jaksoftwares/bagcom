import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Admin Users List API
 * URL: /api/admin/users
 */
export async function GET() {
  try {
    const supabase = createServerClient();

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
    const { userId, ...updates } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    const { data: { user: admin } } = await supabase.auth.getUser();
    if (admin) {
      await logAdminAction(admin.id, 'UPDATE_USER_ACCOUNT', 'USER', userId, updates);
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Admin Users PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
