import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';


/**
 * Product Favorites API Endpoint
 * URL: /api/favorites
 */

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');


    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const { data, error } = await supabase
      .from('product_favorites')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ favorites: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { userId, productId } = await request.json();


    const { data, error } = await supabase
      .from('product_favorites')
      .upsert({ user_id: userId, product_id: productId })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, favorite: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient();
    const { userId, productId } = await request.json();


    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('product_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
