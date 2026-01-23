# Article Upload Fix - Setup Guide

## Changes Made

### 1. **Image Upload Functionality Added** 
   - [AdminArticleInfoPage.js](src/pages/admin%20pages/AdminArticleInfoPage.js)
   - Users can now click on the image area to upload article images
   - Images are uploaded to Supabase Storage (`article-images` bucket)
   - Uploaded images display as previews in the form
   - Option to remove the image before saving

### 2. **Database Insert Fix**
   - Changed `insert(payload)` to `insert([payload])` - Supabase requires array format
   - Improved error handling for the save operation

## Fixing the "Row Violates Row-Level Security Policy" Error

### Root Cause
The articles table has Row-Level Security (RLS) enabled, but there are no policies allowing admins to insert/update articles.

### Solution - Steps to Fix

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project (wareznlczybqgksqslmc)
   - Click on "SQL Editor" in the left sidebar

2. **Run the SQL Script**
   - Copy all the SQL from `ARTICLES_RLS_FIX.sql` file
   - Paste it into the SQL Editor
   - Click "Run" button
   - Wait for confirmation that the policies were created

3. **Verify the Policies**
   - Navigate to: Authentication → Policies (in left sidebar)
   - Select "articles" table
   - You should see 4 policies:
     - `allow_read_all`
     - `allow_insert_admin`
     - `allow_update_admin`
     - `allow_delete_admin`

## Testing

After running the SQL script:

1. Log in as admin (admin@gmail.com / admin123)
2. Go to Dashboard → Articles
3. Click "Add a new article"
4. Fill in the form:
   - **Title**: Required
   - **Article Image**: Click the image area to upload (optional)
   - **Content**: Required
5. Click "Save"

The article should now be created successfully in the database.

## Environment Variable (Optional)

If you're using a different bucket name for articles, set this in `.env.local`:

```bash
REACT_APP_SUPABASE_ARTICLE_IMAGES_BUCKET=your-bucket-name
```

Default is `article-images`.

## Storage Bucket Setup

Make sure your `article-images` bucket in Supabase Storage is:
- **Public** (allows reading uploaded files)
- Created and accessible

If it doesn't exist, create it in Supabase → Storage → Create bucket.
