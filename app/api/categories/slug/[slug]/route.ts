import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const supabase = createServerClient();

    // Fetch the category and its subcategories
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*, subcategories:categories(*)')
      .eq('slug', slug)
      .is('parent_id', null)
      .single();

    if (categoryError) throw categoryError;
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    // Fetch products in this category or its subcategories
    const subcategoryIds = category.subcategories?.map((s: any) => s.id) || [];
    const allCategoryIds = [category.id, ...subcategoryIds];

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(id, first_name, last_name, profile_photo_url),
        category:categories(id, name),
        images:product_images(id, image_url, display_order)
      `)
      .in('category_id', allCategoryIds)
      .eq('is_available', true)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    return NextResponse.json({ 
      category, 
      products 
    });
  } catch (error: any) {
    console.error('Category Slug GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
