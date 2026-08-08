import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * GET /api/products/[productId]/reviews
 * Returns all reviews for a product.
 */
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

/**
 * POST /api/products/[productId]/reviews
 * Submit a review for a product.
 * Guards:
 *  - User must be authenticated
 *  - User must have a COMPLETED order for this product (or bypass in dev mode)
 *  - User cannot review the same product twice
 */
export async function POST(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createServerClient();

    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { rating, comment } = body;

    // 2. Validate inputs
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    if (!comment || comment.trim().length < 5) {
      return NextResponse.json({ error: 'Please provide a comment (at least 5 characters)' }, { status: 400 });
    }

    // 3. Check eligibility via RPC
    const { data: canReview, error: eligibilityError } = await supabase
      .rpc('can_user_review_product', {
        buyer_uuid: user.id,
        target_product_id: params.productId
      });

    // In development we allow reviews without purchase verification.
    // In production, enforce the purchase guard.
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd && !canReview) {
      if (eligibilityError) {
        console.error('Eligibility check error:', eligibilityError);
        return NextResponse.json({ error: 'Could not verify review eligibility.' }, { status: 500 });
      }
      return NextResponse.json({
        error: 'You can only review products you have purchased and received.'
      }, { status: 403 });
    }

    // 4. Check for duplicate review (always enforced)
    const { data: existing } = await supabase
      .from('product_reviews')
      .select('id')
      .eq('product_id', params.productId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 409 });
    }

    // 5. Insert review
    const { data: newReview, error: insertError } = await supabase
      .from('product_reviews')
      .insert({
        product_id: params.productId,
        user_id: user.id,
        rating,
        comment: comment.trim(),
        images: body.images || []
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting review:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Trigger fires automatically to update seller_profiles stats
    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    console.error('Review POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/products/[productId]/reviews
 * Mark a review as helpful (increment helpful_votes).
 */
export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { reviewId } = body;
    if (!reviewId) return NextResponse.json({ error: 'reviewId is required' }, { status: 400 });

    const { error } = await supabase.rpc('increment_review_helpful_votes', { review_uuid: reviewId });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
