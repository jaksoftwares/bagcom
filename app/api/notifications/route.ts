import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Notifications API
 * URL: /api/notifications
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Fetch individual notifications
    const { data: individual, error: indError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (indError) throw indError;

    // 2. Fetch broadcasts
    // Get user role first
    const { data: user } = await supabase.from('users').select('role').eq('id', userId).single();
    const role = user?.role || 'BUYER';

    const { data: broadcasts, error: brError } = await supabase
      .from('broadcast_notifications')
      .select('*')
      .or(`target_role.eq.ALL,target_role.eq.${role}`)
      .order('created_at', { ascending: false });

    if (brError) throw brError;

    // 3. Merge and format
    const formattedBroadcasts = (broadcasts || []).map(b => ({
      id: b.id,
      user_id: userId,
      type: 'BROADCAST',
      title: b.title,
      body: b.body,
      is_sent: true, // Broadcasts are always "sent"
      created_at: b.created_at
    }));

    const allNotifications = [...(individual || []), ...formattedBroadcasts].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ notifications: allNotifications });
  } catch (error: any) {
    console.error('Notifications GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient();
    const { notificationId, userId, markAll } = await request.json();

    let query = supabase.from('notifications').update({ is_sent: true }); // Using is_sent as is_read for now based on schema

    if (markAll) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('id', notificationId);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
