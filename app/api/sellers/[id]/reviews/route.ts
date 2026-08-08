import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * GET /api/sellers/[id]/reviews
 * Returns aggregated reviews for all products belonging to a seller.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const supabase = createServerClient();

    const { data, error } = await supabase.rpc('get_seller_reviews', {
      target_seller_id: params.id,
      limit_count: limit
    });

    if (error) {
      console.error('Error fetching seller reviews:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
