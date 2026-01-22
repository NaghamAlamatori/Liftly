import React from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = React.createContext(null);

function normalizeAuthError(error) {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (typeof error?.message === "string") return error.message;
  return "Something went wrong. Please try again.";
}

/**
 * Browser auth provider backed by Supabase Auth.
 * - Persists sessions (handled by Supabase SDK)
 * - Keeps `user` in sync via `onAuthStateChange`
 */
export function AuthProvider({ children }) {
  const [session, setSession] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          // eslint-disable-next-line no-console
          console.warn("Supabase getSession error:", error);
        }
        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        // eslint-disable-next-line no-console
        console.warn("Supabase getSession exception:", err);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const isAuthenticated = !!user;

  const login = React.useCallback(async ({ username, password }) => {
    try {
      // This app UI calls it "username", but Supabase email/password auth expects an email.
      const email = String(username || "").trim();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: normalizeAuthError(error) };
      setSession(data.session ?? null);
      setUser(data.user ?? null);
      return { ok: true, user: data.user ?? null };
    } catch (err) {
      return { ok: false, error: normalizeAuthError(err) };
    }
  }, []);

  const signup = React.useCallback(async ({ name, email, password, metadata }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // IMPORTANT: do not accept `role` from public sign-ups (AdminRoute relies on user_metadata.role).
          // If you want to capture UI selections, pass them as other metadata keys (e.g. `requested_role`).
          data: { full_name: name, ...(metadata && typeof metadata === "object" ? metadata : {}) },
        },
      });
      if (error) return { ok: false, error: normalizeAuthError(error) };
      setSession(data.session ?? null);
      setUser(data.user ?? null);
      return { ok: true, user: data.user ?? null };
    } catch (err) {
      return { ok: false, error: normalizeAuthError(err) };
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // eslint-disable-next-line no-console
        console.warn("Supabase signOut error:", error);
      }
    } finally {
      setSession(null);
      setUser(null);
    }
  }, []);

  const value = React.useMemo(
    () => ({ user, session, loading, isAuthenticated, login, signup, logout }),
    [user, session, loading, isAuthenticated, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}


