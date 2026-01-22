import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

/**
 * SERVER-ONLY MODULE
 * ------------------
 * This file must never be bundled into client-side code, because it initializes a
 * Supabase client with the Service Role key (full database access, bypasses RLS).
 *
 * Security-critical rule:
 * - SUPABASE_SERVICE_ROLE_KEY must only exist on the server.
 */

type JsonRecord = Record<string, unknown>;

export type AuthError = {
  message: string;
  status?: number;
  code?: string;
  name?: string;
  cause?: unknown;
};

export type Result<T> = {
  data: T | null;
  error: AuthError | null;
};

export type SignUpData = {
  user: User | null;
  session: unknown | null;
};

export type SignInData = {
  user: User | null;
  session: unknown | null;
};

export type SessionData =
  | {
      /** Present when using token-based (server) flows */
      accessToken?: string;
      user: User | null;
      /** Present when the SDK can retrieve a persisted session (browser / cookie adapters) */
      session?: unknown | null;
    }
  | null;

function isBrowserRuntime(): boolean {
  // Covers most bundlers/runtimes. This module is intended for server usage only.
  // If this triggers, you're importing it in client code (security bug).
  // eslint-disable-next-line no-restricted-globals
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function normalizeError(err: unknown): AuthError {
  if (!err) return { message: "Unknown error" };

  // Supabase errors typically have: message, status, code, name
  if (typeof err === "object") {
    const anyErr = err as any;
    const message =
      typeof anyErr.message === "string"
        ? anyErr.message
        : typeof anyErr.error_description === "string"
          ? anyErr.error_description
          : "Unknown error";
    const status = typeof anyErr.status === "number" ? anyErr.status : undefined;
    const code = typeof anyErr.code === "string" ? anyErr.code : undefined;
    const name = typeof anyErr.name === "string" ? anyErr.name : undefined;
    return { message, status, code, name, cause: err };
  }

  if (typeof err === "string") return { message: err };
  return { message: "Unknown error", cause: err };
}

function ok<T>(data: T): Result<T> {
  return { data, error: null };
}

function fail<T>(err: unknown): Result<T> {
  return { data: null, error: normalizeError(err) };
}

function assertEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

function envOneOf(names: string[]): string {
  for (const name of names) {
    const v = process.env[name];
    if (v) return v;
  }
  throw new Error(`Missing required environment variable (one of): ${names.join(", ")}`);
}

function assertServerOnly() {
  if (isBrowserRuntime()) {
    throw new Error(
      "SecurityError: auth.ts was imported in a browser runtime. " +
        "Do not bundle server-only auth modules into client code."
    );
  }
}

// Support both server env var naming and CRA-style naming (REACT_APP_*) for local dev ergonomics.
const SUPABASE_URL = envOneOf(["SUPABASE_URL", "REACT_APP_SUPABASE_URL"]);
const SUPABASE_ANON_KEY = envOneOf(["SUPABASE_ANON_KEY", "REACT_APP_SUPABASE_ANON_KEY"]);

// Public (anon) client: safe to use wherever (still best kept server-side in this module).
export const supabasePublic: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Server best-practice defaults: no implicit persistence/refresh.
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// Admin client: SERVICE ROLE (bypasses RLS) — server only.
function getSupabaseAdmin(): SupabaseClient {
  assertServerOnly();
  const key = assertEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(SUPABASE_URL, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * signUp(email, password, metadata?)
 * Creates a new user via Supabase Auth.
 */
export async function signUp(email: string, password: string, metadata?: JsonRecord): Promise<Result<SignUpData>> {
  try {
    const { data, error } = await supabasePublic.auth.signUp({
      email,
      password,
      options: metadata ? { data: metadata } : undefined,
    });
    if (error) return fail(error);
    return ok({ user: data.user ?? null, session: (data as any).session ?? null });
  } catch (err) {
    return fail(err);
  }
}

/**
 * signIn(email, password)
 * Signs in via email/password. Returns session + user (caller should store tokens in cookies/session store).
 */
export async function signIn(email: string, password: string): Promise<Result<SignInData>> {
  try {
    const { data, error } = await supabasePublic.auth.signInWithPassword({ email, password });
    if (error) return fail(error);
    return ok({ user: data.user ?? null, session: data.session ?? null });
  } catch (err) {
    return fail(err);
  }
}

/**
 * signOut()
 * Server-safe: if you provide an access token, this will attempt an admin sign-out (revokes tokens).
 * Otherwise, it calls the standard signOut (may be a no-op server-side if no persisted session exists).
 */
export async function signOut(): Promise<Result<true>>;
export async function signOut(accessToken: string): Promise<Result<true>>;
export async function signOut(accessToken?: string): Promise<Result<true>> {
  try {
    if (accessToken) {
      // Admin signOut revokes the user's refresh tokens / sessions for that JWT.
      // Type-cast because admin API surface may vary across SDK versions.
      const admin = (getSupabaseAdmin().auth as any).admin;
      if (admin?.signOut) {
        const { error } = await admin.signOut(accessToken);
        if (error) return fail(error);
        return ok(true);
      }
    }

    const { error } = await supabasePublic.auth.signOut();
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

/**
 * getSession()
 * Server note: without a cookie/session adapter, the SDK will not have a persisted session.
 * If you pass an access token, we return a lightweight session object with the resolved user.
 */
export async function getSession(): Promise<Result<SessionData>>;
export async function getSession(accessToken: string): Promise<Result<SessionData>>;
export async function getSession(accessToken?: string): Promise<Result<SessionData>> {
  try {
    if (accessToken) {
      const { data, error } = await supabasePublic.auth.getUser(accessToken);
      if (error) return fail(error);
      return ok({ accessToken, user: data.user ?? null });
    }

    const { data, error } = await supabasePublic.auth.getSession();
    if (error) return fail(error);
    return ok({ session: data.session ?? null, user: data.session?.user ?? null });
  } catch (err) {
    return fail(err);
  }
}

/**
 * getUser()
 * If accessToken is provided, validates it with Supabase and returns the associated user.
 */
export async function getUser(): Promise<Result<User | null>>;
export async function getUser(accessToken: string): Promise<Result<User | null>>;
export async function getUser(accessToken?: string): Promise<Result<User | null>> {
  try {
    const res = accessToken ? await supabasePublic.auth.getUser(accessToken) : await supabasePublic.auth.getUser();
    if (res.error) return fail(res.error);
    return ok(res.data.user ?? null);
  } catch (err) {
    return fail(err);
  }
}

/**
 * resetPassword(email)
 * Sends a reset email. Optional redirect can be set via SUPABASE_PASSWORD_RESET_REDIRECT_TO.
 */
export async function resetPassword(email: string): Promise<Result<true>> {
  try {
    const redirectTo = process.env.SUPABASE_PASSWORD_RESET_REDIRECT_TO;
    const { error } = await supabasePublic.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

/**
 * updatePassword(newPassword)
 * Server-safe implementation: requires an access token (or use admin update by user id yourself).
 * If accessToken is provided, we resolve the user and update password via admin client.
 */
export async function updatePassword(newPassword: string): Promise<Result<true>>;
export async function updatePassword(newPassword: string, accessToken: string): Promise<Result<true>>;
export async function updatePassword(newPassword: string, accessToken?: string): Promise<Result<true>> {
  try {
    if (!accessToken) {
      return fail({
        name: "MissingAccessToken",
        message:
          "updatePassword requires an access token in server environments. " +
          "Call updatePassword(newPassword, accessToken).",
        status: 400,
      });
    }

    const userRes = await supabasePublic.auth.getUser(accessToken);
    if (userRes.error) return fail(userRes.error);
    const user = userRes.data.user;
    if (!user) {
      return fail({ name: "NotAuthenticated", message: "No authenticated user for provided token.", status: 401 });
    }

    const admin = (getSupabaseAdmin().auth as any).admin;
    if (!admin?.updateUserById) {
      return fail({ name: "Unsupported", message: "Supabase admin updateUserById is unavailable.", status: 500 });
    }

    const { error } = await admin.updateUserById(user.id, { password: newPassword });
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

/**
 * requireAuth()
 * Throws (by returning an error result) when no valid user is present.
 */
export async function requireAuth(): Promise<Result<User>>;
export async function requireAuth(accessToken: string): Promise<Result<User>>;
export async function requireAuth(accessToken?: string): Promise<Result<User>> {
  const res = accessToken ? await getUser(accessToken) : await getUser();
  if (res.error) return fail(res.error);
  if (!res.data) return fail({ name: "NotAuthenticated", message: "Authentication required.", status: 401 });
  return ok(res.data);
}

/**
 * isAuthenticated()
 * Returns true when a valid user is present for the current session/token.
 */
export async function isAuthenticated(): Promise<Result<boolean>>;
export async function isAuthenticated(accessToken: string): Promise<Result<boolean>>;
export async function isAuthenticated(accessToken?: string): Promise<Result<boolean>> {
  const res = accessToken ? await getUser(accessToken) : await getUser();
  if (res.error) return fail(res.error);
  return ok(!!res.data);
}


