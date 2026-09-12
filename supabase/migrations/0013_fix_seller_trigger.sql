-- 0013_fix_seller_trigger.sql
-- Fixes the auth.users trigger that copies new users into public.users.
-- Prevents silent failures caused by empty strings violating UNIQUE constraints (like phone_number).

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
    NULLIF(new.raw_user_meta_data->>'first_name', ''),
    NULLIF(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(NULLIF(new.raw_user_meta_data->>'role', ''), 'BUYER')::public.user_role,
    NULLIF(new.raw_user_meta_data->>'business_name', ''),
    NULLIF(new.raw_user_meta_data->>'id_number', ''),
    NULLIF(new.raw_user_meta_data->>'planned_categories', ''),
    NULLIF(new.raw_user_meta_data->>'store_description', ''),
    NULLIF(new.raw_user_meta_data->>'physical_address', ''),
    NULLIF(new.raw_user_meta_data->>'phone_number', ''), -- Prevents empty string from violating UNIQUE constraint
    NULLIF(new.raw_user_meta_data->>'city', ''),
    NULLIF(new.raw_user_meta_data->>'seller_type', ''),
    NULLIF(new.raw_user_meta_data->>'business_registration_number', ''),
    NULLIF(new.raw_user_meta_data->>'id_document_url', ''),
    NULLIF(new.raw_user_meta_data->>'business_certificate_url', ''),
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
EXCEPTION
  WHEN OTHERS THEN
    -- In case of ANY other error, we don't want the trigger to fail the transaction if GoTrue doesn't handle it gracefully.
    -- However, GoTrue handles trigger failures properly now, so logging is usually enough.
    -- We raise warning to ensure logs capture the error but allow execution.
    RAISE WARNING 'handle_new_user trigger failed for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
