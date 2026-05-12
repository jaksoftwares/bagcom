-- Migration: Add recently_viewed table and view tracking RPC
-- Description: Enables persistent tracking of user browsing history.

-- 1. Create recently_viewed table
CREATE TABLE IF NOT EXISTS recently_viewed (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- 2. Create index for faster retrieval
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_date ON recently_viewed(viewed_at DESC);

-- 3. Create RPC for atomic view count increment
CREATE OR REPLACE FUNCTION increment_view_count(product_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE products
    SET view_count = view_count + 1
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable RLS
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Users can view their own history." ON recently_viewed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own history." ON recently_viewed FOR ALL USING (auth.uid() = user_id);
