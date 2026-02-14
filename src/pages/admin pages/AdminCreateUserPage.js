import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { PasswordInput } from "../../components/ui/password-input";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabaseClient";
import { siteImage } from "../../lib/publicAssets";

const imgLogo = siteImage("logo.png");

export default function AdminCreateUserPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function createUser() {
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const cleanEmail = String(email || "").trim();
      if (!cleanEmail || !password) {
        setError("Email and password are required.");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return false;
      }

      // Preserve admin session — signUp can switch the active session when confirmations are disabled.
      const { data: prev } = await supabase.auth.getSession();
      const prevSession = prev?.session ?? null;

      const { data, error: authErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: fullName || null, role: role || "user" },
        },
      });
      if (authErr) throw authErr;

      // signUp may not return a user id when email confirmations are enabled.
      // To ensure admins can see the new account (pending verification) immediately,
      // always create a row in the `users` table keyed by email. If/when the auth
      // user appears later, a server-side function or trigger should reconcile the
      // `auth_user_id` (recommended). Here we insert with null `auth_user_id` so the
      // admin UI can list pending users and pick them up in realtime.
      const authUserId = data?.user?.id ?? null;
      await supabase.from("users").insert({
        auth_user_id: authUserId,
        email: cleanEmail,
        full_name: fullName || null,
        role: role || "user",
      });

      // Restore admin session (if it existed).
      if (prevSession?.access_token && prevSession?.refresh_token) {
        await supabase.auth.setSession({
          access_token: prevSession.access_token,
          refresh_token: prevSession.refresh_token,
        });
      }

      setSuccess("User created. Ask the user to check their email to confirm authentication.");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirm("");
      setRole("user");
      return true;
    } catch (e) {
      setError(e?.message || "Failed to create user.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-background" data-name="admin create user">
      <AdminSidebar />

      {/* Header row (same admin layout as dashboard) */}
      <div className="absolute left-[297px] top-[21px] right-[40px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={29} className="h-[29px] w-[29px] text-primary" />
          <p className="text-[32px] font-normal leading-normal text-primary">Create User</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-auto px-6 py-2"
          onClick={() => navigate("/dashboard/users")}
        >
          Users
        </Button>
      </div>

      {/* Main content */}
      <div className="absolute left-[232px] right-0 top-0 flex min-h-screen items-start justify-center px-10 pt-[120px]">
        <Card className="w-[551px] max-w-full p-16">
          <div className="flex flex-col items-center gap-5">
            <img alt="" src={imgLogo} className="h-[75px] w-[80px]" />
            <div className="text-center text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
              Create User
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-[13px]">
              <div className="text-xl font-light tracking-[-0.6px] text-[hsl(var(--figma-soft))]">Full Name</div>
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
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={cn(
                    "flex h-12 w-full appearance-none rounded-[14px] border border-[hsl(var(--brand))] bg-transparent px-4 py-3 text-base text-foreground shadow-[0px_0px_0px_1px_hsl(var(--brand-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  <option value="admin" className="bg-[hsl(var(--figma-surface))] text-white">
                    admin
                  </option>
                  <option value="user" className="bg-[hsl(var(--figma-surface))] text-white">
                    user
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
            </div>

            {error ? <div className="text-sm font-medium text-[hsl(var(--brand-2))]">{error}</div> : null}
            {success ? <div className="text-sm font-medium text-primary">{success}</div> : null}

            <Button
              size="block"
              type="button"
              disabled={submitting}
              onClick={async () => {
                const ok = await createUser();
                if (ok) navigate("/dashboard/users");
              }}
            >
              {submitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

