import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Button } from "../../components/ui/button";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { supabase } from "../../lib/supabaseClient";
import { Users } from "lucide-react";

function normalizeUser(row) {
  const statusRaw =
    row?.status ??
    row?.active_status ??
    (typeof row?.is_active === "boolean" ? (row.is_active ? "active" : "inactive") : null);
  return {
    user_id: row?.user_id ?? null,
    auth_user_id: row?.auth_user_id ?? null,
    email: row?.email ?? "",
    full_name: row?.full_name ?? "",
    role: row?.role ?? "",
    created_at: row?.created_at ?? null,
    status: statusRaw ? String(statusRaw) : "inactive",
  };
}

export default function AdminUsersPage() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [searchParams] = useSearchParams();

  // Filters (based on the Figma UI)
  const [emailQ, setEmailQ] = React.useState("");
  const [firstNameQ, setFirstNameQ] = React.useState("");
  const [fullNameQ, setFullNameQ] = React.useState("");
  const [activeStatus, setActiveStatus] = React.useState("all");

  // Pagination (matches the Figma page-size dropdown)
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);

  const load = React.useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("users")
        // Use * so the UI can safely use extra columns if present (e.g. status/is_active) without schema errors.
        .select("*")
        .order("user_id", { ascending: false });
      if (err) throw err;
      setRows((data ?? []).map(normalizeUser));
    } catch (e) {
      setError(
        e?.message || "Failed to load users. Ensure your Supabase RLS allows admins to read/write public.users."
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  // Realtime: subscribe to changes on the `users` table so the admin UI updates immediately.
  React.useEffect(() => {
    // When any INSERT/UPDATE/DELETE occurs in `public.users`, reload the list.
    const channel = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // Fallback: try to unsubscribe the channel if removeChannel isn't available
        try {
          channel.unsubscribe();
        } catch (__) {}
      }
    };
  }, [load]);

  // Supports deep-linking from other pages: /dashboard/users?id=123
  React.useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    // Keep page at 1 so the user is visible.
    setPage(1);
    // Best-effort: seed email search with the selected user's email when possible.
    const found = rows.find((u) => String(u?.user_id) === String(id));
    if (found?.email) setEmailQ(String(found.email));
  }, [searchParams, rows]);

  async function onDeleteConfirmed() {
    const userId = deleteTarget?.user_id;
    if (!userId) return;
    setError("");
    setDeleting(true);
    try {
      const { error: err } = await supabase.from("users").delete().eq("user_id", userId);
      if (err) throw err;
      await load();
    } catch (e) {
      setError(e?.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const filtered = React.useMemo(() => {
    const qEmail = String(emailQ || "").trim().toLowerCase();
    const qFirst = String(firstNameQ || "").trim().toLowerCase();
    const qFull = String(fullNameQ || "").trim().toLowerCase();
    const status = String(activeStatus || "all").toLowerCase();

    return (rows || []).filter((u) => {
      const email = String(u?.email || "").toLowerCase();
      const full = String(u?.full_name || "").toLowerCase();
      const first = full.split(/\s+/).filter(Boolean)[0] || "";
      const st = String(u?.status || "").toLowerCase();

      if (qEmail && !email.includes(qEmail)) return false;
      if (qFull && !full.includes(qFull)) return false;
      if (qFirst && !first.includes(qFirst)) return false;
      if (status !== "all" && st !== status) return false;
      return true;
    });
  }, [rows, emailQ, firstNameQ, fullNameQ, activeStatus]);

  React.useEffect(() => {
    setPage(1);
  }, [emailQ, firstNameQ, fullNameQ, activeStatus, pageSize]);

  const totalPages = React.useMemo(() => {
    return Math.max(1, Math.ceil((filtered || []).length / Math.max(1, pageSize)));
  }, [filtered, pageSize]);

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const paged = React.useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return (filtered || []).slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  function formatJoined(createdAt) {
    if (!createdAt) return "—";
    try {
      const d = new Date(createdAt);
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleDateString();
    } catch {
      return "—";
    }
  }

  function PageBtn({ children, active, disabled, onClick }) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={[
          "relative h-8 w-8 rounded-[4px] border text-center text-sm font-bold",
          active ? "border-primary text-primary" : "border-[hsl(var(--brand-soft))] text-[hsl(var(--brand-soft))]",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {children}
      </button>
    );
  }

  const pageItems = React.useMemo(() => {
    // Figma shows: 1 2 ... 9 10 (example). We'll show a compact version.
    const t = totalPages;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, "…", t - 1, t];
    if (safePage >= t - 2) return [1, 2, "…", t - 2, t - 1, t];
    return [1, "…", safePage - 1, safePage, safePage + 1, "…", t];
  }, [totalPages, safePage]);

  return (
    <div className="relative min-h-[1024px] w-full bg-background" data-name="admin user" data-node-id="367:1609">
      <AdminSidebar />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Confirm Delete"
        description="Are you sure you want to delete this user"
        confirmText="Yes, Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDeleteConfirmed}
      />

      {/* Header row (title + right buttons) */}
      <div className="absolute left-[297px] top-[21px] right-[40px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={29} className="h-[29px] w-[29px] text-primary" />
          <p className="text-[32px] font-normal leading-normal text-primary">Users</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="h-auto px-6 py-2">
            <Link to="/dashboard/create-user">Create User</Link>
          </Button>
          <Button type="button" variant="outline" className="h-auto px-6 py-2" onClick={load}>
            Refresh
          </Button>
          <Button type="button" variant="outline" className="h-auto px-6 py-2">
            Hide Filters
          </Button>
        </div>
      </div>

      {/* Filters panel */}
      <div className="absolute left-[297px] top-[85px] h-[164px] w-[994px] rounded-[19.456px] bg-card shadow-[0px_2px_20px_0px_rgba(254,238,174,0.2)]">
        <p className="absolute left-[31px] top-[22px] text-[24px] text-[hsl(var(--brand-soft))]">Filters</p>

        <Button
          type="button"
          variant="outline"
          className="absolute right-[22px] top-[27px] h-auto px-6 py-2 text-[8px]"
          onClick={() => {
            setEmailQ("");
            setFirstNameQ("");
            setFullNameQ("");
            setActiveStatus("all");
          }}
        >
          Clear All
        </Button>

        {/* Email */}
        <div className="absolute left-[31px] top-[82px] w-[107px]">
          <div className="text-[12px] font-light tracking-[-0.36px] text-[hsl(var(--brand-soft))]">Email</div>
          <input
            value={emailQ}
            onChange={(e) => setEmailQ(e.target.value)}
            placeholder="Search user.."
            className="mt-1 h-[36px] w-full rounded-[9.8px] border border-[hsl(var(--brand))] bg-transparent px-3 text-[12px] text-white placeholder:text-white/40"
          />
        </div>

        {/* First name */}
        <div className="absolute left-[309px] top-[82px] w-[117px]">
          <div className="text-[12px] font-light tracking-[-0.36px] text-[hsl(var(--brand-soft))]">First Name</div>
          <input
            value={firstNameQ}
            onChange={(e) => setFirstNameQ(e.target.value)}
            placeholder="First name"
            className="mt-1 h-[36px] w-full rounded-[9.8px] border border-[hsl(var(--brand))] bg-transparent px-3 text-[12px] text-white placeholder:text-white/40"
          />
        </div>

        {/* Full name */}
        <div className="absolute left-[596px] top-[82px] w-[118px]">
          <div className="text-[12px] font-light tracking-[-0.36px] text-[hsl(var(--brand-soft))]">Full Name</div>
          <input
            value={fullNameQ}
            onChange={(e) => setFullNameQ(e.target.value)}
            placeholder="Full name"
            className="mt-1 h-[36px] w-full rounded-[9.8px] border border-[hsl(var(--brand))] bg-transparent px-3 text-[12px] text-white placeholder:text-white/40"
          />
        </div>

        {/* Active status */}
        <div className="absolute right-[31px] top-[82px] w-[81px]">
          <div className="text-[12px] font-light tracking-[-0.36px] text-[hsl(var(--brand-soft))]">Active Status</div>
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
            className="mt-1 h-[36px] w-full rounded-[9.8px] border border-[hsl(var(--brand))] bg-transparent px-2 text-[12px] text-white"
          >
            <option value="all" className="bg-[hsl(var(--figma-surface))] text-white">
              All
            </option>
            <option value="active" className="bg-[hsl(var(--figma-surface))] text-white">
              active
            </option>
            <option value="inactive" className="bg-[hsl(var(--figma-surface))] text-white">
              inactive
            </option>
          </select>
        </div>
      </div>

      {/* Grid of user cards */}
      <div className="absolute left-[297px] top-[322px] right-[40px]">
        {error ? <div className="mb-4 text-sm font-semibold text-[hsl(var(--brand-2))]">{error}</div> : null}
        {loading ? <div className="text-sm text-white/70">Loading…</div> : null}

        {!loading ? (
          <div className="grid grid-cols-3 gap-[32px]">
            {paged.map((u) => (
              <div
                key={String(u.user_id ?? u.email)}
                className="relative h-[186px] w-[310px] rounded-[31.745px] bg-card p-[24.474px] shadow-[0px_4px_15px_0px_rgba(254,238,174,0.3)]"
              >
                <p className="text-[24px] font-bold text-white">{u.full_name || "Unnamed"}</p>
                <div className="mt-6 text-[12px] leading-[1.05] text-white/90">
                  <p className="mb-0">{u.email || "—"}</p>
                  <p className="mb-0">Status: {u.status || "inactive"}</p>
                  <p>joined: {formatJoined(u.created_at)}</p>
                </div>

                <div className="absolute bottom-[18px] right-[18px] flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto w-[46px] px-[10px] py-[8px] text-[8px]"
                    onClick={() => {
                      // Keep behavior simple; deep-link for future editing.
                      // (We can add an edit modal later if you want it 1:1 with Figma.)
                      window.history.replaceState(null, "", `/dashboard/users?id=${encodeURIComponent(String(u.user_id))}`);
                      setEmailQ(u.email || "");
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto px-[10px] py-[8px] text-[8px]"
                    onClick={() => setDeleteTarget(u)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Pagination + page size */}
      <div className="absolute left-[calc(37.5%+56px)] top-[808px] flex w-[748px] items-start justify-between">
        <div className="flex items-center gap-2">
          <PageBtn disabled={safePage <= 1} onClick={() => setPage(Math.max(1, safePage - 1))}>
            ‹
          </PageBtn>
          {pageItems.map((p, idx) =>
            p === "…" ? (
              <PageBtn key={`dots-${idx}`} disabled>
                …
              </PageBtn>
            ) : (
              <PageBtn key={p} active={p === safePage} onClick={() => setPage(p)}>
                {p}
              </PageBtn>
            )
          )}
          <PageBtn disabled={safePage >= totalPages} onClick={() => setPage(Math.min(totalPages, safePage + 1))}>
            ›
          </PageBtn>
        </div>

        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) || 6)}
            className="h-8 w-[50px] rounded-[4px] border border-[hsl(var(--brand-soft))] bg-transparent px-2 text-[14px] text-[hsl(var(--brand-soft))]"
          >
            {[6, 12, 24, 48, 96].map((n) => (
              <option key={n} value={n} className="bg-[hsl(var(--figma-surface))] text-white">
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="absolute left-[297px] top-[1000px] text-xs text-white/50">
        Note: editing/deleting here affects the `public.users` profile rows. Managing Supabase Auth accounts requires
        server-side admin APIs.
      </div>
    </div>
  );
}

