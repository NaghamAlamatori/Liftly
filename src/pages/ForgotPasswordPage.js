import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [info, setInfo] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const navigate = useNavigate();

  async function sendResetLink() {
    setError("");
    setInfo("");
    const cleanEmail = String(email || "").trim();
    if (!cleanEmail) {
      setError("Email is required.");
      return;
    }

    setSending(true);
    try {
      // Magic link password recovery (Supabase will open this URL with a recovery session in the URL).
      const redirectTo = `${window.location.origin}/login?reset=1`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo });
      if (resetError) throw resetError;

      setInfo("Please check your email and open the password reset link to continue.");
      setTimeout(() => navigate("/login?reset=1", { replace: true }), 800);
    } catch (e) {
      setError(e?.message || "Unable to send reset email.");
    } finally {
      setSending(false);
    }
  }

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
            Reset Password
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-[13px]">
              <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">Email</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>

            {error ? <div className="text-sm font-medium text-[hsl(var(--brand-2))]">{error}</div> : null}
            {info ? <div className="text-sm font-medium text-[hsl(var(--brand-soft))]">{info}</div> : null}

            <Button type="button" disabled={sending} onClick={sendResetLink}>
              {sending ? "Sending..." : "Send reset link"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}


