import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Admin Product Management API
 * URL: /api/admin/products
 */
export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type'); // LIST or STATS

    if (type === 'STATS') {
      const { data: allProducts, error: statsError } = await supabase
        .from('products')
        .select('status, is_available');
      
      if (statsError) throw statsError;

      return NextResponse.json({
        stats: {
          total: allProducts.length,
          active: allProducts.filter(p => p.status === 'ACTIVE' && p.is_available).length,
          flagged: allProducts.filter(p => p.status === 'FLAGGED').length,
          sold: allProducts.filter(p => p.status === 'SOLD').length
        }
      });
    }

    let query = supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(id, first_name, last_name, email),
        category:categories(id, name),
        images:product_images(image_url)
      `)
      .order('created_at', { ascending: false });

    if (sellerId) query = query.eq('seller_id', sellerId);
    if (status && status !== 'ALL') query = query.eq('status', status);
    if (categoryId && categoryId !== 'ALL') query = query.eq('category_id', categoryId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (error: any) {
    console.error('Admin Products GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerClient();
    const { productId, ...updates } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    const { data: { user: admin } } = await supabase.auth.getUser();
    if (admin) {
      await logAdminAction(admin.id, 'UPDATE_PRODUCT', 'PRODUCT', productId, updates);
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Admin Products PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
