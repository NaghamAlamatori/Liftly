import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { PasswordInput } from "../components/ui/password-input";
import { cn } from "../lib/utils";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { siteImage } from "../lib/publicAssets";

// Always use the project logo for auth screens
const imgLogo = siteImage("logo.png");

function TopNav() {
  return (
    <div className="mx-auto flex w-[1240px] max-w-full items-center justify-between py-[65px]">
      <div className="flex items-center gap-12 text-base text-[hsl(var(--figma-text))]">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/products"> Products</Link>
        <Link to="/articles">Articles</Link>
        <Link to="/plan">Plan</Link>
      </div>
      <Button asChild>
        <Link to="/login">Login</Link>
      </Button>
    </div>
  );
}

function FooterLite() {
  return (
    <div className="w-full px-[100px] py-10">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-10">
        <div className="flex w-full items-center justify-between p-2">
          <div className="text-[64px] font-bold leading-none text-primary">LIFTLY</div>
          <div className="flex items-center gap-12 text-sm text-[hsl(var(--figma-text))]">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/products"> Products</Link>
            <Link to="/articles">Articles</Link>
            <Link to="/plan">Plan</Link>
          </div>
        </div>
        <div className="text-xs leading-5 text-white/65">© 2025 Liftly. All rights reserved.</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const resetMode = React.useMemo(() => {
    const sp = new URLSearchParams(location.search || "");
    return sp.get("reset") === "1" || !!location.state?.reset;
  }, [location.search, location.state]);
  const [hasRecoverySession, setHasRecoverySession] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!resetMode) return;
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setHasRecoverySession(!!data?.session);
    })();
    return () => {
      mounted = false;
    };
  }, [resetMode]);

  return (
    <div className="min-h-screen w-full bg-background">
      <TopNav />

      <div className="mx-auto flex w-[1440px] max-w-full items-center justify-center px-[498px] pb-[112px] pt-9">
        <Card className="w-[551px] max-w-full p-16">
          <div className="flex flex-col items-center gap-5">
            <img alt="" src={imgLogo} className="h-[75px] w-[80px]" />
            <div className="text-center text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
              Welcome Back
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            {resetMode ? (
              <>
                <div className="text-sm font-medium text-[hsl(var(--brand-soft))]">
                  {hasRecoverySession
                    ? "Set your new password to complete the reset process."
                    : "Open the password reset link from your email first, then set your new password here."}
                </div>
                <div className="flex flex-col gap-[13px]">
                  <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">
                    New Password
                  </div>
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="********"
                    disabled={!hasRecoverySession}
                  />
                </div>
                <div className="flex flex-col gap-[13px]">
                  <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">
                    Confirm New Password
                  </div>
                  <PasswordInput
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder="********"
                    disabled={!hasRecoverySession}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-[13px]">
                  <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">
                    User Name
                  </div>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="name" />
                </div>

                <div className="flex flex-col gap-[13px]">
                  <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">
                    Enter Password
                  </div>
                  <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
                </div>
              </>
            )}

            <div className="flex flex-col gap-2 tracking-[-0.48px] text-[hsl(var(--figma-soft))]">
              <Link to="/signup" className="text-base font-semibold">
                <span className="font-normal">Don’t have an account?</span>{" "}
                <span className="text-primary underline">Sign up</span>
              </Link>
              <Link to="/forgot-password" className="text-base font-medium">
                Forgot Password?
              </Link>
            </div>

            {info ? <div className="text-sm font-medium text-[hsl(var(--brand-soft))]">{info}</div> : null}
            {error ? (
              <div className="text-sm font-medium text-[hsl(var(--brand-2))]">{error}</div>
            ) : null}

            <Button
              size="block"
              className={cn("rounded-xl")}
              type="button"
              disabled={submitting}
              onClick={async () => {
                setError("");
                setInfo("");
                setSubmitting(true);
                try {
                  if (resetMode) {
                    if (!hasRecoverySession) {
                      setError("Reset session not found. Please open the reset link from your email.");
                      return;
                    }
                    if (!newPassword || newPassword.length < 6) {
                      setError("New password must be at least 6 characters.");
                      return;
                    }
                    if (newPassword !== newPasswordConfirm) {
                      setError("Passwords do not match.");
                      return;
                    }

                    const { data: sess } = await supabase.auth.getSession();
                    if (!sess?.session) {
                      setError("Reset session expired. Please use “Forgot Password” again.");
                      return;
                    }

                    const { error: upErr } = await supabase.auth.updateUser({ password: newPassword });
                    if (upErr) {
                      // If the user sets the same password, Supabase throws an error.
                      // We treat this as success since the goal is achieved (password is what they want).
                      const isSamePasswordError = String(upErr.message || "")
                        .toLowerCase()
                        .includes("different from the old password");

                      if (!isSamePasswordError) {
                        throw upErr;
                      }
                    }

                    await supabase.auth.signOut();

                    setInfo("Password updated successfully. Please log in.");
                    navigate("/login", { replace: true });
                    return;
                  }

                  const res = await login({ username, password });
                  if (!res.ok) {
                    setError(res.error);
                    return;
                  }
                  const role = res.user?.user_metadata?.role;
                  const isAdmin =
                    role === "admin" || String(res.user?.email || "").toLowerCase() === "admin@gmail.com";

                  // If admin is logging in, prefer the dashboard over the home page.
                  // If they were trying to access a protected page, keep that behavior.
                  const next = isAdmin && (from === "/" || !from) ? "/dashboard" : from;
                  navigate(next, { replace: true });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {resetMode
                ? submitting
                  ? "Updating..."
                  : "Update password"
                : submitting
                  ? "Logging in..."
                  : "Login"}
            </Button>
          </div>
        </Card>
      </div>

      <FooterLite />
    </div>
  );
}


