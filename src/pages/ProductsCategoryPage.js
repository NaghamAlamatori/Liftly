import React from "react";
import { Link, useParams } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { supabase } from "../lib/supabaseClient";
import FixedPagination from "../components/ui/fixed-pagination";

function titleForSlug(slug) {
  switch (slug) {
    case "womens-shoes":
      return "Women’s shoes";
    case "mens-shoes":
      return "Men’s shoes";
    case "accessories":
      return "Accessories";
    case "mens-clothing":
      return "Men’s clothing";
    case "womens-clothing":
      return "Women’s clothing";
    case "sports-nutrition":
      return "Sports Nutrition";
    default:
      return "Products";
  }
}

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="mx-auto w-[444px] max-w-full">
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

function ProductCard({ id, image, name, colors, price }) {
  return (
    <div className="w-[400px] max-w-full">
      <Link
        to={`/product/${id}`}
        className="block overflow-hidden rounded-[20px] bg-[hsl(var(--figma-surface))] shadow-[0px_41px_11px_0px_rgba(0,0,0,0),0px_26px_10px_0px_rgba(0,0,0,0.01),0px_15px_9px_0px_rgba(0,0,0,0.03),0px_7px_7px_0px_rgba(0,0,0,0.04),0px_2px_4px_0px_rgba(0,0,0,0.05)]"
      >
        <div className="h-[267px] w-full">
          <img alt="" src={image} className="h-full w-full object-cover" />
        </div>
      </Link>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-[18px] font-semibold leading-[1.2] text-white">{name}</div>
          <div className="text-[12px] text-white/70">{colors} Colors</div>
          <div className="mt-2 text-[28px] font-semibold text-white">{price}$</div>
        </div>

        <Link
          to={`/product/${id}`}
          className="inline-flex h-10 items-center justify-center rounded-[30px] bg-primary px-8 text-[14px] font-bold text-[hsl(var(--brand-ink))] shadow-[0px_1px_2px_rgba(0,0,0,0.2)]"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}


export default function ProductsCategoryPage() {
  const { slug } = useParams();
  const title = titleForSlug(slug);
  const [query, setQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(6);
  const [page, setPage] = React.useState(1);
  const [products, setProducts] = React.useState([]);
  const [, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", slug)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        if (mounted) {
          setProducts(
            (data || []).map((p) => ({
              id: p.product_id,
              image: p.image_1, // Use image_1 as main image
              name: p.name,
              colors: p.color,
              price: p.price,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const filtered = React.useMemo(() => {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => String(p.name || "").toLowerCase().includes(q));
  }, [products, query]);

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
        <SiteNav active="products" />
      </div>

      <div className="mx-auto w-[1440px] max-w-full px-6 pb-24">
        <div className="relative mx-auto w-[1240px] max-w-full pt-10">
          <Link
            to="/products"
            className="inline-flex items-center rounded-[30px] border border-[hsl(var(--brand-soft))] px-[32px] py-[8px] text-[14px] font-bold text-[hsl(var(--brand-soft))] shadow-[0px_1px_2px_rgba(0,0,0,0.2)]"
          >
            Back
          </Link>

          <div className="mt-10 text-center text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
            {title}
          </div>

          <div className="mt-8 flex justify-center">
            <SearchBar value={query} onChange={setQuery} placeholder={`Search ${title}`} />
          </div>

          <div className="mt-12 grid grid-cols-3 gap-x-5 gap-y-12">
            {paged.length > 0 ? (
              paged.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="text-2xl text-[hsl(var(--figma-text))]">No products found in this category.</div>
                <div className="mt-4 text-[hsl(var(--figma-soft))]">
                  Please check back later or explore other categories.
                </div>
              </div>
            )}
          </div>

          {/* Pagination removed from flow — fixed bottom pagination will be used */}
        </div>
      </div>
      {/* Fixed pagination (shared component) */}
      <FixedPagination page={safePage} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}

