import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";
import SiteNav from "../components/SiteNav";
import AuthLink from "../components/AuthLink";
import { mcpAsset, siteImage } from "../lib/publicAssets";

// Supabase Storage asset (your bucket uses filenames, not ids)
const imgHeroBg = siteImage("Home 1.jpg");
const imgFooterLogo = mcpAsset("b5c70880-093d-43df-a847-1e95ca3df35f");

const imgProduct1 = mcpAsset("060da4a0-6a94-4740-8b2b-c8a9218d3c6d");
const imgProduct2 = mcpAsset("ef4a916a-3bb3-4588-853e-d57cacf90dbd");
const imgProduct3 = mcpAsset("34c01d7c-1a17-429a-97fd-a6838d1ac421");

const imgArticle = siteImage("Articles.png");
const imgPlanBg = siteImage("Make Your Plan.jpg");

function SiteFooter({ active = "home" }) {
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
              {" "}
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

function Hero() {
  return (
    <div className="w-full px-[100px] py-10">
      <div className="relative h-[1024px] w-full overflow-hidden rounded-none sm:rounded-[20px]">
        <div className="absolute inset-0 rounded-none sm:rounded-[20px] bg-black" />
        <div
          className="absolute inset-0 rounded-none sm:rounded-[20px] opacity-50"
          style={{
            backgroundImage: `url(${imgHeroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 rounded-none sm:rounded-[20px] bg-gradient-to-b from-black/0 to-[hsl(var(--background))] [background-position:0_77.295%]" />

        {/* Figma node 64:55 (Hero container) */}
        <div className="relative flex h-full w-full flex-col items-center gap-[200px] overflow-hidden px-4 py-[64px] sm:px-6 lg:px-[309px]">
          <SiteNav active="home" layout="full" />

          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="space-y-4">
              <div
                className="bg-clip-text text-[80px] font-semibold leading-[1.1] tracking-[-2.4px] text-transparent [text-shadow:0px_3px_4px_rgba(0,0,0,0.3)]"
                style={{
                  backgroundImage:
                    "linear-gradient(169.05243704321322deg, rgba(253, 206, 18, 1) 6.7138%, rgba(253, 147, 18, 1) 133.16%)",
                }}
              >
                <div>Discover the best</div>
                <div>version of yourself</div>
              </div>
              <div className="text-2xl text-[hsl(var(--figma-soft))]">
                <div>start your journey toward greater strength,</div>
                <div>better health, and endless energy.</div>
              </div>
            </div>

            <Button className="h-10 rounded-[30px] px-8 py-2" asChild>
              <AuthLink to="/plan">Build Your Plan</AuthLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  const stats = [
    { big: "12+", text: "stick to their plan after week one" },
    { big: "8K+", text: "athletes supported through content" },
    { big: "4,200+", text: "strength and wellness products explored" },
    { big: "200+", text: "expert articles read daily" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] px-[100px] py-10">
      <div className="flex flex-col items-center gap-[60px]">
        <div className="text-center">
          <div className="text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
            About US
          </div>
          <div className="mt-7 w-full max-w-[740px] text-2xl text-[hsl(var(--figma-soft))]">
            <p>
              We are a sports platform that aims to help you improve your fitness and build a healthy
              lifestyle in a simple and practical way.
            </p>
            <p className="mt-6">
              We provide reliable sports articles, carefully selected products, and the ability to
              create a fitness plan that matches your goals and level by yourself.
            </p>
          </div>
        </div>

        <div className="grid h-[360px] w-full max-w-[1088px] grid-cols-2 gap-8">
          {stats.map((s) => (
            <div
              key={s.big}
              className="relative overflow-hidden rounded-[20px] border border-primary bg-[hsl(var(--figma-surface))] p-6 shadow-[0px_0px_0px_1px_hsl(var(--brand-2))]"
            >
              <div className="text-[60px] font-bold leading-[1.1] tracking-[-1.8px] text-white">
                {s.big.slice(0, -1)}
                <span className="text-[hsl(var(--brand-2))]">{s.big.slice(-1)}</span>
              </div>
              <div className="mt-2 text-2xl leading-[1.1] tracking-[-0.72px] text-[hsl(var(--figma-text))]">
                {s.text}
              </div>
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0px_-6px_20px_0px_rgba(254,238,174,0.1)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsPreview() {
  const [items, setItems] = React.useState([
    {
      img: imgProduct1,
      name: "Kettlebell Set",
      meta: "Black / 10kg",
      price: "50$",
    },
    {
      img: imgProduct2,
      name: "Dumbbells",
      meta: "Black / 5kg",
      price: "30$",
    },
    {
      img: imgProduct3,
      name: "Training Mat",
      meta: "Blue / Std",
      price: "25$",
    },
  ]);

  React.useEffect(() => {
    (async () => {
      const { data } = await supabase.from("products").select("*").limit(3).order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setItems(
          data.map((p) => ({
            img: p.image_1,
            name: p.name,
            meta: `${p.color || "Multi"} / ${p.size || "Std"}`,
            price: p.price ? `${p.price}$` : "",
          }))
        );
      }
    })();
  }, []);

  return (
    <div className="w-full px-[100px] py-10">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-[60px]">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
              Products
            </div>
            <div className="mt-2 w-full max-w-[440px] text-2xl text-[hsl(var(--figma-soft))]">
              Gear built to improve training, recovery, and everyday performance.
            </div>
          </div>
          <Button asChild>
            <Link to="/products">Explore All Products</Link>
          </Button>
        </div>

        <div className="flex items-start justify-between gap-5">
          {items.map((p) => (
            <div key={p.name} className="w-[400px]">
              <div className="h-[315px] w-full overflow-hidden rounded-2xl">
                <img alt="" src={p.img} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold leading-[1.1] tracking-[-0.72px] text-white">
                  {p.name}
                </div>
                <div className="mt-1 text-xl tracking-[-0.6px] text-white/80">{p.meta}</div>
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-[32px] font-semibold leading-[1.1] tracking-[-0.96px] text-white">
                    {p.price}
                  </div>
                  <Button>Buy Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticlesPreview() {
  const items = [
    {
      title: "Build a Better Strength Routine",
      desc: "Here’s how to structure your workouts for steady progress.",
    },
    {
      title: "Fueling for All-Day Energy",
      desc: "The right foods at the right time keep your body performing.",
    },
    {
      title: "Recover Like an Athlete",
      desc: "Learn what helps muscles rebuild so tomorrow you’re stronger, not sore.",
    },
  ];

  return (
    <div className="w-full px-[100px] py-10">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-[60px]">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
              Articles
            </div>
            <div className="mt-2 w-full max-w-[541px] text-2xl text-[hsl(var(--figma-soft))]">
              Our articles give athletes the knowledge to train smarter and feel stronger every day.
            </div>
          </div>
          <Button asChild>
            <Link to="/articles">Read More Articles</Link>
          </Button>
        </div>

        <div className="flex items-start justify-center gap-5">
          {items.map((a) => (
            <div
              key={a.title}
              className="h-[409px] w-[400px] overflow-hidden rounded-2xl bg-[hsl(var(--figma-surface))] shadow-[0px_41px_11px_0px_rgba(0,0,0,0),0px_26px_10px_0px_rgba(0,0,0,0.01),0px_15px_9px_0px_rgba(0,0,0,0.03),0px_7px_7px_0px_rgba(0,0,0,0.04),0px_2px_4px_0px_rgba(0,0,0,0.05)]"
            >
              <div className="h-[267px] w-full">
                <img alt="" src={imgArticle} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 text-white">
                <div className="text-2xl font-semibold leading-[1.1] tracking-[-0.72px]">
                  {a.title}
                </div>
                <div className="mt-4 text-xl tracking-[-0.6px] text-white/80">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanCta() {
  return (
    <div className="w-full px-[100px] py-10">
      <div className="relative mx-auto flex h-[552px] w-full max-w-[1240px] items-end overflow-hidden rounded-[20px] p-9">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[20px]">
          <div className="absolute inset-0 overflow-hidden rounded-[20px] opacity-80">
            <div
              className="absolute inset-0 grayscale"
              style={{
                backgroundImage: `url(${imgPlanBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          {/* Darken the image for better contrast (matches Figma look) */}
          <div className="absolute inset-0 rounded-[20px] bg-black/55" />
          <div
            className="absolute inset-0 rounded-[20px]"
            style={{
              backgroundImage:
                "linear-gradient(-82.03296414182728deg, rgba(253, 147, 18, 0) 68.946%, rgba(253, 147, 18, 0.1) 100.03%)",
            }}
          />
        </div>

        <div className="relative flex flex-col items-start justify-end gap-[33px]">
          <div className="flex flex-col items-start gap-2">
            <div className="text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
              Make Your Plan
            </div>
            <div className="w-[541px] max-w-full text-2xl leading-normal text-[hsl(var(--brand-soft))]">
              Build a plan that fits your training, tracks your progress, and keeps you moving.
            </div>
          </div>

          <Button asChild className="self-start w-fit">
            <AuthLink
              to="/plan"
              className="font-bold text-[16px] text-[hsl(var(--brand-ink))] [text-shadow:0px_1px_2px_rgba(0,0,0,0.2)]"
            >
              Create My Plan
            </AuthLink>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-[100px] bg-background">
      <Hero />
      <About />
      <ProductsPreview />
      <ArticlesPreview />
      <PlanCta />
      <SiteFooter active="home" />
    </div>
  );
}


