-- Fix RLS policies for the users table to allow profile creation and updates
-- This ensures that client-side upsert works during registration

-- 0. Create a helper function to break recursion
-- SECURITY DEFINER allows the function to bypass RLS for the role check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Allow users to insert their own profile during signup
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.users;
CREATE POLICY "Users can insert their own profile." 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile." ON public.users;
CREATE POLICY "Users can update their own profile." 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Allow users to view their own profile (Crucial for login)
DROP POLICY IF EXISTS "Users can view their own profile." ON public.users;
CREATE POLICY "Users can view their own profile." 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- 4. Ensure admins can manage all users (using the helper to avoid recursion)
DROP POLICY IF EXISTS "Admins can manage all users." ON public.users;
CREATE POLICY "Admins can manage all users." 
ON public.users 
FOR ALL 
USING (public.is_admin());
