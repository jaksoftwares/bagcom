import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Admin Notifications API
 * URL: /api/admin/notifications
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { userId, title, body, type = 'SYSTEM', broadcast = false, targetRole = 'ALL' } = await request.json();

    const { data: { user: admin } } = await supabase.auth.getUser();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (broadcast) {
      // 1. Create Broadcast record
      const { data: broadcastData, error: broadcastError } = await supabase
        .from('broadcast_notifications')
        .insert({
          admin_id: admin.id,
          title,
          body,
          target_role: targetRole
        })
        .select()
        .single();

      if (broadcastError) throw broadcastError;

      // 2. Also push individual notifications to active users (optional, but good for real-time)
      // For performance, we might just let users poll 'broadcast_notifications'
      
      await logAdminAction(admin.id, 'SEND_BROADCAST', 'SYSTEM', broadcastData.id, { title, targetRole });

      return NextResponse.json({ success: true, broadcast: broadcastData });
    } else {
      // Individual Notification
      if (!userId) return NextResponse.json({ error: 'User ID is required for individual notifications' }, { status: 400 });

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          body,
          channel: 'IN_APP'
        })
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(admin.id, 'SEND_NOTIFICATION', 'USER', userId, { title });

      return NextResponse.json({ success: true, notification });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
