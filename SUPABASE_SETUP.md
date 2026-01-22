# Supabase setup (Liftly)

## Env vars (Create React App)

Create a file named `.env.local` in the project root with:

```bash
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

For this repo’s current Supabase project, the URL is:

`https://wareznlczybqgksqslmc.supabase.co`

### Important (fixes “Missing required environment variable” errors)

- **Restart required**: after creating/editing `.env.local`, you must stop and re-run `npm start` (CRACO/CRA only reads `.env*` on startup).
- **Which key to use**: use the Supabase **Publishable key** (`sb_publishable_...`) or legacy **anon** key from **Project Settings → API** (both are safe to use client-side).

## Note about Supabase Auth

If you want email/password signups through Supabase Auth, ensure **Auth → Providers → Email** is enabled.

## Password reset redirect

In the Supabase Dashboard, add this URL to **Auth → URL Configuration → Redirect URLs**:

`http://localhost:3000/reset-password`

## Storage buckets (images)

You already created these buckets:

- `site-images` (public) — UI/static images (logos, icons, backgrounds)
- `article-images` (public) — article thumbnails/content
- `product-images` (public) — product images

### Important

- **Public** only affects *reading*. Uploading still requires Storage permissions.
- The frontend code was updated to stop using Figma MCP URLs and instead load UI images from:
  - `site-images/mcp/<id>` (no extension)

### Local images (recommended)

This project can run **without any remote UI image URLs** by copying all required images into:

- `public/assets/mcp/`

Then the app loads images locally via `mcpAsset(<id>)`.

#### Prepare local images (auto)

1. Put your images in `storage-seed/site-images/` as `<uuid>.<ext>` (the `images:prepare:site` script can rename them for you).
2. Copy into `public/assets/mcp/` and generate the manifest:

```powershell
npm run images:localize:public
```

### Upload UI images to Supabase Storage (optional)

1. Print the list of required image IDs:

```powershell
npm run images:ids
```

2. Export/download your images (PNG/JPG) and save them locally as:

`storage-seed/site-images/<id>.png`

3. Upload them to Supabase Storage (uses **service role key**, runs locally only):

```powershell
$env:SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
npm run images:upload:site
```

After upload, the app will load images from the public URLs automatically.

## Seed admin user (Supabase Auth + public.users)

This repo includes a **server-only** seed script that creates the admin user in **Supabase Auth** and upserts a matching row in `public.users` with `role='admin'`.

- **Username**: `admin`
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

### Required env vars (do NOT put service role key in client env)

- `SUPABASE_URL`: `https://wareznlczybqgksqslmc.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: from **Supabase Dashboard → Project Settings → API → Service role key** (secret!)

### Run (PowerShell)

```powershell
$env:SUPABASE_URL="https://wareznlczybqgksqslmc.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
npm run seed:admin
```

> Note: This must be run locally on your machine. It uses the service role key and must never be bundled into the frontend.

add## Seeded admin

The admin seed is handled by the script above (it creates the Auth user + app profile row).



