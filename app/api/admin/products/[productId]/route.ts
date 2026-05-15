import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin Product Detail API
 * URL: /api/admin/products/[productId]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const supabase = createServerClient();
    const { productId } = await params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(*),
        category:categories(*),
        images:product_images(*)
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;

    // Fetch audit logs separately since no formal FK exists
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select(`
        *,
        admin:users!audit_logs_admin_id_fkey(first_name, last_name)
      `)
      .eq('entity_id', productId)
      .eq('entity_type', 'PRODUCT')
      .order('created_at', { ascending: false });

    return NextResponse.json({ 
      product: {
        ...product,
        audit_logs: auditLogs || []
      } 
    });
  } catch (error: any) {
    console.error('Admin Product Detail GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
