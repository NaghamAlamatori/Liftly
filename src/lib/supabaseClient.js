import { createClient } from "@supabase/supabase-js";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      [
        `[Supabase] Missing required environment variable: ${name}`,
        "",
        "Create a `.env.local` file in the project root (same folder as package.json) with:",
        "  REACT_APP_SUPABASE_URL=...",
        "  REACT_APP_SUPABASE_ANON_KEY=...",
        "",
        "Then restart the dev server (`npm start`). CRA/CRACO only loads `.env*` at startup.",
      ].join("\n")
    );
  }
  return value;
}

function envOneOf(names) {
  for (const name of names) {
    const v = process.env[name];
    if (v) return v;
  }
  throw new Error(
    [
      `[Supabase] Missing required environment variable (one of): ${names.join(", ")}`,
      "",
      "Create a `.env.local` file in the project root (same folder as package.json) with:",
      "  REACT_APP_SUPABASE_URL=...",
      "  REACT_APP_SUPABASE_ANON_KEY=...   (or REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...)",
      "",
      "Then restart the dev server (`npm start`). CRA/CRACO only loads `.env*` at startup.",
    ].join("\n")
  );
}

// Create React App only exposes env vars prefixed with REACT_APP_ to the browser bundle.
const SUPABASE_URL = requireEnv("REACT_APP_SUPABASE_URL");
const SUPABASE_ANON_KEY = envOneOf(["REACT_APP_SUPABASE_ANON_KEY", "REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY"]);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Needed for password reset links that include tokens in the URL fragment/query.
    detectSessionInUrl: true,
  },
});

