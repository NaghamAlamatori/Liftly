import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PasswordInput } from "../components/ui/password-input";
import { supabase } from "../lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setHasSession(!!data?.session);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setHasSession(false);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
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

      <div className="mx-auto flex w-[1440px] max-w-full items-center justify-center px-[498px] pb-[112px] pt-9">
        <Card className="w-[551px] max-w-full p-16">
          <div className="text-center text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
            Set new password
          </div>

          {loading ? (
            <div className="mt-8 text-sm text-[hsl(var(--figma-soft))]">Loading…</div>
          ) : !hasSession ? (
            <div className="mt-8 text-sm text-[hsl(var(--figma-soft))]">
              This page must be opened from the password reset email link.
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col gap-[13px]">
                <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">New Password</div>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
              </div>

              <div className="flex flex-col gap-[13px]">
                <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">Confirm Password</div>
                <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="********" />
              </div>

              {error ? <div className="text-sm font-medium text-[hsl(var(--brand-2))]">{error}</div> : null}
              {success ? (
                <div className="text-sm font-medium text-[hsl(var(--brand-soft))]">Password updated. You can login now.</div>
              ) : null}

              <Button
                type="button"
                onClick={async () => {
                  setError("");
                  setSuccess(false);

                  if (!password) {
                    setError("Password is required.");
                    return;
                  }
                  if (password !== confirm) {
                    setError("Passwords do not match.");
                    return;
                  }

                  const { error: updateError } = await supabase.auth.updateUser({ password });
                  if (updateError) {
                    setError(updateError.message || "Unable to update password.");
                    return;
                  }

                  setSuccess(true);
                  setTimeout(() => navigate("/login", { replace: true }), 900);
                }}
              >
                Update password
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

