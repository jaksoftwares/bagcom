import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const supabase = createServerClient();
    
    // Call our new RPC function
    const { data, error } = await supabase.rpc('get_discounted_products', { limit_count: limit });
    
    if (error) {
      console.error('Error fetching discounted products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // As a fallback for development/testing if no products have original_price set,
    // we can return the regular products. But since we want to be accurate, we'll return what we got.
    return NextResponse.json({ products: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
