// Dummy articles used as a fallback when Supabase data isn't available.
// Keep IDs stable because the UI routes to `/articles/:id`.

import { mcpAsset } from "./publicAssets";

const imgArticle = mcpAsset("10b712c0-bf8f-4149-bb5a-f7f62a25b20b");
const imgFeatured = mcpAsset("10510689-80cf-4b9d-bb93-18aeafc4c8f2");

export const DUMMY_ARTICLES = [
  {
    article_id: 1,
    title: "Build a Better Strength Routine",
    image: imgArticle,
    content:
      "A good strength routine is simple: pick a few big lifts, progress them steadily, and recover well.\n\n" +
      "Start with compound movements (squat, hinge, push, pull). Train each pattern 2–3x per week, keep 1–2 reps in reserve on most sets, and add weight or reps gradually.\n\n" +
      "Track your sets and reps. If progress stalls, reduce volume for a week (deload) and come back stronger.",
  },
  {
    article_id: 2,
    title: "Athletic Nutrition",
    image: imgFeatured,
    content:
      "Athletic nutrition is consistency, not perfection.\n\n" +
      "Build every meal around: protein + carbs + colorful plants + healthy fats. Aim for enough protein daily, hydrate, and prioritize whole foods.\n\n" +
      "Before training: carbs + a bit of protein. After: protein + carbs. The goal is performance and recovery, not restriction.",
  },
  {
    article_id: 3,
    title: "Fueling for All‑Day Energy",
    image: imgArticle,
    content:
      "Energy crashes usually come from big sugar spikes, low sleep, and not enough protein.\n\n" +
      "Try: a protein-forward breakfast, balanced lunches, and snacks that include fiber (fruit + nuts, yogurt, or a sandwich).\n\n" +
      "Keep hydration steady and add a short walk after meals to stabilize energy.",
  },
  {
    article_id: 4,
    title: "Recover Like an Athlete",
    image: imgArticle,
    content:
      "Recovery is where progress happens.\n\n" +
      "Sleep 7–9 hours, keep protein consistent, and add light movement on rest days (walks, mobility, easy cycling).\n\n" +
      "If soreness is high, reduce intensity and focus on technique. Your best workouts come from being well-recovered.",
  },
  {
    article_id: 5,
    title: "Cardio Without Losing Strength",
    image: imgArticle,
    content:
      "You can improve endurance and keep strength by managing volume and intensity.\n\n" +
      "Do 2–3 cardio sessions per week: 1 easy long session + 1–2 shorter sessions. Keep hard intervals away from heavy leg days.\n\n" +
      "If strength drops, reduce cardio intensity first, not lifting quality.",
  },
  {
    article_id: 6,
    title: "Beginner Gym Plan: What to Do First",
    image: imgArticle,
    content:
      "New to the gym? Start with full-body training 2–3 times per week.\n\n" +
      "Pick: 1 squat/leg press, 1 hinge (RDL), 1 push (bench/pushups), 1 pull (row/lat pulldown), and 1 core move.\n\n" +
      "Keep it simple, learn form, and add small progress each week.",
  },
];

