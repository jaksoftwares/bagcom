import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/services/auth/authService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ products: [] }); // Not logged in, no recently viewed
    }

    const supabase = createServerClient();
    
    // Call our new RPC function
    const { data, error } = await supabase.rpc('get_recently_viewed_products', { 
        user_uuid: user.id, 
        limit_count: limit 
    });
    
    if (error) {
      console.error('Error fetching recently viewed products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // Fetch relations (images and categories) for these products
    const productIds = data.map((p: any) => p.id);
    const { data: relations } = await supabase
      .from('products')
      .select('id, images:product_images(image_url), category:categories(name)')
      .in('id', productIds);

    // Merge relations back into the products
    const enrichedProducts = data.map((product: any) => {
      const relation = relations?.find((r: any) => r.id === product.id);
      return {
        ...product,
        images: relation?.images || [],
        category: relation?.category || { name: 'General' }
      };
    });
    
    return NextResponse.json({ products: enrichedProducts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
