## Site images upload (Supabase)

This folder is used by the uploader script to populate your Supabase Storage bucket:

- Bucket: `site-images` (public)
- Destination path: `mcp/<id>` (no extension)

### Steps

1. List required IDs:

```powershell
npm run images:ids
```

2. Put images here named by ID (any image extension is fine):

- `storage-seed/site-images/<id>.png`
- `storage-seed/site-images/<id>.jpg`

### Easier (auto-rename)

Drop any images into:

- `storage-seed/site-images/incoming/`

Then run:

```powershell
npm run images:prepare:site
```

This will rename/move them to the required UUID filenames automatically (in order).

3. Upload (local only; requires service role key):

```powershell
$env:SUPABASE_URL="https://wareznlczybqgksqslmc.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
npm run images:upload:site
```

