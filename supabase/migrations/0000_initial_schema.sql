-- BAGCOM INITIAL DATABASE SCHEMA MIGRATION
-- Generated from System Architecture and Database Documentation

-- ==============================================================================
-- 1. ENUMS
-- ==============================================================================

CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING_PAYMENT', 'PAYMENT_SUCCESS', 'HELD_IN_ESCROW', 'PROCESSING_DELIVERY', 'DELIVERED', 'PAYOUT_PENDING', 'PAYOUT_SENT', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED', 'DISPUTED');
CREATE TYPE product_condition AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED', 'TIMEOUT');
CREATE TYPE payout_status AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REVERSED');
CREATE TYPE verification_status AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- ==============================================================================
-- 2. AUTOMATED TIMESTAMP TRIGGERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- 3. CORE TABLES (Dependencies)
-- ==============================================================================

-- USERS TABLE (Linked to Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR UNIQUE NOT NULL,
    phone_number VARCHAR UNIQUE,
    password_hash TEXT,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_photo_url TEXT,
    role user_role DEFAULT 'BUYER' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- LOCATIONS TABLE
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    county VARCHAR,
    city VARCHAR,
    institution_name VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL,
    formatted_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 4. DEPENDENT TABLES (Profiles & Products)
-- ==============================================================================

-- SELLER PROFILES
CREATE TABLE seller_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    shop_name VARCHAR,
    bio TEXT,
    national_id_number VARCHAR,
    mpesa_number VARCHAR,
    verification_status verification_status DEFAULT 'UNVERIFIED',
    average_rating DECIMAL DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    total_products INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BUYER PROFILES
CREATE TABLE buyer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    preferred_radius_km INTEGER DEFAULT 10,
    favorite_categories JSONB DEFAULT '[]'::jsonb,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    negotiable BOOLEAN DEFAULT FALSE,
    condition product_condition NOT NULL,
    quantity_available INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    status VARCHAR DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PRODUCT IMAGES
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCT FAVORITES
CREATE TABLE product_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ==============================================================================
-- 5. ORDER MANAGEMENT & ESCROW
-- ==============================================================================

-- ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    order_number VARCHAR UNIQUE NOT NULL,
    quantity INTEGER DEFAULT 1,
    subtotal_amount DECIMAL NOT NULL,
    commission_amount DECIMAL NOT NULL,
    total_amount DECIMAL NOT NULL,
    escrow_amount DECIMAL NOT NULL,
    seller_receivable DECIMAL NOT NULL,
    status order_status DEFAULT 'PENDING_PAYMENT',
    delivery_code VARCHAR,
    delivery_code_expires_at TIMESTAMP WITH TIME ZONE,
    is_delivery_confirmed BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PAYMENT TRANSACTIONS (M-PESA)
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    merchant_request_id VARCHAR,
    checkout_request_id VARCHAR UNIQUE,
    mpesa_receipt_number VARCHAR UNIQUE,
    payer_phone VARCHAR,
    amount DECIMAL NOT NULL,
    status payment_status DEFAULT 'PENDING',
    callback_payload JSONB,
    callback_received_at TIMESTAMP WITH TIME ZONE,
    raw_callback JSONB,
    result_code VARCHAR,
    result_description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ESCROW TRANSACTIONS
CREATE TABLE escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    held_amount DECIMAL NOT NULL,
    escrow_status VARCHAR DEFAULT 'HELD', -- HELD, RELEASED, REVERSED, DISPUTED
    held_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    released_at TIMESTAMP WITH TIME ZONE,
    reversed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- PAYOUTS (Seller Settlements)
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL NOT NULL,
    commission_deducted DECIMAL NOT NULL,
    payout_phone_number VARCHAR,
    conversation_id VARCHAR,
    originator_conversation_id VARCHAR,
    response_code VARCHAR,
    response_description TEXT,
    status payout_status DEFAULT 'PENDING',
    callback_payload JSONB,
    raw_callback JSONB,
    attempted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================================================
-- 6. MESSAGING & NOTIFICATIONS
-- ==============================================================================

-- CONVERSATIONS
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR,
    title VARCHAR,
    body TEXT,
    channel VARCHAR, -- EMAIL, SMS, IN_APP
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 7. REVIEWS, DISPUTES & ADMIN
-- ==============================================================================

-- DISPUTES
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    opened_by UUID REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    resolution_notes TEXT,
    status VARCHAR DEFAULT 'OPEN', -- OPEN, INVESTIGATING, RESOLVED
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR,
    entity_id UUID,
    action VARCHAR,
    previous_data JSONB,
    new_data JSONB,
    ip_address VARCHAR,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADMIN ACTIONS
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR,
    target_entity VARCHAR,
    target_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_location ON products(location_id);
CREATE INDEX idx_products_created ON products(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_payments_receipt ON payment_transactions(mpesa_receipt_number);
CREATE INDEX idx_payments_checkout ON payment_transactions(checkout_request_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) ENABLEMENT
-- ==============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Basic Policies (To be expanded in production)
-- Allow anyone to read active products
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (is_available = true AND status = 'ACTIVE');

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile." ON users FOR SELECT USING (auth.uid() = id);

-- Allow users to read their own orders (buyer or seller)
CREATE POLICY "Users can view their own orders." ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ==============================================================================
-- 10. ADVANCED ANALYTICS VIEWS
-- ==============================================================================

-- Admin Financial Metrics View
-- Pre-calculates total platform revenue, gross merchandise value (GMV), and held escrow.
CREATE VIEW view_admin_financial_metrics AS
SELECT 
    COUNT(id) AS total_transactions,
    SUM(total_amount) FILTER (WHERE status = 'COMPLETED') AS total_gmv_completed,
    SUM(commission_amount) FILTER (WHERE status = 'COMPLETED') AS total_commission_earned,
    SUM(escrow_amount) FILTER (WHERE status IN ('HELD_IN_ESCROW', 'PROCESSING_DELIVERY')) AS total_currently_in_escrow,
    SUM(total_amount) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)) AS gmv_this_month
FROM orders;

-- Seller Performance View
-- Automatically aggregates a seller's financial and activity metrics.
CREATE VIEW view_seller_performance AS
SELECT 
    p.seller_id,
    COUNT(DISTINCT p.id) AS total_products_listed,
    SUM(p.view_count) AS total_product_views,
    COUNT(o.id) FILTER (WHERE o.status = 'COMPLETED') AS total_completed_sales,
    SUM(o.seller_receivable) FILTER (WHERE o.status = 'COMPLETED') AS total_revenue_earned,
    SUM(o.seller_receivable) FILTER (WHERE o.status IN ('HELD_IN_ESCROW', 'PROCESSING_DELIVERY', 'DELIVERED')) AS pending_revenue_in_escrow
FROM products p
LEFT JOIN orders o ON p.seller_id = o.seller_id AND p.id = o.product_id
GROUP BY p.seller_id;

-- Platform Activity & Growth View
-- Tracks daily user registrations and dispute activity.
CREATE VIEW view_platform_activity AS
SELECT 
    CURRENT_DATE AS metric_date,
    (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE) AS new_users_today,
    (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE) AS new_orders_today,
    (SELECT COUNT(*) FROM disputes WHERE status = 'OPEN') AS active_disputes,
    (SELECT COUNT(*) FROM seller_profiles WHERE verification_status = 'PENDING') AS pending_kyc_verifications;

