-- Migration: Homepage Updates for Phase 2
-- Description: Adds original_price to products and RPCs for dynamic homepage sections.

-- 1. Add original_price to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL;

-- 2. Create RPC for discounted products (Flash Sales)
CREATE OR REPLACE FUNCTION get_discounted_products(limit_count int)
RETURNS SETOF products AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM products
    WHERE original_price IS NOT NULL 
      AND original_price > price
      AND status = 'ACTIVE'
    ORDER BY ((original_price - price) / original_price) DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create RPC for recently viewed products
CREATE OR REPLACE FUNCTION get_recently_viewed_products(user_uuid uuid, limit_count int)
RETURNS SETOF products AS $$
BEGIN
    RETURN QUERY
    SELECT p.*
    FROM products p
    JOIN recently_viewed rv ON rv.product_id = p.id
    WHERE rv.user_id = user_uuid
      AND p.status = 'ACTIVE'
    ORDER BY rv.viewed_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
