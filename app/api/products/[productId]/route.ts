import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

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
    
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = user ? await supabase.from('users').select('role').eq('id', user.id).single() : { data: null };

    // Handle empty location_id (Use Store Default Location)
    if (body.location_id === '') {
      const { data: sellerProfile } = await supabase
        .from('seller_profiles')
        .select('location_id')
        .eq('user_id', body.seller_id)
        .maybeSingle();
        
      if (sellerProfile && sellerProfile.location_id) {
        body.location_id = sellerProfile.location_id;
      } else {
        delete body.location_id;
      }
    }

    // Extract images and validate limit
    const images = body.images;
    delete body.images; // Remove from body so it doesn't break products table update

    if (images && Array.isArray(images) && images.length > 5) {
      return NextResponse.json({ error: 'A maximum of 5 images are allowed per product' }, { status: 400 });
    }

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

    // 3. Sync images
    if (images && Array.isArray(images)) {
      // First delete existing images
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', params.productId);

      // Then insert new images
      if (images.length > 0) {
        const imageInserts = images.map((url: string, index: number) => ({
          product_id: params.productId,
          image_url: url,
          display_order: index
        }));

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imageError) console.error('Image syncing error:', imageError);
      }
    }

    // Record Audit Log if admin is moderating status
    if (profile?.role === 'ADMIN' && body.status) {
      await logAdminAction(user!.id, 'MODERATE_PRODUCT', 'PRODUCT', params.productId, { status: body.status });
    }

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
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.productId);

    if (error) throw error;

    if (user) {
      await logAdminAction(user.id, 'DELETE_PRODUCT', 'PRODUCT', params.productId);
    }

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
