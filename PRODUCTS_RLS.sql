-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow admins to insert products" ON public.products;
DROP POLICY IF EXISTS "Allow admins to update products" ON public.products;
DROP POLICY IF EXISTS "Allow public to read products" ON public.products; 
DROP POLICY IF EXISTS "Allow admins to delete products" ON public.products;

-- RLS Policies for products table
-- Allow admins to insert products
CREATE POLICY "Allow admins to insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  (
    SELECT role FROM public.users
    WHERE auth_user_id = auth.uid()
  ) = 'admin'
);

-- Allow admins to update products
CREATE POLICY "Allow admins to update products"
ON public.products
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

-- Allow public to read products
CREATE POLICY "Allow public to read products"
ON public.products
FOR SELECT
USING (true);

-- Allow admins to delete products
CREATE POLICY "Allow admins to delete products"
ON public.products
FOR DELETE
TO authenticated
USING (
  (
    SELECT role FROM public.users
    WHERE auth_user_id = auth.uid()
  ) = 'admin'
);
