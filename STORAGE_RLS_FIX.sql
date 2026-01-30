-- Drop existing policies first
DROP POLICY IF EXISTS "Allow admins to upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to update product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read article images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete article images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to update article images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read site images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete site images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to update site images" ON storage.objects;

-- Simple RLS Policies (Admin check is in Edge Function)
-- Product Images
CREATE POLICY "Allow authenticated to upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public to read product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated to delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated to update product images"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Article Images
CREATE POLICY "Allow authenticated to upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Allow public to read article images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Allow authenticated to delete article images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');

CREATE POLICY "Allow authenticated to update article images"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Site Images
CREATE POLICY "Allow authenticated to upload site images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Allow public to read site images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Allow authenticated to delete site images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'site-images');

CREATE POLICY "Allow authenticated to update site images"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (bucket_id = 'site-images');
