-- Fix RLS policies for the users table to allow profile creation and updates
-- This ensures that client-side upsert works during registration

-- 1. Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile." 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Allow users to update their own profile
CREATE POLICY "Users can update their own profile." 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Ensure admins can still do everything (though server-side uses service role)
CREATE POLICY "Admins can manage all users." 
ON public.users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
  )
);
