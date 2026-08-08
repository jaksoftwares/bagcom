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
    
    return NextResponse.json({ products: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
