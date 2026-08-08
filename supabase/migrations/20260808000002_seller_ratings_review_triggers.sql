-- =============================================================================
-- Migration: Seller Ratings Auto-Compute & Seller Public Profile RPC
-- File: 20260808000002_seller_ratings_review_triggers.sql
-- =============================================================================

-- 1. FUNCTION: Recalculate seller rating after a product review changes
-- =============================================================================
CREATE OR REPLACE FUNCTION recalculate_seller_rating(target_seller_id UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating_val DECIMAL;
    total_reviews_val INTEGER;
    total_products_val INTEGER;
    total_sales_val INTEGER;
BEGIN
    -- Get aggregated review stats across all seller's products
    SELECT
        COALESCE(AVG(pr.rating), 0),
        COALESCE(COUNT(pr.id), 0)
    INTO avg_rating_val, total_reviews_val
    FROM product_reviews pr
    JOIN products p ON pr.product_id = p.id
    WHERE p.seller_id = target_seller_id;

    -- Get total active product listings
    SELECT COUNT(*) INTO total_products_val
    FROM products
    WHERE seller_id = target_seller_id AND status = 'ACTIVE';

    -- Get total completed sales
    SELECT COUNT(*) INTO total_sales_val
    FROM orders
    WHERE seller_id = target_seller_id AND status = 'COMPLETED';

    -- Upsert seller_profiles with updated stats
    INSERT INTO seller_profiles (user_id, average_rating, total_reviews, total_products, total_sales)
    VALUES (target_seller_id, avg_rating_val, total_reviews_val, total_products_val, total_sales_val)
    ON CONFLICT (user_id) DO UPDATE SET
        average_rating = EXCLUDED.average_rating,
        total_reviews  = EXCLUDED.total_reviews,
        total_products = EXCLUDED.total_products,
        total_sales    = EXCLUDED.total_sales;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. TRIGGER FUNCTION: Called after INSERT/UPDATE/DELETE on product_reviews
-- =============================================================================
CREATE OR REPLACE FUNCTION trigger_recalculate_seller_rating()
RETURNS TRIGGER AS $$
DECLARE
    affected_seller_id UUID;
BEGIN
    -- Determine the seller from the affected product
    IF TG_OP = 'DELETE' THEN
        SELECT seller_id INTO affected_seller_id FROM products WHERE id = OLD.product_id;
    ELSE
        SELECT seller_id INTO affected_seller_id FROM products WHERE id = NEW.product_id;
    END IF;

    IF affected_seller_id IS NOT NULL THEN
        PERFORM recalculate_seller_rating(affected_seller_id);
    END IF;

    RETURN NULL; -- AFTER trigger can return NULL
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ATTACH TRIGGER to product_reviews
-- =============================================================================
DROP TRIGGER IF EXISTS on_review_change_update_seller_rating ON product_reviews;
CREATE TRIGGER on_review_change_update_seller_rating
    AFTER INSERT OR UPDATE OR DELETE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_recalculate_seller_rating();

-- 4. RPC: Public Seller Profile (joins users + seller_profiles + computed stats)
-- =============================================================================
CREATE OR REPLACE FUNCTION get_seller_public_profile(seller_uuid UUID)
RETURNS TABLE (
    id                  UUID,
    email               VARCHAR,
    first_name          VARCHAR,
    last_name           VARCHAR,
    profile_photo_url   TEXT,
    role                user_role,
    created_at          TIMESTAMP WITH TIME ZONE,
    -- seller_profiles fields
    shop_name           VARCHAR,
    bio                 TEXT,
    city                TEXT,
    physical_address    TEXT,
    average_rating      DECIMAL,
    total_reviews       INTEGER,
    total_products      INTEGER,
    total_sales         INTEGER,
    verification_status verification_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.profile_photo_url,
        u.role,
        u.created_at,
        COALESCE(sp.shop_name, u.business_name)::VARCHAR AS shop_name,
        COALESCE(sp.bio, u.store_description)           AS bio,
        COALESCE(sp.location_id::TEXT, u.city)::TEXT    AS city,
        u.physical_address,
        COALESCE(sp.average_rating, 0)                  AS average_rating,
        COALESCE(sp.total_reviews, 0)                   AS total_reviews,
        COALESCE(sp.total_products, 0)                  AS total_products,
        COALESCE(sp.total_sales, 0)                     AS total_sales,
        COALESCE(sp.verification_status, 'UNVERIFIED'::verification_status) AS verification_status
    FROM users u
    LEFT JOIN seller_profiles sp ON sp.user_id = u.id
    WHERE u.id = seller_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: Check if a buyer can review a specific product
--    (Must have a COMPLETED order for that product)
-- =============================================================================
CREATE OR REPLACE FUNCTION can_user_review_product(buyer_uuid UUID, target_product_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_order BOOLEAN;
    has_reviewed BOOLEAN;
BEGIN
    -- Check for a completed order
    SELECT EXISTS (
        SELECT 1 FROM orders
        WHERE buyer_id = buyer_uuid
          AND product_id = target_product_id
          AND status = 'COMPLETED'
    ) INTO has_order;

    -- Check if already reviewed
    SELECT EXISTS (
        SELECT 1 FROM product_reviews
        WHERE user_id = buyer_uuid
          AND product_id = target_product_id
    ) INTO has_reviewed;

    RETURN has_order AND NOT has_reviewed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: Get aggregated reviews for a seller (across all their products)
-- =============================================================================
CREATE OR REPLACE FUNCTION get_seller_reviews(target_seller_id UUID, limit_count INT DEFAULT 10)
RETURNS TABLE (
    review_id       UUID,
    rating          INTEGER,
    comment         TEXT,
    helpful_votes   INTEGER,
    created_at      TIMESTAMP WITH TIME ZONE,
    reviewer_name   TEXT,
    reviewer_avatar TEXT,
    product_title   VARCHAR,
    product_slug    VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pr.id           AS review_id,
        pr.rating,
        pr.comment,
        pr.helpful_votes,
        pr.created_at,
        CONCAT(u.first_name, ' ', LEFT(u.last_name, 1), '.') AS reviewer_name,
        u.profile_photo_url AS reviewer_avatar,
        p.title         AS product_title,
        p.slug          AS product_slug
    FROM product_reviews pr
    JOIN products p   ON pr.product_id = p.id
    JOIN users u      ON pr.user_id    = u.id
    WHERE p.seller_id = target_seller_id
    ORDER BY pr.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Add index on product_reviews.product_id -> products.seller_id path for performance
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_buyer_status ON orders(seller_id, buyer_id, status);

-- 8. Add helpful_votes increment function (to avoid race conditions)
-- =============================================================================
CREATE OR REPLACE FUNCTION increment_review_helpful_votes(review_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE product_reviews SET helpful_votes = helpful_votes + 1 WHERE id = review_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
