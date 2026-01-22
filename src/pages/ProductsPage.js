import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import SiteNav from "../components/SiteNav";
import { mcpAsset, siteImage } from "../lib/publicAssets";

const imgFooterLogo = mcpAsset("c888fdfe-8082-40af-95f9-3cea81d9a2ce");

const menshoes = siteImage("Mens shoes.jpg");
const accessories = siteImage("Accessories.jpg");
const womenshoes = siteImage("Womens shoes.png");
const mensclothing = siteImage("Mens clothing.png");
const womensclothing = siteImage("Womens clothing.jpg");
const sportsnutrition = siteImage("Athletic Nutrition .jpg");


function SiteFooter({ active = "products" }) {
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

function Category({ image, title, href }) {
  const content = (
    <div className="relative flex h-[500px] w-[400px] items-center justify-center overflow-hidden rounded-[20px]">
      <img alt="" src={image} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 rounded-[20px] bg-black/40" />
      <div className="relative text-center text-[42px] font-bold leading-[1.1] tracking-[-1.26px] text-[hsl(var(--figma-text))] [text-shadow:0px_2px_5px_rgba(0,0,0,0.2),0px_10px_10px_rgba(0,0,0,0.17),0px_22px_13px_rgba(0,0,0,0.1),0px_39px_15px_rgba(0,0,0,0.03),0px_60px_17px_rgba(0,0,0,0)]">
        {title}
      </div>
    </div>
  );

  if (!href) return content;
  return (
    <Link to={href} className="block">
      {content}
    </Link>
  );
}

export default function ProductsPage() {
  const [query, setQuery] = React.useState("");

  const categories = React.useMemo(
    () => [
      { image: menshoes, title: "Men's shoes", href: "/products/category/mens-shoes" },
      { image: accessories, title: "Accessories", href: "/products/category/accessories" },
      { image: womenshoes, title: "Women’s shoes", href: "/products/category/womens-shoes" },
      { image: mensclothing, title: "Men's clothing", href: "/products/category/mens-clothing" },
      { image: womensclothing, title: "Women’s clothing", href: "/products/category/womens-clothing" },
      { image: sportsnutrition, title: "Sports Nutrition", href: "/products/category/sports-nutrition" },
    ],
    []
  );

  const filtered = React.useMemo(() => {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => String(c.title || "").toLowerCase().includes(q));
  }, [categories, query]);

  const rows = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < filtered.length; i += 3) out.push(filtered.slice(i, i + 3));
    return out;
  }, [filtered]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center">
        <SiteNav active="products" />
      </div>

      <div className="mx-auto flex w-[1440px] max-w-full flex-col items-center px-[498px]">
        <div className="flex flex-col items-center gap-[60px] py-[31px]">
          <div className="text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
            Products
          </div>

          <SearchBar value={query} onChange={setQuery} placeholder="Search categories" />

          <div className="flex w-[1240px] max-w-full flex-col gap-[52px]">
            {rows.length ? (
              rows.map((r, idx) => (
                <div key={idx} className="flex flex-wrap items-start justify-center gap-5">
                  {r.map((c) => (
                    <Category key={c.href} image={c.image} title={c.title} href={c.href} />
                  ))}
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-[hsl(var(--figma-text))]">No categories match your search.</div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter active="products" />
    </div>
  );
}


