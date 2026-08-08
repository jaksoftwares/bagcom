import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createServerClient();
    
    const { data, error } = await supabase.rpc('get_product_reviews_with_users', { 
        target_product_id: params.productId 
    });
    
    if (error) {
      console.error('Error fetching product reviews:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ reviews: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
