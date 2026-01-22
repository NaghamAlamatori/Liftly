import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import SiteNav from "../components/SiteNav";
import { mcpAsset } from "../lib/publicAssets";

const imgFooterLogo = mcpAsset("b5c70880-093d-43df-a847-1e95ca3df35f");

function SiteFooter({ active = "about" }) {
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

function AboutSection() {
  const stats = [
    { big: "12+", text: "stick to their plan after week one" },
    { big: "8K+", text: "athletes supported through content" },
    { big: "4,200+", text: "strength and wellness products explored" },
    { big: "200+", text: "expert articles read daily" },
  ];

  return (
    <div className="w-full px-[100px] py-10">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-[60px] text-center">
        <div className="flex flex-col items-center gap-[29px]">
          <div className="text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
            About US
          </div>
          <div className="w-[740px] max-w-full text-2xl text-[hsl(var(--figma-soft))]">
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

        <div className="grid w-[1088px] max-w-full grid-cols-2 gap-8">
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

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteNav active="about" />
      <AboutSection />
      <SiteFooter active="about" />
    </div>
  );
}


