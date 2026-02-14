import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Button } from "../../components/ui/button";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { supabase } from "../../lib/supabaseClient";
import { siteImage } from "../../lib/publicAssets";
import FixedPagination from "../../components/ui/fixed-pagination";
import { FileText } from "lucide-react";

const imgDefault = siteImage("Articles.png");

function normalizeArticle(row) {
  return {
    article_id: row?.article_id ?? null,
    title: row?.title ?? "",
    image: row?.image ?? "",
    content: row?.content ?? "",
    created_at: row?.created_at ?? null,
  };
}

export default function AdminArticlesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");

  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("articles")
        .select("article_id,title,content,image,created_at")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setRows((data ?? []).map(normalizeArticle));
    } catch (e) {
      setError(
        e?.message ||
          "Failed to load articles. Ensure your Supabase RLS allows admins to read/write the articles table."
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = React.useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    if (!q) return rows;
    return (rows || []).filter((a) => {
      const title = String(a?.title || "").toLowerCase();
      const body = String(a?.content || "").toLowerCase();
      return title.includes(q) || body.includes(q);
    });
  }, [rows, search]);

  const totalPages = React.useMemo(() => {
    return Math.max(1, Math.ceil((filtered || []).length / Math.max(1, pageSize)));
  }, [filtered, pageSize]);

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const paged = React.useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return (filtered || []).slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);



  async function onDeleteConfirmed() {
    const id = deleteTarget?.article_id;
    if (!id) return;
    setDeleting(true);
    setError("");
    try {
      const { error: err } = await supabase.from("articles").delete().eq("article_id", id);
      if (err) throw err;
      await load();
    } catch (e) {
      setError(e?.message || "Failed to delete article.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="relative min-h-[1024px] w-full bg-background">
      <AdminSidebar />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Confirm Delete"
        description="Are you sure you want to delete this article"
        confirmText="Yes, Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDeleteConfirmed}
      /> 

      {/* Title row */}
      <div className="absolute left-[297px] top-[21px] right-[40px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={29} className="h-[29px] w-[29px] text-primary opacity-80" />
          <p className="text-[32px] font-normal leading-normal text-primary">Articles</p>
        </div>
        <Button variant="outline" className="h-auto px-6 py-2" type="button">
          Hide Filters
        </Button>
      </div>

      {/* Filters panel */}
      <div className="absolute left-[297px] top-[85px] h-[164px] w-[993px] rounded-[19.456px] bg-card shadow-[0px_2px_20px_0px_rgba(254,238,174,0.2)]">
        <p className="absolute left-[31px] top-[22px] text-[24px] text-[hsl(var(--brand-soft))]">Filters</p>
        <Button
          variant="outline"
          className="absolute right-[22px] top-[27px] h-auto px-6 py-2 text-[14px]"
          type="button"
          onClick={() => setSearch("")}
        >
          Clear All
        </Button>

        <div className="absolute left-[31px] top-[82px] w-[216px]">
          <div className="text-[12px] font-light tracking-[-0.36px] text-[hsl(var(--brand-soft))]">Search Article</div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or description..."
            className="mt-1 h-[36px] w-full rounded-[9.8px] border border-[hsl(var(--brand))] bg-transparent px-3 text-[12px] text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Add button */}
      <div className="absolute right-[70px] top-[322px]">
        <Button type="button" onClick={() => navigate("/dashboard/articles/new")}>
          Add a new article
        </Button>
      </div>

      {/* Grid */}
      <div className="absolute left-[297px] right-[40px] top-[387px]">
        {error ? <div className="mb-4 text-sm font-semibold text-[hsl(var(--brand-2))]">{error}</div> : null}
        {loading ? (
          <div className="text-sm text-white/70">Loading…</div>
        ) : (
          <div className="grid grid-cols-3 gap-x-[32px] gap-y-[40px]">
            {(paged || []).map((a) => {
              const id = a.article_id;
              const img = String(a.image || "");
              const desc = String(a.content || "").slice(0, 90);
              return (
                <div key={String(id)} className="w-[317.76px]">
                  <div className="relative h-[324px] w-full overflow-hidden rounded-[16px] bg-[hsl(var(--figma-surface))] shadow-[0px_32px_8px_0px_rgba(0,0,0,0),0px_20px_8px_0px_rgba(0,0,0,0.01),0px_12px_7px_0px_rgba(0,0,0,0.03),0px_6px_6px_0px_rgba(0,0,0,0.04),0px_2px_3px_0px_rgba(0,0,0,0.05)]">
                    <div className="h-[204px] w-full">
                      <img
                        alt=""
                        src={img || imgDefault}
                        onError={(e) => {
                          e.currentTarget.src = imgDefault;
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5 text-white">
                      <div className="text-[19px] font-semibold tracking-[-0.57px]">{a.title || "Untitled"}</div>
                      <div className="mt-3 text-[15px] text-white/80">{desc}{desc ? "…" : ""}</div>
                    </div>

                    <div className="absolute left-[14px] top-[14px]">
                      <button type="button" className="text-white/80" aria-label="More">
                        ⋮
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto px-4 py-2 text-xs"
                      onClick={() => navigate(`/dashboard/articles/${encodeURIComponent(String(id))}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto border-[hsl(var(--brand-2))] px-4 py-2 text-xs text-[hsl(var(--brand-2))]"
                      onClick={() => setDeleteTarget(a)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed pagination (shared component) */}
      <FixedPagination admin page={safePage} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}

