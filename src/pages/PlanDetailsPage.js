import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { Button } from "../components/ui/button";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthContext";
import { ConfirmDialog } from "../components/ui/confirm-dialog";

function groupByDay(details) {
  const map = new Map();
  for (const d of details) {
    const day = d.day_number ?? 0;
    if (!map.has(day)) map.set(day, []);
    map.get(day).push(d);
  }
  return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
}

export default function PlanDetailsPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [plan, setPlan] = React.useState(null);
  const [details, setDetails] = React.useState([]);
  const [editing, setEditing] = React.useState(false);
  const [goal, setGoal] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("");
  const [days, setDays] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!user?.id) return;
    setError("");
    setLoading(true);
    try {
      const parsedPlanId = Number.parseInt(String(planId), 10);
      if (!Number.isFinite(parsedPlanId)) {
        setError("Invalid plan id.");
        return;
      }

      // Map auth user -> public.users row (bigint user_id)
      let { data: appUser, error: uErr } = await supabase
        .from("users")
        .select("user_id,auth_user_id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!uErr && !appUser) {
        const { data: inserted, error: insErr } = await supabase
          .from("users")
          .insert({
            auth_user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          })
          .select("user_id,auth_user_id")
          .maybeSingle();
        if (!insErr) appUser = inserted ?? null;
      }

      if (uErr) throw uErr;
      if (!appUser?.user_id) {
        setError("No user profile found.");
        return;
      }

      const { data: planRow, error: pErr } = await supabase
        .from("workout_plans")
        .select("plan_id,user_id,goal,days,difficulty,created_at")
        .eq("plan_id", parsedPlanId)
        .eq("user_id", appUser.user_id)
        .maybeSingle();

      if (pErr) throw pErr;
      if (!planRow) {
        setError("Plan not found.");
        return;
      }

      const { data: detRows, error: dErr } = await supabase
        .from("workout_details")
        .select("detail_id,plan_id,day_number,exercise_name,reps")
        .eq("plan_id", parsedPlanId)
        .order("day_number", { ascending: true })
        .order("detail_id", { ascending: true });

      if (dErr) throw dErr;

      setPlan(planRow);
      setDetails(detRows ?? []);
      setGoal(planRow.goal ?? "");
      setDifficulty(planRow.difficulty ?? "");
      setDays(planRow.days ? String(planRow.days) : "");
      setEditing(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Failed to load plan:", e);
      setError(e?.message || "Failed to load plan.");
    } finally {
      setLoading(false);
    }
  }, [planId, user?.id, user?.email, user?.user_metadata]);

  React.useEffect(() => {
    load();
  }, [load]);

  const grouped = React.useMemo(() => groupByDay(details), [details]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full max-w-[1440px] mx-auto">
        <SiteNav active="plan" />
      </div>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete plan?"
        description="This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          if (!plan) return;
          setError("");
          setDeleting(true);
          try {
            const { error: delErr } = await supabase.from("workout_plans").delete().eq("plan_id", plan.plan_id);
            if (delErr) {
              setError(delErr.message || "Failed to delete plan.");
              return;
            }
            navigate("/plan/list", { replace: true });
          } finally {
            setDeleting(false);
            setDeleteOpen(false);
          }
        }}
      />

      <div className="mx-auto w-[1240px] max-w-full px-6 pb-24">
        <div className="flex items-center justify-between py-10">
          <Button asChild variant="outline" className="border-[hsl(var(--brand-soft))] text-[hsl(var(--brand-soft))]">
            <Link to="/plan/list">Back</Link>
          </Button>

          {plan ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-[hsl(var(--brand-soft))] text-[hsl(var(--brand-soft))]"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
              <Button onClick={() => setEditing((v) => !v)}>{editing ? "Close edit" : "Edit"}</Button>
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="text-center text-[hsl(var(--figma-text))]">Loading…</div>
        ) : error ? (
          <div className="text-center font-semibold text-[hsl(var(--brand-2))]">{error}</div>
        ) : plan ? (
          <div className="space-y-8">
            <div className="rounded-[20px] border border-primary bg-[hsl(var(--figma-surface))] p-8 shadow-[0px_0px_0px_1px_hsl(var(--brand-2))]">
              <div className="text-[46px] font-semibold leading-[1.1] tracking-[-1.38px] text-primary">
                Plan {plan.plan_id}
              </div>
              <div className="mt-3 text-[16px] font-semibold text-[hsl(var(--figma-text))]/80">
                {[plan.goal, plan.difficulty, plan.days ? `${plan.days} days/week` : null].filter(Boolean).join(" • ")}
              </div>

              {editing ? (
                <div className="mt-8 grid gap-4">
                  <label className="grid gap-2">
                    <div className="text-sm font-semibold text-[hsl(var(--figma-text))]/80">Goal</div>
                    <input
                      className="h-11 rounded-[12px] border border-white/15 bg-black/40 px-4 text-white outline-none"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g. Strength"
                    />
                  </label>

                  <label className="grid gap-2">
                    <div className="text-sm font-semibold text-[hsl(var(--figma-text))]/80">Difficulty</div>
                    <input
                      className="h-11 rounded-[12px] border border-white/15 bg-black/40 px-4 text-white outline-none"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      placeholder="e.g. Beginner"
                    />
                  </label>

                  <label className="grid gap-2">
                    <div className="text-sm font-semibold text-[hsl(var(--figma-text))]/80">Days per week</div>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      className="h-11 rounded-[12px] border border-white/15 bg-black/40 px-4 text-white outline-none"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      placeholder="1-7"
                    />
                  </label>

                  <div className="mt-2">
                    <Button
                      disabled={saving}
                      onClick={async () => {
                        setError("");
                        const parsedDays = Number.parseInt(days, 10);
                        if (!Number.isFinite(parsedDays) || parsedDays < 1 || parsedDays > 7) {
                          setError("Days must be a number between 1 and 7.");
                          return;
                        }
                        setSaving(true);
                        try {
                          const { error: upErr } = await supabase
                            .from("workout_plans")
                            .update({
                              goal: goal || null,
                              difficulty: difficulty || null,
                              days: parsedDays,
                            })
                            .eq("plan_id", plan.plan_id);
                          if (upErr) throw upErr;
                          await load();
                        } catch (e) {
                          setError(e?.message || "Failed to save.");
                        } finally {
                          setSaving(false);
                        }
                      }}
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[20px] border border-[hsl(var(--brand-soft))] bg-[hsl(var(--figma-surface))] p-8">
              <div className="text-[28px] font-semibold text-primary">Plan details</div>

              {grouped.length ? (
                <div className="mt-6 space-y-6">
                  {grouped.map(([dayNumber, items]) => (
                    <div key={dayNumber} className="rounded-[16px] border border-white/10 bg-black/30 p-5">
                      <div className="text-[18px] font-bold text-[hsl(var(--figma-text))]">
                        Day {dayNumber || "—"}
                      </div>
                      <div className="mt-3 space-y-2">
                        {items.map((it) => (
                          <div key={it.detail_id} className="flex flex-wrap items-center justify-between gap-3 text-[14px] text-white/85">
                            <div className="font-semibold">{it.exercise_name || "Exercise"}</div>
                            <div className="text-white/70">{it.reps || ""}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-[16px] font-semibold text-[hsl(var(--figma-text))]/80">
                  No exercises saved for this plan yet.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

