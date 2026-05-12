import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Chat Conversations API
 * URL: /api/chat/conversations
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Fetch conversations where user is either buyer or seller
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        buyer:users!conversations_buyer_id_fkey(id, first_name, last_name, profile_photo_url),
        seller:users!conversations_seller_id_fkey(id, first_name, last_name, profile_photo_url),
        product:products(id, title, price),
        last_message:messages(message, sent_at, sender_id, is_read)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter last_message to get only the most recent one for each conversation
    // In a real app, this would be a more efficient SQL query or view
    const formattedConversations = data.map(conv => ({
      ...conv,
      last_message: conv.last_message?.sort((a: any, b: any) => 
        new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
      )[0] || null
    }));

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error: any) {
    console.error('Chat Conversations GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { buyer_id, seller_id, product_id, order_id } = await request.json();

    if (!buyer_id || !seller_id) {
      return NextResponse.json({ error: 'Buyer and Seller IDs are required' }, { status: 400 });
    }

    // Check if conversation already exists for this context
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('buyer_id', buyer_id)
      .eq('seller_id', seller_id);

    if (product_id) query = query.eq('product_id', product_id);
    
    const { data: existing } = await query.single();

    if (existing) {
      return NextResponse.json({ conversation: existing });
    }

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        buyer_id,
        seller_id,
        product_id,
        order_id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error('Chat Conversations POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
