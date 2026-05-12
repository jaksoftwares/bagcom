-- ==========================================
-- Bagcom Seller KYC & Approval Migration
-- ==========================================

-- 1. Extend the users table with detailed Merchant KYC fields
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS id_number TEXT,
ADD COLUMN IF NOT EXISTS seller_status TEXT DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS kyc_notes TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS planned_categories TEXT, -- What they intend to sell
ADD COLUMN IF NOT EXISTS store_description TEXT, -- Short bio/pitch of the store
ADD COLUMN IF NOT EXISTS physical_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- 2. Role Simplification: Ensure all Admin/Super Admin checks treat 'ADMIN' as the master role
-- Note: Logic for this is handled in the application layer (AdminLayout.tsx)

-- 3. Data Migration: Backfill existing sellers to ensure zero downtime for current users
UPDATE public.users 
SET seller_status = 'APPROVED', 
    approved_at = NOW() 
WHERE role = 'SELLER' AND seller_status = 'PENDING';

-- 4. Indices for Admin Verification Performance
CREATE INDEX IF NOT EXISTS idx_users_seller_status ON public.users(seller_status) WHERE role = 'SELLER';
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

COMMENT ON COLUMN public.users.planned_categories IS 'Captured during registration to help admins understand merchant intent.';
COMMENT ON COLUMN public.users.id_number IS 'National ID or Passport Number for KYC compliance.';
