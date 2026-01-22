import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import SiteNav from "../components/SiteNav";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthContext";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { siteImage } from "../lib/publicAssets";

const imgHero = siteImage("Plan1.png");;
const imgFooterLogo =siteImage("logo.png");

function SiteFooter({ active = "plan" }) {
  return (
    <div className="w-full px-[100px] py-10">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-10">
        <div className="flex w-full items-center justify-between p-2">
          <div className="flex items-center gap-4">
            <img alt="" src={imgFooterLogo} className="h-[75px] w-[80px]" />
            <div className="text-[64px] font-bold leading-none text-primary">LIFTLY</div>
          </div>
          <div className="flex items-center gap-12 text-sm">
            <Link
              className={cn(
                "text-[hsl(var(--figma-text))]",
                active === "home" && "font-semibold text-primary underline"
              )}
              to="/"
            >
              Home
            </Link>
            <Link
              className={cn(
                "text-[hsl(var(--figma-text))]",
                active === "about" && "font-semibold text-primary underline"
              )}
              to="/about"
            >
              About
            </Link>
            <Link
              className={cn(
                "text-[hsl(var(--figma-text))]",
                active === "products" && "font-semibold text-primary underline"
              )}
              to="/products"
            >
              Products
            </Link>
            <Link
              className={cn(
                "text-[hsl(var(--figma-text))]",
                active === "articles" && "font-semibold text-primary underline"
              )}
              to="/articles"
            >
              Articles
            </Link>
            <Link
              className={cn(
                "text-[hsl(var(--figma-text))]",
                active === "plan" && "font-semibold text-primary underline"
              )}
              to="/plan"
            >
              Plan
            </Link>
          </div>
        </div>
        <div className="text-xs leading-5 text-white/65">© 2025 Liftly. All rights reserved.</div>
      </div>
    </div>
  );
}

function PlanCard({ title, subtitle, onEdit, onDelete }) {
  return (
    <div className="relative flex h-[76px] w-[411px] items-center justify-between overflow-hidden rounded-[20px] border border-primary bg-[hsl(var(--figma-surface))] px-6 shadow-[0px_0px_0px_1px_hsl(var(--brand-2))]">
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0px_-6px_20px_0px_rgba(254,238,174,0.1)]" />
      <div className="min-w-0">
        <div className="truncate text-[40px] font-semibold leading-[1.1] tracking-[-1.2px] text-white">
          {title}
        </div>
        {subtitle ? (
          <div className="truncate text-[12px] font-medium text-[hsl(var(--figma-text))]/80">{subtitle}</div>
        ) : null}
      </div>
      <div className="flex w-[66px] flex-col gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="w-full rounded-[30px] border border-[hsl(var(--brand-soft))] px-2 py-2 text-left text-[8px] font-bold leading-none text-[hsl(var(--brand-soft))] [text-shadow:0px_1px_2px_rgba(0,0,0,0.2)]"
        >
          Modification
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="w-full rounded-[30px] border border-[hsl(var(--brand-soft))] px-2 py-2 text-center text-[8px] font-bold leading-none text-[hsl(var(--brand-soft))] [text-shadow:0px_1px_2px_rgba(0,0,0,0.2)]"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function PlansListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadPlans = React.useCallback(async () => {
    if (!user?.id) return;
    setError("");
    setLoading(true);
    try {
      // Map auth user -> public.users row (bigint user_id)
      let { data: appUser, error: uErr } = await supabase
        .from("users")
        .select("user_id,auth_user_id,email,full_name")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      // If no row exists, try to create one (works if RLS/policies allow it).
      if (!uErr && !appUser) {
        const { data: inserted, error: insErr } = await supabase
          .from("users")
          .insert({
            auth_user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          })
          .select("user_id,auth_user_id,email,full_name")
          .maybeSingle();
        if (!insErr) appUser = inserted ?? null;
      }

      if (uErr) throw uErr;
      if (!appUser?.user_id) {
        setPlans([]);
        return;
      }

      const { data, error: pErr } = await supabase
        .from("workout_plans")
        .select("plan_id,goal,days,difficulty,created_at")
        .eq("user_id", appUser.user_id)
        .order("created_at", { ascending: false });

      if (pErr) throw pErr;
      setPlans(data ?? []);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Failed to load plans:", e);
      setError(e?.message || "Failed to load plans.");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.email, user?.user_metadata]);

  React.useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  async function onDeleteConfirmed() {
    const planId = deleteTarget?.plan_id;
    if (!planId) return;
    setError("");
    setDeleting(true);
    try {
      const { error: delErr } = await supabase.from("workout_plans").delete().eq("plan_id", planId);
      if (delErr) {
        setError(delErr.message || "Failed to delete plan.");
        return;
      }
      await loadPlans();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-[100px] bg-background">
      <div className="w-full max-w-[1440px]">
        <SiteNav active="plan" />
        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete plan?"
          description="This action cannot be undone."
          confirmText="Delete"
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={onDeleteConfirmed}
        />

        <div className="relative mx-auto h-[486px] w-[1440px] max-w-full pb-0 pl-[98px] pr-[10px] pt-[67px]">
          <Button
            asChild
            variant="outline"
            className="absolute bottom-[40px] left-[100px] h-auto border-[hsl(var(--brand-soft))] px-8 py-2 font-bold text-[hsl(var(--brand-soft))]"
          >
            <Link to="/plan">Back</Link>
          </Button>

          <div className="flex flex-col gap-[38px]">
            {loading ? (
              <div className="text-[16px] font-semibold text-[hsl(var(--figma-text))]">Loading…</div>
            ) : error ? (
              <div className="text-[16px] font-semibold text-[hsl(var(--brand-2))]">{error}</div>
            ) : plans.length ? (
              plans.map((p) => (
                <PlanCard
                  key={p.plan_id}
                  title={`Plan ${p.plan_id}`}
                  subtitle={[p.goal, p.difficulty, p.days ? `${p.days} days` : null].filter(Boolean).join(" • ")}
                  onEdit={() => navigate(`/plan/list/${p.plan_id}`)}
                  onDelete={() => setDeleteTarget(p)}
                />
              ))
            ) : (
              <div className="text-[16px] font-semibold text-[hsl(var(--figma-text))]">No saved plans yet.</div>
            )}
          </div>

          <div className="absolute left-[787px] top-[17px] h-[453px] w-[453px]">
            <img alt="" src={imgHero} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <SiteFooter active="plan" />
    </div>
  );
}


