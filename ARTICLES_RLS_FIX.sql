-- Fix for articles table RLS policies
-- Run this in Supabase SQL Editor to allow admins to create articles

-- First, ensure RLS is enabled on the articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional, for cleanup)
DROP POLICY IF EXISTS "allow_read_all" ON public.articles;
DROP POLICY IF EXISTS "allow_insert_admin" ON public.articles;
DROP POLICY IF EXISTS "allow_update_admin" ON public.articles;
DROP POLICY IF EXISTS "allow_delete_admin" ON public.articles;

-- Create policies for admin users
-- Get the user ID from auth.users where email = 'admin@gmail.com'
-- You may need to adjust the user_id in these policies

-- Allow all users to read articles
CREATE POLICY "allow_read_all"
ON public.articles
FOR SELECT
USING (true);

-- Allow admins to insert articles
CREATE POLICY "allow_insert_admin"
ON public.articles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.user_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to update articles
CREATE POLICY "allow_update_admin"
ON public.articles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.user_id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.user_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to delete articles
CREATE POLICY "allow_delete_admin"
ON public.articles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.user_id = auth.uid()
    AND users.role = 'admin'
  )
);
