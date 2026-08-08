-- Migration: PDP Enhancements (Variants & Reviews)
-- Description: Adds variants JSONB to products, creates product_reviews table, and adds an RPC to fetch reviews.

-- 1. Add variants to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- 2. Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user ON product_reviews(user_id);

-- 4. Enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Reviews are viewable by everyone." ON product_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews." ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own reviews." ON product_reviews FOR ALL USING (auth.uid() = user_id);

-- 6. Create RPC for fetching reviews with user details
CREATE OR REPLACE FUNCTION get_product_reviews_with_users(target_product_id UUID)
RETURNS TABLE (
    id UUID,
    rating INTEGER,
    comment TEXT,
    images JSONB,
    helpful_votes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    user_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pr.id,
        pr.rating,
        pr.comment,
        pr.images,
        pr.helpful_votes,
        pr.created_at,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.profile_photo_url AS avatar_url
    FROM product_reviews pr
    JOIN users u ON pr.user_id = u.id
    WHERE pr.product_id = target_product_id
    ORDER BY pr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
