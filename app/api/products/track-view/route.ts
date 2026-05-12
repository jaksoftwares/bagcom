import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Track Product View API
 * URL: /api/products/track-view
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
    }

    // Upsert to recently_viewed table
    // Note: This assumes the table exists with (user_id, product_id) as primary key or unique constraint
    const { error } = await supabase
      .from('recently_viewed')
      .upsert({
        user_id: userId,
        product_id: productId,
        viewed_at: new Date().toISOString()
      }, { onConflict: 'user_id,product_id' });

    if (error) throw error;

    // Also increment product view count
    await supabase.rpc('increment_view_count', { product_id: productId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Track View Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
