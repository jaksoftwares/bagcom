import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * GET /api/sellers/[id]
 * Returns the full public profile for a seller: user info + shop info + real stats.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sellerId = params.id;
    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Fetch full public seller profile via RPC (joins users + seller_profiles + aggregated stats)
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_seller_public_profile', { seller_uuid: sellerId });

    if (profileError) {
      console.error('Error fetching seller profile:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profileData || profileData.length === 0) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    return NextResponse.json({ seller: profileData[0] });
  } catch (error: any) {
    console.error('Seller profile API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
