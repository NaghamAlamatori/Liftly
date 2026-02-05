import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import SiteNav from "../components/SiteNav";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthContext";
import { mcpAsset , siteImage } from "../lib/publicAssets";

const imgFrame7 = siteImage("plan.png");
const imgFooterLogo = mcpAsset("5cf826ca-0143-4e72-aad7-d1d495b1e525");

// Exercise data organized by body part/type
const EXERCISES_BY_TYPE = {
  "Chest": [
    "Bench Press",
    "Incline Bench Press",
    "Decline Bench Press",
    "Dumbbell Chest Press",
    "Incline Dumbbell Press",
    "Chest Fly (Dumbbell)",
    "Chest Fly (Machine)",
    "Cable Chest Fly",
    "Push-Ups",
    "Wide Push-Ups",
    "Chest Dips",
    "Smith Machine Bench Press",
    "Pec Deck",
    "Floor Press",
    "Resistance Band Chest Press"
  ],
  "Back": [
    "Pull-Ups",
    "Chin-Ups",
    "Lat Pulldown",
    "Deadlift",
    "Romanian Deadlift",
    "Barbell Row",
    "Dumbbell Row",
    "Seated Cable Row",
    "T-Bar Row",
    "Face Pulls",
    "Straight Arm Pulldown",
    "Inverted Rows",
    "Rack Pulls",
    "Resistance Band Rows",
    "Back Extensions"
  ],
  "Legs": [
    "Back Squats",
    "Front Squats",
    "Goblet Squats",
    "Leg Press",
    "Walking Lunges",
    "Reverse Lunges",
    "Bulgarian Split Squats",
    "Romanian Deadlift",
    "Leg Curl",
    "Leg Extension",
    "Calf Raises",
    "Seated Calf Raises",
    "Hip Thrusts",
    "Glute Bridges",
    "Step-Ups"
  ],
  "Cardio": [
    "Running",
    "Jogging",
    "Sprinting",
    "Cycling",
    "Jump Rope",
    "Rowing Machine",
    "Stair Climber",
    "Elliptical",
    "Burpees",
    "Mountain Climbers",
    "High Knees",
    "Jump Squats",
    "Shadow Boxing",
    "Swimming",
    "Battle Ropes"
  ],
  "Core": [
    "Plank",
    "Side Plank",
    "Sit-Ups",
    "Crunches",
    "Bicycle Crunch",
    "Russian Twists",
    "Leg Raises",
    "Hanging Leg Raises",
    "Mountain Climbers",
    "Flutter Kicks",
    "V-Ups",
    "Toe Touches",
    "Cable Crunch",
    "Ab Wheel Rollout",
    "Dead Bug"
  ],
  "Triceps": [
    "Tricep Dips",
    "Bench Dips",
    "Tricep Pushdown",
    "Overhead Tricep Extension",
    "Skull Crushers",
    "Close-Grip Bench Press",
    "Dumbbell Kickbacks",
    "Cable Kickbacks",
    "Resistance Band Pushdowns",
    "Diamond Push-Ups",
    "JM Press",
    "Smith Machine Close-Grip Press",
    "Single Arm Cable Extension",
    "EZ Bar Skull Crushers",
    "Bodyweight Tricep Extensions"
  ],
  "Mobility": [
    "Arm Circles",
    "Hip Circles",
    "Neck Rolls",
    "Cat-Cow Stretch",
    "World's Greatest Stretch",
    "Hip Flexor Stretch",
    "Hamstring Stretch",
    "Ankle Mobility Drills",
    "Thoracic Spine Rotations",
    "Shoulder Dislocations",
    "Deep Squat Hold",
    "Spinal Twists",
    "Wrist Mobility Drills",
    "Cossack Squats",
    "Dynamic Lunges"
  ],
  "Full body": [
    "Burpees",
    "Deadlift",
    "Clean and Press",
    "Thrusters",
    "Kettlebell Swings",
    "Turkish Get-Up",
    "Bear Crawls",
    "Man Makers",
    "Wall Balls",
    "Farmer's Walk",
    "Snatch",
    "Push Press",
    "Medicine Ball Slams",
    "Jump Squats",
    "Battle Rope Slams"
  ]
};

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

function FieldLabel({ children }) {
  return (
    <div className="text-[18px] font-light leading-[1.2] tracking-[-0.36px] text-[hsl(var(--brand-soft))]">
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options }) {
  return (
    <div className="relative flex items-center justify-between rounded-[20px] border border-primary bg-[hsl(var(--figma-surface))] px-6 py-4 shadow-[0px_0px_0px_1px_hsl(var(--brand-2))]">
      <div className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0px_-6px_20px_0px_rgba(254,238,174,0.1)]" />
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="relative w-full appearance-none bg-transparent pr-10 text-[18px] font-medium leading-[1.1] tracking-[-0.36px] text-[hsl(var(--brand-soft))] focus:outline-none"
      >
        {(options || []).map((opt) => (
          <option key={opt} value={opt} className="text-black">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-6 h-[18px] w-[18px] text-[hsl(var(--brand-soft))]" />
    </div>
  );
}

function StepperField({ value, onChange, min = 0, max = 999, step = 1 }) {
  return (
    <div className="relative flex items-center justify-between rounded-[20px] border border-primary bg-[hsl(var(--figma-surface))] px-6 py-4 shadow-[0px_0px_0px_1px_hsl(var(--brand-2))]">
      <div className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0px_-6px_20px_0px_rgba(254,238,174,0.1)]" />
      <button
        type="button"
        className="relative rounded-md p-1 text-[hsl(var(--brand-soft))] hover:bg-white/5"
        onClick={() => {
          const next = Math.max(min, Number(value || 0) - step);
          onChange?.(String(next));
        }}
        aria-label="Decrease"
      >
        <ChevronLeft className="h-[18px] w-[18px]" />
      </button>
      <input
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          const n = Number.parseInt(raw || "0", 10);
          if (!Number.isFinite(n)) return onChange?.("0");
          const clamped = Math.min(Math.max(n, min), max);
          onChange?.(String(clamped));
        }}
        className="relative w-[96px] bg-transparent text-center text-[16px] font-medium leading-[1.1] tracking-[-0.32px] text-[hsl(var(--brand-soft))] focus:outline-none"
        inputMode="numeric"
      />
      <button
        type="button"
        className="relative rounded-md p-1 text-[hsl(var(--brand-soft))] hover:bg-white/5"
        onClick={() => {
          const next = Math.min(max, Number(value || 0) + step);
          onChange?.(String(next));
        }}
        aria-label="Increase"
      >
        <ChevronRight className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}

function NotesField({ value, onChange }) {
  return (
    <div className="relative rounded-[20px] border border-primary bg-[hsl(var(--figma-surface))] px-6 py-6 shadow-[0px_0px_0px_1px_hsl(var(--brand-2))]">
      <div className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0px_-6px_20px_0px_rgba(254,238,174,0.1)]" />
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="relative min-h-[100px] w-full resize-none bg-transparent text-[14px] leading-[1.45] text-[hsl(var(--brand-soft))] focus:outline-none"
        placeholder="Notes..."
      />
    </div>
  );
}

function ExerciseRow({ ex, onEdit, onDelete }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[hsl(var(--brand-soft))] bg-black/20 px-5 py-4">
      <div className="min-w-0">
        <div className="truncate text-[14px] font-semibold text-white">{ex.exercise || "Untitled exercise"}</div>
        <div className="mt-1 text-xs text-white/70">
          {[
            ex.type ? `Type: ${ex.type}` : null,
            ex.rounds ? `Rounds: ${ex.rounds}` : null,
            ex.iterations ? `Iterations: ${ex.iterations}` : null,
            ex.rest ? `Rest: ${ex.rest}` : null,
          ]
            .filter(Boolean)
            .join(" • ")}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" className="h-auto px-4 py-2 text-xs" onClick={onEdit}>
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-auto border-[hsl(var(--brand-2))] px-4 py-2 text-xs text-[hsl(var(--brand-2))]"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

function DayCard({ title, dayNumber, state, setState, onExerciseAdded }) {
  const left = state?.draftLeft;
  const right = state?.draftRight;
  const exercises = state?.exercises || [];
  const editingId = state?.editingId || null;

  return (
    <div className="w-[1150px] max-w-full overflow-hidden rounded-[20px] border border-[hsl(var(--brand-soft))] bg-[hsl(var(--figma-surface))] px-5 py-8 shadow-[0px_41px_11px_0px_rgba(0,0,0,0),0px_26px_10px_0px_rgba(0,0,0,0.01),0px_15px_9px_0px_rgba(0,0,0,0.03),0px_7px_7px_0px_rgba(0,0,0,0.04),0px_2px_4px_0px_rgba(0,0,0,0.05)]">
      <div className="text-center text-[32px] font-semibold leading-[1.1] tracking-[-0.96px] text-primary">
        {title}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-20 gap-y-9 px-5">
        <div className="space-y-[13px]">
          <FieldLabel>Name of The Day</FieldLabel>
          <SelectField
            value={left.day}
            onChange={(v) => setState((s) => ({ ...s, draftLeft: { ...s.draftLeft, day: v } }))}
            options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
          />
        </div>
        <div className="space-y-[13px]">
          <FieldLabel>Type of Exercise</FieldLabel>
          <SelectField
            value={right.type}
            onChange={(v) => setState((s) => ({ ...s, draftRight: { ...s.draftRight, type: v } }))}
            options={["Chest", "Back", "Legs", "Cardio", "Core", "Triceps", "Mobility", "Full body"]}
          />
        </div>

        <div className="space-y-[13px]">
          <FieldLabel>Name of The Exercise</FieldLabel>
          <SelectField
            value={left.exercise}
            onChange={(v) => setState((s) => ({ ...s, draftLeft: { ...s.draftLeft, exercise: v } }))}
            options={right.type ? EXERCISES_BY_TYPE[right.type] || [] : []}
          />
          {!right.type && <div className="text-xs text-white/50">Select exercise type first</div>}
        </div>
        <div className="space-y-[13px]">
          <FieldLabel>Number of Rounds</FieldLabel>
          <StepperField
            value={right.rounds}
            onChange={(v) => setState((s) => ({ ...s, draftRight: { ...s.draftRight, rounds: v } }))}
            min={1}
            max={20}
            step={1}
          />
        </div>

        <div className="space-y-[13px]">
          <FieldLabel>Number of Iterations</FieldLabel>
          <StepperField
            value={left.iterations}
            onChange={(v) => setState((s) => ({ ...s, draftLeft: { ...s.draftLeft, iterations: v } }))}
            min={1}
            max={200}
            step={1}
          />
        </div>
        <div className="space-y-[13px]">
          <FieldLabel>Rest Period Between Rounds</FieldLabel>
          <div className="relative flex items-center justify-between rounded-[20px] border border-primary bg-[hsl(var(--figma-surface))] px-6 py-4 shadow-[0px_0px_0px_1px_hsl(var(--brand-2))]">
            <div className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0px_-6px_20px_0px_rgba(254,238,174,0.1)]" />
            <input
              value={right.rest}
              onChange={(e) => setState((s) => ({ ...s, draftRight: { ...s.draftRight, rest: e.target.value } }))}
              className="relative w-full bg-transparent text-[16px] font-medium leading-[1.1] tracking-[-0.32px] text-[hsl(var(--brand-soft))] focus:outline-none"
              placeholder="e.g. 90s"
            />
          </div>
        </div>

        <div className="col-span-2 space-y-[13px]">
          <FieldLabel>Notes For Every Day</FieldLabel>
          <NotesField
            value={state?.notes || ""}
            onChange={(v) => setState((s) => ({ ...s, notes: v }))}
          />
        </div>
      </div>

      <div className="mt-10 px-5">
        {exercises.length ? (
          <div className="space-y-3">
            <div className="text-[14px] font-semibold text-primary">Exercises for Day {dayNumber}</div>
            {exercises.map((ex) => (
              <ExerciseRow
                key={ex.id}
                ex={ex}
                onEdit={() => {
                  setState((s) => ({
                    ...s,
                    editingId: ex.id,
                    draftLeft: { ...s.draftLeft, exercise: ex.exercise, iterations: ex.iterations },
                    draftRight: { ...s.draftRight, type: ex.type, rounds: ex.rounds, rest: ex.rest },
                  }));
                }}
                onDelete={() => {
                  setState((s) => ({ ...s, exercises: (s.exercises || []).filter((x) => x.id !== ex.id) }));
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-white/70">
            No exercises added yet. Add exercises one-by-one using the button below.
          </div>
        )}
      </div>

      <div className="mt-9 flex justify-center">
        <Button
          type="button"
          className="h-[41px] w-[167px] px-8 py-[10px] text-[14px] font-bold text-[hsl(var(--brand-ink))]"
          onClick={() => {
            const exercise = String(left.exercise || "").trim();
            if (!exercise) return;
            const id =
              typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

            setState((s) => {
              const next = { ...s };
              const ex = {
                id,
                day: next.draftLeft.day,
                type: next.draftRight.type,
                exercise,
                rounds: String(next.draftRight.rounds || "1"),
                iterations: String(next.draftLeft.iterations || "1"),
                rest: String(next.draftRight.rest || ""),
              };

              if (editingId) {
                next.exercises = (next.exercises || []).map((x) => (x.id === editingId ? { ...ex, id: editingId } : x));
                next.editingId = null;
              } else {
                next.exercises = [...(next.exercises || []), ex];
              }

              // reset the per-exercise inputs but keep day + type as-is
              next.draftLeft = { ...next.draftLeft, exercise: "", iterations: next.draftLeft.iterations };
              next.draftRight = { ...next.draftRight, rounds: next.draftRight.rounds, rest: next.draftRight.rest };
              return next;
            });

            onExerciseAdded?.();
          }}
        >
          {editingId ? "Update" : "Add Exercise"}
        </Button>
      </div>
    </div>
  );
}

function SuccessModal({ onClose }) {
  return (
    <div
      className="fixed left-1/2 top-1/2 z-50 w-[620px] max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[hsl(var(--figma-text))] px-[54px] py-[53px]"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-[21px] top-[22px] text-black/70"
      >
        <X className="h-[17px] w-[17px]" />
      </button>

      <div className="text-center">
        <div className="text-[24px] font-bold leading-[1.3] text-[hsl(var(--brand-2))]">
          The plan was added successfully
        </div>
        <div className="mt-4 text-[18px] font-bold leading-[50px] text-black">
          You can view your plan on the user profile
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button
          asChild
          variant="outline"
          className="h-[41px] px-8 py-[10px] font-bold"
        >
          <Link to="/plan">Back to plan</Link>
        </Button>

        <Button asChild className="h-[41px] px-8 py-[10px] font-bold text-[hsl(var(--brand-ink))]">
          <Link to="/plan/list">Saved plans</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PlanBuilderPage({ showSuccess = false } = {}) {
  const [open, setOpen] = React.useState(showSuccess);
  const [searchParams] = useSearchParams();
  const [error, setError] = React.useState("");
  const [toastOpen, setToastOpen] = React.useState(false);
  const toastTimerRef = React.useRef(null);
  const [savingPlan, setSavingPlan] = React.useState(false);
  const { user } = useAuth();

  const showExerciseToast = React.useCallback(() => {
    setToastOpen(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastOpen(false), 1500);
  }, []);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const daysCount = React.useMemo(() => {
    const raw = searchParams.get("days");
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;
    if (!Number.isFinite(parsed)) return 2;
    return Math.min(Math.max(parsed, 1), 7);
  }, [searchParams]);

  const [days, setDays] = React.useState([]);

  React.useEffect(() => {
    const names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    setDays((prev) => {
      const next = Array.from({ length: daysCount }, (_, i) => {
        const existing = prev[i];
        if (existing) return existing;
        return {
          draftLeft: { day: names[i % names.length], exercise: "", iterations: "10" },
          draftRight: { type: "Full body", rounds: "3", rest: "90s" },
          notes: "",
          exercises: [],
          editingId: null,
        };
      });
      return next;
    });
  }, [daysCount]);

  const totalExercises = React.useMemo(
    () => days.reduce((sum, d) => sum + (d?.exercises?.length || 0), 0),
    [days]
  );

  async function savePlanToSupabase() {
    if (!user?.id) {
      setError("You must be logged in to save a plan.");
      return false;
    }

    setSavingPlan(true);
    setError("");
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
        throw new Error("No user profile found. (public.users row missing or blocked by RLS)");
      }

      // Create plan row
      const planPayload = {
        user_id: appUser.user_id,
        name: "My Plan",
        goal: "Custom",
        difficulty: "Medium",
        days: daysCount,
      };

      const { data: planRow, error: pErr } = await supabase
        .from("workout_plans")
        .insert(planPayload)
        .select("plan_id")
        .maybeSingle();

      if (pErr) throw pErr;
      const planId = planRow?.plan_id;
      if (!planId) throw new Error("Failed to create plan (missing plan_id).");

      // Create workout_details rows (one row per exercise)
      const detailRows = [];
      for (let i = 0; i < days.length; i++) {
        const dayNum = i + 1;
        const exs = days[i]?.exercises || [];
        for (const ex of exs) {
          const rounds = String(ex?.rounds ?? "").trim();
          const iters = String(ex?.iterations ?? "").trim();
          const rest = String(ex?.rest ?? "").trim();
          const type = String(ex?.type ?? "").trim();

          const parts = [
            rounds ? `${rounds} rounds` : null,
            iters ? `${iters} reps` : null,
            rest ? `rest ${rest}` : null,
            type ? type : null,
          ].filter(Boolean);

          detailRows.push({
            plan_id: planId,
            day_number: dayNum,
            exercise_name: ex?.exercise ?? "Exercise",
            reps: parts.join(" • "),
          });
        }
      }

      if (detailRows.length) {
        const { error: dErr } = await supabase.from("workout_details").insert(detailRows);
        if (dErr) throw dErr;
      }

      return true;
    } catch (e) {
      setError(e?.message || "Failed to save plan.");
      return false;
    } finally {
      setSavingPlan(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full px-[309px] py-16">
        <div className="relative w-full overflow-hidden rounded-[20px] bg-background">
          <div className="absolute inset-0 rounded-[20px] bg-black" />
          <div
            className="absolute inset-0 rounded-[20px] opacity-50"
            style={{
              backgroundImage: `url(${imgFrame7})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-black/0 to-[hsl(var(--background))] [background-position:0_77.295%]" />

          <div className={cn("relative", open && "opacity-40")}>
            <div className="mx-auto flex w-[1240px] max-w-full flex-col items-center gap-[200px]">
              <SiteNav active="plan" />

              <div className="w-full pb-24">
                <div className="flex flex-col items-center gap-[73px]">
                  {days.map((state, idx) => (
                    <DayCard
                      key={`day-${idx + 1}`}
                      title={`Day ${idx + 1}`}
                      dayNumber={idx + 1}
                      state={state}
                      onExerciseAdded={showExerciseToast}
                      setState={(updater) =>
                        setDays((prev) => {
                          const copy = [...prev];
                          const current = copy[idx];
                          copy[idx] = typeof updater === "function" ? updater(current) : updater;
                          return copy;
                        })
                      }
                    />
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <Button
                    asChild
                    variant="outline"
                    className="h-[41px] w-[101px] border-[hsl(var(--brand-2))] px-8 py-[10px] text-[hsl(var(--brand-2))]"
                  >
                    <Link to="/plan" aria-label="Back">
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    className="h-[41px] w-[101px] px-8 py-[10px] text-[16px] font-bold text-[hsl(var(--brand-ink))]"
                    disabled={savingPlan}
                    onClick={async () => {
                      if (!totalExercises) {
                        setError("Add at least one exercise before saving the plan.");
                        return;
                      }
                      const ok = await savePlanToSupabase();
                      if (ok) setOpen(true);
                    }}
                  >
                    {savingPlan ? "Saving..." : "Save"}
                  </Button>
                </div>

                {error ? (
                  <div className="mt-6 text-center text-sm font-semibold text-[hsl(var(--brand-2))]">{error}</div>
                ) : null}
              </div>
            </div>
          </div>

          {toastOpen ? (
            <div
              role="status"
              aria-live="polite"
              className="fixed bottom-6 left-1/2 z-[60] w-[360px] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-[16px] border border-[hsl(var(--brand-2))] bg-[hsl(var(--figma-text))] px-5 py-3 text-center text-sm font-semibold text-[hsl(var(--brand-ink))] shadow-[0px_16px_40px_rgba(0,0,0,0.35)]"
            >
              Exercise added successfully
            </div>
          ) : null}

          {open && (
            <>
              <div className="fixed inset-0 z-40" />
              <SuccessModal onClose={() => setOpen(false)} />
            </>
          )}
        </div>
      </div>

      <div className={cn(open && "opacity-40")}>
        <SiteFooter active="plan" />
      </div>
    </div>
  );
}


