import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { PasswordInput } from "../components/ui/password-input";
import { useAuth } from "../auth/AuthContext";
import { siteImage } from "../lib/publicAssets";

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

export default function CreateAccountPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [requestedRole, setRequestedRole] = useState("user");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background">
      <TopNav />

      <div className="mx-auto flex w-[1440px] max-w-full items-center justify-center px-[498px] pb-[112px] pt-9">
        <Card className="w-[551px] max-w-full p-16">
          <div className="flex flex-col items-center gap-5">
            <img alt="" src={imgLogo} className="h-[75px] w-[80px]" />
            <div className="text-center text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
              Create Account
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-[13px]">
              <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">
                Full Name
              </div>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="name" />
            </div>

            <div className="flex flex-col gap-[13px]">
              <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">
                Email address
              </div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" />
            </div>

            <div className="flex flex-col gap-[13px]">
              <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">
                Enter Password
              </div>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
            </div>

            <div className="flex flex-col gap-[13px]">
              <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">
                Confirm Password
              </div>
              <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="********" />
            </div>

            <div className="flex flex-col gap-[13px]">
              <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">Create User</div>
              <div className="relative">
                <select
                  value={requestedRole}
                  onChange={(e) => setRequestedRole(e.target.value)}
                  className="flex h-12 w-full appearance-none rounded-[14px] border border-[hsl(var(--brand))] bg-transparent px-4 py-3 text-base text-foreground shadow-[0px_0px_0px_1px_hsl(var(--brand-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="user" className="bg-[hsl(var(--figma-surface))] text-white">
                    user
                  </option>
                  <option value="admin" className="bg-[hsl(var(--figma-surface))] text-white">
                    admin
                  </option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--brand-soft))]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-xs text-white/60">
                Role selection is recorded as a request. Admin access is controlled by Supabase RLS + server policies.
              </div>
            </div>

            {error ? (
              <div className="text-sm font-medium text-[hsl(var(--brand-2))]">{error}</div>
            ) : null}

            <Button
              size="block"
              type="button"
              disabled={submitting}
              onClick={async () => {
                setError("");
                if (!email || !password) {
                  setError("Email and password are required.");
                  return;
                }
                if (password !== confirm) {
                  setError("Passwords do not match.");
                  return;
                }

                setSubmitting(true);
                try {
                  const res = await signup({
                    name: fullName || "User",
                    email,
                    password,
                    metadata: { requested_role: requestedRole },
                  });
                  if (!res.ok) {
                    setError(res.error);
                    return;
                  }
                  navigate("/", { replace: true });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </Card>
      </div>

      <FooterLite />
    </div>
  );
}


