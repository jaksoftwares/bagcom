-- 0012_seller_onboarding.sql
-- Migration to support Individual vs Business sellers and automated auth.users sync

-- 1. Add new columns to public.users for enhanced seller verification
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS seller_type TEXT CHECK (seller_type IN ('INDIVIDUAL', 'BUSINESS')),
ADD COLUMN IF NOT EXISTS business_registration_number TEXT,
ADD COLUMN IF NOT EXISTS id_document_url TEXT,
ADD COLUMN IF NOT EXISTS business_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS id_number TEXT,
ADD COLUMN IF NOT EXISTS planned_categories TEXT,
ADD COLUMN IF NOT EXISTS store_description TEXT,
ADD COLUMN IF NOT EXISTS physical_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS seller_status TEXT DEFAULT 'PENDING';

-- 2. Create the function to automatically insert into public.users when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    role,
    business_name,
    id_number,
    planned_categories,
    store_description,
    physical_address,
    phone_number,
    city,
    seller_type,
    business_registration_number,
    id_document_url,
    business_certificate_url,
    seller_status,
    is_active
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    COALESCE(new.raw_user_meta_data->>'role', 'BUYER')::public.user_role,
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'id_number',
    new.raw_user_meta_data->>'planned_categories',
    new.raw_user_meta_data->>'store_description',
    new.raw_user_meta_data->>'physical_address',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'seller_type',
    new.raw_user_meta_data->>'business_registration_number',
    new.raw_user_meta_data->>'id_document_url',
    new.raw_user_meta_data->>'business_certificate_url',
    CASE WHEN new.raw_user_meta_data->>'role' = 'SELLER' THEN 'PENDING' ELSE 'APPROVED' END,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    business_name = EXCLUDED.business_name,
    id_number = EXCLUDED.id_number,
    planned_categories = EXCLUDED.planned_categories,
    store_description = EXCLUDED.store_description,
    physical_address = EXCLUDED.physical_address,
    phone_number = EXCLUDED.phone_number,
    city = EXCLUDED.city,
    seller_type = EXCLUDED.seller_type,
    business_registration_number = EXCLUDED.business_registration_number,
    id_document_url = EXCLUDED.id_document_url,
    business_certificate_url = EXCLUDED.business_certificate_url,
    seller_status = EXCLUDED.seller_status;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Optional: You can drop the client-side profile insert RLS policy if you want strict backend control,
-- but leaving it doesn't hurt as the ON CONFLICT clause handles duplicates.
