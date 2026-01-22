import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { supabase } from "../../lib/supabaseClient";

export default function AdminArticleInfoPage() {
  const navigate = useNavigate();
  const params = useParams();
  const articleId = params.articleId;
  const isNew = !articleId || articleId === "new";

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({ title: "", image: "", content: "" });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setError("");
      if (isNew) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from("articles")
          .select("article_id,title,content,image,created_at")
          .eq("article_id", articleId)
          .maybeSingle();
        if (err) throw err;
        if (!mounted) return;
        setForm({
          title: String(data?.title || ""),
          image: String(data?.image || ""),
          content: String(data?.content || ""),
        });
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load article.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [articleId, isNew]);

  async function onSave() {
    setError("");
    setSaving(true);
    try {
      const payload = {
        title: String(form.title || "").trim(),
        image: String(form.image || "").trim() || null,
        content: String(form.content || "").trim(),
      };
      if (!payload.title) {
        setError("Title is required.");
        return;
      }
      if (!payload.content) {
        setError("Content is required.");
        return;
      }

      if (isNew) {
        const { error: err } = await supabase.from("articles").insert(payload);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("articles").update(payload).eq("article_id", articleId);
        if (err) throw err;
      }
      navigate("/dashboard/articles", { replace: true });
    } catch (e) {
      setError(e?.message || "Failed to save article.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-background">
      <AdminSidebar />

      <div className="absolute left-[297px] top-[21px] right-[40px] flex items-center justify-between">
        <Button asChild variant="outline" className="h-auto px-6 py-2">
          <Link to="/dashboard/articles">Back</Link>
        </Button>
        <p className="text-[32px] font-normal leading-normal text-primary">{isNew ? "New article" : "Edit article"}</p>
        <div />
      </div>

      <div className="absolute left-[297px] top-[102px] right-[40px]">
        {loading ? <div className="text-sm text-white/70">Loading…</div> : null}
        {error ? <div className="mb-4 text-sm font-semibold text-[hsl(var(--brand-2))]">{error}</div> : null}

        <div className="max-w-[700px] rounded-[20px] border border-[hsl(var(--brand-soft))] bg-card p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-[hsl(var(--brand-soft))]">Title</div>
              <Input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-[hsl(var(--brand-soft))]">Image URL</div>
              <Input value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-[hsl(var(--brand-soft))]">Content</div>
              <textarea
                className="min-h-[220px] w-full rounded-[14px] border border-[hsl(var(--brand))] bg-transparent px-4 py-3 text-[13px] text-foreground shadow-[0px_0px_0px_1px_hsl(var(--brand-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.content}
                onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
              />
            </div>

            <div className="flex justify-end">
              <Button type="button" disabled={saving} onClick={onSave}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

