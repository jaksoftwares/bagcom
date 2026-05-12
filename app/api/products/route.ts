import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isMaintenanceMode } from '@/lib/settings';

/**
 * Products API Endpoint
 * URL: /api/products
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = searchParams.get('limit');
    const sellerId = searchParams.get('sellerId');
    const sellerView = searchParams.get('sellerView') === 'true';
    
    const supabase = createServerClient();
    
    let query = supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(id, first_name, last_name, profile_photo_url),
        category:categories(id, name),
        images:product_images(id, image_url, display_order)
      `);

    // If not in sellerView, only show available/active products
    if (!sellerView) {
      query = query.eq('is_available', true).eq('status', 'ACTIVE');
    }

    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    }

    if (category) {
      query = query.eq('category_id', category);
    }


    if (location) {
      query = query.eq('location_id', location);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (error: any) {
    console.error('Products GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 0. Check Maintenance Mode
    if (await isMaintenanceMode()) {
      return NextResponse.json({ 
        error: 'Marketplace submissions are temporarily disabled for maintenance.' 
      }, { status: 503 });
    }

    const body = await request.json();
    const supabase = createServerClient();
    
    const { seller_id, category_id, title, description, price, condition, location_id, images } = body;

    if (!seller_id || !title || !price || !condition) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        seller_id,
        category_id,
        title,
        slug,
        description,
        price,
        condition,
        location_id,
        status: 'ACTIVE',
        is_available: true
      })
      .select()
      .single();

    if (productError) throw productError;

    if (images && Array.isArray(images) && images.length > 0) {
      const imageInserts = images.map((url: string, index: number) => ({
        product_id: product.id,
        image_url: url,
        display_order: index
      }));

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imageInserts);

      if (imageError) console.error('Image insertion error:', imageError);
    }

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Products POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
