-- Enable RLS on articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow admins to insert articles" ON public.articles;
DROP POLICY IF EXISTS "Allow admins to update articles" ON public.articles;
DROP POLICY IF EXISTS "Allow public to read articles" ON public.articles;
DROP POLICY IF EXISTS "Allow admins to delete articles" ON public.articles;

-- RLS Policies for articles table
-- Allow admins to insert articles
CREATE POLICY "Allow admins to insert articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (
  (
    SELECT role FROM public.users
    WHERE auth_user_id = auth.uid()
  ) = 'admin'
);

-- Allow admins to update articles
CREATE POLICY "Allow admins to update articles"
ON public.articles
FOR UPDATE
TO authenticated
USING (
  (
    SELECT role FROM public.users
    WHERE auth_user_id = auth.uid()
  ) = 'admin'
)
WITH CHECK (
  (
    SELECT role FROM public.users
    WHERE auth_user_id = auth.uid()
  ) = 'admin'
);

-- Allow public to read articles
CREATE POLICY "Allow public to read articles"
ON public.articles
FOR SELECT
USING (true);

-- Allow admins to delete articles
CREATE POLICY "Allow admins to delete articles"
ON public.articles
FOR DELETE
TO authenticated
USING (
  (
    SELECT role FROM public.users
    WHERE auth_user_id = auth.uid()
  ) = 'admin'
);
