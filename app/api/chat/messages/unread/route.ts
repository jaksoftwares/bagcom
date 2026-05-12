import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Global Unread Messages Count API
 * URL: /api/chat/messages/unread
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Get all conversation IDs the user is part of
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({ count: 0 });
    }

    const conversationIds = conversations.map(c => c.id);

    // 2. Count unread messages in those conversations not sent by the user
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('conversation_id', conversationIds)
      .neq('sender_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    return NextResponse.json({ count: count || 0 });
  } catch (error: any) {
    console.error('Unread Messages GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
