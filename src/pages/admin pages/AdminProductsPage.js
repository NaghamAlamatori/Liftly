import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Button } from "../../components/ui/button";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { supabase } from "../../lib/supabaseClient";
import { Tag } from "lucide-react";
import FixedPagination from "../../components/ui/fixed-pagination";

function pickPk(row) {
  if (!row || typeof row !== "object") return null;
  if ("product_id" in row) return "product_id";
  if ("id" in row) return "id";
  if ("uuid" in row) return "uuid";
  if ("sku" in row) return "sku";
  return null;
}

function getString(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function formatPrice(v) {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  if (!Number.isFinite(n)) return getString(v);
  // Figma shows "180$"
  return `${n}$`;
}

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [pkCol, setPkCol] = React.useState(null);

  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  // Filters (UI-only for now, wired for basic search)
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);

  const load = React.useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from("products").select("*").limit(100);
      if (err) throw err;
      const next = data ?? [];
      setRows(next);
      setPkCol(pickPk(next?.[0] ?? null));
    } catch (e) {
      setError(
        e?.message ||
          "Failed to load products. Ensure you have a `products` table and Supabase RLS allows admins to read it."
      );
      setRows([]);
      setPkCol(null);
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
    return (rows || []).filter((r) => {
      const name = getString(r?.name || r?.title || r?.product_name).toLowerCase();
      const desc = getString(r?.description || r?.details).toLowerCase();
      return name.includes(q) || desc.includes(q);
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
    if (!deleteTarget || !pkCol) return;
    const id = deleteTarget?.[pkCol];
    if (id === null || id === undefined) return;
    setDeleting(true);
    setError("");
    try {
      const { error: err } = await supabase.from("products").delete().eq(pkCol, id);
      if (err) throw err;
      await load();
    } catch (e) {
      setError(e?.message || "Failed to delete product.");
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
        description="Are you sure you want to delete this product"
        confirmText="Yes, Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDeleteConfirmed}
      />

      {/* Title row */}
      <div className="absolute left-[297px] top-[21px] right-[40px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={29} className="h-[29px] w-[29px] text-primary opacity-80" />
          <p className="text-[32px] font-normal leading-normal text-primary">Products</p>
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
          onClick={() => {
            setSearch("");
          }}
        >
          Clear All
        </Button>

        {/* Minimal wired search (matches spirit of Figma filters) */}
        <div className="absolute left-[31px] top-[82px] w-[216px]">
          <div className="text-[12px] font-light tracking-[-0.36px] text-[hsl(var(--brand-soft))]">Search</div>
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
        <Button
          type="button"
          onClick={() => {
            navigate(`/dashboard/products/new${pkCol ? `?pk=${encodeURIComponent(pkCol)}` : ""}`);
          }}
        >
          Add a new product
        </Button>
      </div>

      {/* Grid */}
      <div className="absolute left-[297px] right-[40px] top-[387px]">
        {error ? <div className="mb-4 text-sm font-semibold text-[hsl(var(--brand-2))]">{error}</div> : null}
        {loading ? (
          <div className="text-sm text-white/70">Loading…</div>
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-x-[32px] gap-y-[40px] pb-24">
              {(paged || []).map((p) => {
              const id = pkCol ? p?.[pkCol] : null;
              const title = getString(p?.name || p?.title || p?.product_name || "Product");
              const price = formatPrice(p?.price);
              const meta = [p?.category, p?.color, p?.size].filter(Boolean).join(" / ") || getString(p?.meta || "");
              const img = getString(p?.image_1 || p?.image || p?.image_url || p?.thumbnail || "");
              return (
                <div key={String(id ?? title)} className="w-[317.76px]">
                  <div className="relative h-[267px] w-full overflow-hidden rounded-[16px] bg-[hsl(var(--figma-surface))]">
                    {img ? (
                      <img alt="" src={img} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-white/5" />
                    )}


                  </div>

                  <button
                    type="button"
                    className="mt-4 block text-left"
                    onClick={() => {
                      if (!pkCol || id == null) return;
                      navigate(`/dashboard/products/${encodeURIComponent(String(id))}?pk=${encodeURIComponent(pkCol)}`);
                    }}
                  >
                    <div className="text-[16px] font-semibold text-white">{title}</div>
                    <div className="mt-1 text-[12px] text-white/60">{meta}</div>
                    <div className="mt-6 text-[20px] font-semibold text-white">{price}</div>
                  </button>

                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto px-4 py-2 text-xs"
                      disabled={!pkCol || id == null}
                      onClick={() => {
                        if (!pkCol || id == null) return;
                        navigate(`/dashboard/products/${encodeURIComponent(String(id))}?pk=${encodeURIComponent(pkCol)}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto border-[hsl(var(--brand-2))] px-4 py-2 text-xs text-[hsl(var(--brand-2))]"
                      disabled={!pkCol || id == null}
                      onClick={() => setDeleteTarget(p)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
            </div>

            {/* Pagination removed from flow - fixed pagination will be rendered at the bottom */}
          </div>
        )}
      </div>

      {/* Fixed pagination (shared component) */}
      <FixedPagination
        admin
        page={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

