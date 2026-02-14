import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import SiteNav from "../components/SiteNav";
import { supabase } from "../lib/supabaseClient";
import { DUMMY_ARTICLES } from "../lib/dummyArticles";
import { mcpAsset, siteImage } from "../lib/publicAssets";
import FixedPagination from "../components/ui/fixed-pagination";

const imgFooterLogo = mcpAsset("3f31f2eb-a2a4-4bbb-a192-f9a72ebed057");

const imgArticle = siteImage("Articles.png");
const imgFeatured = mcpAsset("10510689-80cf-4b9d-bb93-18aeafc4c8f2");


function SiteFooter({ active = "articles" }) {
  return (
    <div className="w-full px-[100px] py-10">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-10">
        <div className="flex w-full items-center justify-between p-2">
          <div className="flex items-center gap-4">
            <img alt="" src={imgFooterLogo} className="h-[75px] w-[80px]" />
            <div className="text-[64px] font-bold leading-none text-primary">LIFTLY</div>
          </div>
          <div className="flex items-center gap-12 text-sm">
            <Link className={cn("text-[hsl(var(--figma-text))]", active === "home" && "font-semibold text-primary underline")} to="/">
              Home
            </Link>
            <Link
              className={cn("text-[hsl(var(--figma-text))]", active === "about" && "font-semibold text-primary underline")}
              to="/about"
            >
              About
            </Link>
            <Link className={cn("text-[hsl(var(--figma-text))]", active === "products" && "font-semibold text-primary underline")} to="/products">
              {" "}
              Products
            </Link>
            <Link className={cn("text-[hsl(var(--figma-text))]", active === "articles" && "font-semibold text-primary underline")} to="/articles">
              Articles
            </Link>
            <Link className={cn("text-[hsl(var(--figma-text))]", active === "plan" && "font-semibold text-primary underline")} to="/plan">
              Plan
            </Link>
          </div>
        </div>
        <div className="text-xs leading-5 text-white/65">© 2025 Liftly. All rights reserved.</div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="w-[444px] max-w-full">
      <div className="flex h-9 w-full items-center rounded-[20px] border border-[hsl(var(--figma-text))] bg-[hsl(var(--figma-surface))] p-2">
        <div className="flex h-7 w-7 items-center justify-center text-[rgba(255,254,251,0.6)]">🔎</div>
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="ml-2 h-full flex-1 bg-transparent text-sm text-[hsl(var(--figma-text))] outline-none placeholder:text-[rgba(255,254,251,0.6)]"
        />
      </div>
    </div>
  );
}

function ArticleCard({ to, image, title, description, featured }) {
  const [imgSrc, setImgSrc] = React.useState(image);

  React.useEffect(() => {
    setImgSrc(image);
  }, [image]);

  return (
    <Link
      to={to}
      className={cn(
        "relative h-[409px] w-[400px] overflow-hidden rounded-2xl bg-[hsl(var(--figma-surface))] shadow-[0px_41px_11px_0px_rgba(0,0,0,0),0px_26px_10px_0px_rgba(0,0,0,0.01),0px_15px_9px_0px_rgba(0,0,0,0.03),0px_7px_7px_0px_rgba(0,0,0,0.04),0px_2px_4px_0px_rgba(0,0,0,0.05)]",
        featured &&
          "shadow-[0px_11px_41px_0px_rgba(0,0,0,0.25),0px_26px_10px_0px_rgba(0,0,0,0.25),0px_15px_9px_0px_rgba(0,0,0,0.25),0px_7px_7px_0px_rgba(254,238,174,0.1),0px_4px_4px_0px_rgba(254,238,174,0.1)]"
      )}
    >
      <div className="h-[267px] w-full">
        <img
          alt=""
          src={imgSrc}
          onError={() => setImgSrc(imgArticle)}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-6 text-white">
        <div className="text-2xl font-semibold leading-[1.1] tracking-[-0.72px]">{title}</div>
        <div className="mt-4 text-xl tracking-[-0.6px] text-white/80">{description}</div>
      </div>
      {featured ? (
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0px_6px_20px_0px_rgba(255,255,255,0.25)]" />
      ) : null}
    </Link>
  );
}

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

function Pagination({ page, totalPages, onPageChange }) {
  const Item = ({ children, active, ghost, disabled, onClick }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-8 w-8 rounded-[4px] border border-[hsl(var(--figma-soft))] text-center text-sm font-bold text-[hsl(var(--figma-soft))]",
        active && "border-primary text-primary",
        ghost && "border-transparent opacity-50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  );

  const pages = React.useMemo(() => getPageItems(page, totalPages), [page, totalPages]);

  return (
    <div className="flex items-center gap-2">
      <Item ghost disabled={page <= 1} onClick={() => onPageChange?.(Math.max(1, page - 1))}>
        ‹
      </Item>
      {pages.map((p, idx) =>
        p === "…" ? (
          <Item key={`dots-${idx}`} disabled ghost>
            …
          </Item>
        ) : (
          <Item key={p} active={p === page} onClick={() => onPageChange?.(p)}>
            {p}
          </Item>
        )
      )}
      <Item ghost disabled={page >= totalPages} onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}>
        ›
      </Item>
    </div>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(6);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("article_id,title,content,image,created_at")
          .order("created_at", { ascending: false });
        if (!mounted) return;
        if (error) {
          // eslint-disable-next-line no-console
          console.warn("Failed to load articles:", error);
          setArticles(DUMMY_ARTICLES);
        } else {
          const next = (data ?? []).length ? (data ?? []) : DUMMY_ARTICLES;
          setArticles(next);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = React.useMemo(() => {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return articles;
    return (articles || []).filter((a) => {
      const title = String(a?.title || "").toLowerCase();
      const body = String(a?.content || "").toLowerCase();
      return title.includes(q) || body.includes(q);
    });
  }, [articles, query]);

  React.useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  const totalPages = React.useMemo(() => {
    const total = (filtered || []).length;
    return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  }, [filtered, pageSize]);

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const paged = React.useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return (filtered || []).slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center">
        <SiteNav active="articles" />
      </div>

      <div className="mx-auto flex w-[1440px] max-w-full flex-col items-center">
        <div className="flex flex-col items-center gap-[60px] py-[31px]">
          <div className="text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
            Articles
          </div>
          <SearchBar value={query} onChange={setQuery} placeholder="Search articles" />

          <div className="flex w-full flex-col gap-5 px-[100px]">
            {loading ? (
              <div className="px-[100px] py-10 text-center text-[hsl(var(--figma-text))]">Loading…</div>
            ) : paged.length ? (
              <div className="flex flex-wrap items-start justify-center gap-5">
                {paged.map((a, idx) => {
                  const description = String(a.content || "").trim().slice(0, 90);
                  return (
                    <ArticleCard
                      key={a.article_id ?? idx}
                      to={`/articles/${a.article_id}`}
                      image={a.image || (idx === 1 ? imgFeatured : imgArticle)}
                      title={a.title || "Untitled"}
                      description={description ? `${description}${String(a.content || "").length > 90 ? "…" : ""}` : "Read more…"}
                      featured={idx === 1}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="px-[100px] py-10 text-center text-[hsl(var(--figma-text))]">
                No articles found.
              </div>
            )}
          </div>

          {/* Pagination removed from flow — fixed bottom pagination will be used */}
        </div>
      </div>

      {/* Fixed pagination (shared component) */}
      <FixedPagination page={safePage} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />

      <SiteFooter active="articles" />
    </div>
  );
}


