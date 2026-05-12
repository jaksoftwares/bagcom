import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(id, first_name, last_name, profile_photo_url),
        category:categories(id, name),
        images:product_images(id, image_url, display_order)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ product: data });
  } catch (error: any) {
    console.error('Product Slug GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
