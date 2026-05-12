import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Recently Viewed Products API
 * URL: /api/buyer/recently-viewed
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('recently_viewed')
      .select(`
        viewed_at,
        product:products (
          id,
          title,
          price,
          slug,
          condition,
          status,
          images:product_images (image_url),
          seller:users (first_name, last_name)
        )
      `)
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // Format products
    const products = data.map((item: any) => ({
      ...item.product,
      viewed_at: item.viewed_at
    })).filter(p => p !== null);

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Recently Viewed GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
