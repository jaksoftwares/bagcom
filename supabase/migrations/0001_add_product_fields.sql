-- Migration: Add missing fields to products table based on mock data audit
-- Description: Adds fields like original_price, features, specifications, and availability enum to match mock data.

-- 1. Create Availability Enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_availability') THEN
        CREATE TYPE product_availability AS ENUM ('AVAILABLE', 'SOLD', 'RESERVED');
    END IF;
END $$;

-- 2. Update products table with new columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price DECIMAL,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS delivery_options JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS warranty VARCHAR,
ADD COLUMN IF NOT EXISTS brand VARCHAR,
ADD COLUMN IF NOT EXISTS model VARCHAR,
ADD COLUMN IF NOT EXISTS year_purchased VARCHAR,
ADD COLUMN IF NOT EXISTS reason_for_selling TEXT,
ADD COLUMN IF NOT EXISTS free_shipping BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS availability product_availability DEFAULT 'AVAILABLE';

-- 3. Data Migration: Sync availability with is_available
UPDATE products SET availability = 'AVAILABLE' WHERE is_available = TRUE;
UPDATE products SET availability = 'SOLD' WHERE is_available = FALSE;

-- 4. Indexes for new searchable fields
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
