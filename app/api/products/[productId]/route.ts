import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';


/**
 * Get single product by ID
 * URL: /api/products/[productId]
 */
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createServerClient();

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(id, first_name, last_name, profile_photo_url),
        category:categories(id, name),
        images:product_images(id, image_url, display_order)
      `)
      .eq('id', params.productId)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    
    // 1. Verify ownership (In production, this should check the authenticated user)
    const { data: existing } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', params.productId)
      .single();

    if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // 2. Update basic info
    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.productId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createServerClient();

    // Soft delete by marking as unavailable or actually deleting
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.productId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

