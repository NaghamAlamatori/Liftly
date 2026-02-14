import React from "react";

function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const showLeftDots = current > 4;
  const showRightDots = current < total - 3;

  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  if (!showLeftDots) {
    start = 2;
    end = 4;
  }

  if (!showRightDots) {
    start = total - 3;
    end = total - 1;
  }

  if (showLeftDots) pages.push("…");

  for (let i = start; i <= end; i++) pages.push(i);

  if (showRightDots) pages.push("…");

  pages.push(total);
  return pages;
}

export default function FixedPagination({
  page = 1,
  totalPages = 1,
  pageSize = 6,
  onPageChange,
  onPageSizeChange,
  admin = false,
}) {
  const pages = React.useMemo(
    () => getPageItems(page, totalPages),
    [page, totalPages]
  );

  const Wrapper = ({ children }) => (
    <div
      className={
        admin
          ? "ml-[297px] mr-[40px] mt-6 flex items-center justify-center"
          : "mt-6 flex items-center justify-center"
      }
    >
      <div className="flex items-center gap-6 py-4">
        {children}
      </div>
    </div>
  );

  const PageBtn = ({ children, active, disabled, onClick }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "h-8 w-8 rounded-[4px] border text-sm font-bold",
        active
          ? "border-primary text-primary"
          : "border-[hsl(var(--brand-soft))] text-[hsl(var(--brand-soft))]",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <Wrapper>
      <div className="flex items-center gap-2">
        <PageBtn
          disabled={page <= 1}
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
        >
          ‹
        </PageBtn>

        {pages.map((p, idx) =>
          p === "…" ? (
            <PageBtn key={`dots-${idx}`} disabled>
              …
            </PageBtn>
          ) : (
            <PageBtn
              key={p}
              active={p === page}
              onClick={() => onPageChange?.(p)}
            >
              {p}
            </PageBtn>
          )
        )}

        <PageBtn
          disabled={page >= totalPages}
          onClick={() =>
            onPageChange?.(Math.min(totalPages, page + 1))
          }
        >
          ›
        </PageBtn>
      </div>

      <div>
        <select
          value={pageSize}
          onChange={(e) =>
            onPageSizeChange?.(Number(e.target.value) || 6)
          }
          className="h-8 w-[60px] rounded-[4px] border border-[hsl(var(--brand-soft))] bg-transparent px-2 text-sm text-[hsl(var(--brand-soft))]"
        >
          {[6, 12, 24, 48, 96].map((n) => (
            <option
              key={n}
              value={n}
              className="bg-[hsl(var(--figma-surface))] text-white"
            >
              {n}
            </option>
          ))}
        </select>
      </div>
    </Wrapper>
  );
}
