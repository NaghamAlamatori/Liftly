import manifest from "./mcpAssetManifest.json";

function encodePath(path) {
  return String(path || "")
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

function storagePublicUrl(bucket, path) {
  const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
  if (!SUPABASE_URL) return "";
  const base = String(SUPABASE_URL).replace(/\/+$/, "");
  return `${base}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodePath(path)}`;
}

/**
 * siteImage(pathOrId)
 * Prefer Supabase Storage (public) assets from the `site-images` bucket.
 *
 * - If you pass a filename/path like `logo.png` or `mcp/logo.png`, it uses that directly.
 * - If you pass a legacy MCP id (uuid), it will map via mcpAssetManifest.json to a filename.
 */
export function siteImage(pathOrId) {
  const SITE_IMAGES_BUCKET = process.env.REACT_APP_SUPABASE_SITE_IMAGES_BUCKET || "site-images";
  const raw = String(pathOrId || "").trim();

  // If it looks like a filename/path, use it as-is.
  const looksLikePath = raw.includes("/") || raw.includes(".");
  const filename = looksLikePath ? raw : manifest?.[raw];

  // Prefer Supabase Storage when we can resolve a path.
  if (filename) {
    const url = storagePublicUrl(SITE_IMAGES_BUCKET, filename);
    if (url) return url;
  }

  // Local fallback (keeps dev working without Supabase configured)
  if (filename) return `/assets/mcp/${filename}`;
  return "/assets/mcp/logo.png";
}

// Backwards-compatible name used throughout the codebase.
export function mcpAsset(id) {
  return siteImage(id);
}

