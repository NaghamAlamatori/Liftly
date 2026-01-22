import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import SiteNav from "../components/SiteNav";
import {siteImage } from "../lib/publicAssets";

const imgFrame7 = siteImage("plan.png");
const imgFooterLogo = siteImage("logo.png");

function SiteFooter({ active = "plan" }) {
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

function DayCountOption({ value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-[167.333px] items-center justify-center border px-[42px] py-4 text-[32px] font-bold",
        active
          ? "border-[hsl(var(--brand-2))] text-[hsl(var(--brand-2))]"
          : "border-[hsl(var(--brand-soft))] text-[hsl(var(--brand-soft))]"
      )}
    >
      {value}
    </button>
  );
}

export default function PlanPage() {
  const [selected, setSelected] = React.useState("2");

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full px-[309px] py-16">
        <div className="relative w-full overflow-hidden rounded-[20px] bg-background">
          <div className="absolute inset-0 rounded-[20px] bg-black" />
          <div
            className="absolute inset-0 rounded-[20px] opacity-50"
            style={{
              backgroundImage: `url(${imgFrame7})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-black/0 to-[hsl(var(--background))] [background-position:0_77.295%]" />

          <div className="relative mx-auto flex w-[1240px] max-w-full flex-col items-center gap-[200px]">
            <SiteNav active="plan" />

            <div className="flex w-full flex-col items-center gap-[69px] pb-24">
              <div className="text-center text-[60px] font-semibold leading-[1.1] tracking-[-1.8px] text-primary">
                Make Your Plan
              </div>

              <div className="flex w-full flex-col items-center gap-[69px]">
                <div className="text-center text-[46px] font-semibold leading-[1.1] tracking-[-1.38px] text-primary">
                  <div>How many training days per week</div>
                  <div>do you want?</div>
                </div>

                <div className="flex w-full flex-wrap items-start justify-center gap-[60px]">
                  {["1", "2", "3", "4", "5", "6", "Every Day"].map((v, idx) =>
                    v === "Every Day" ? (
                      <button
                        key={`${v}-${idx}`}
                        type="button"
                        onClick={() => setSelected(v)}
                        className={cn(
                          "flex items-center justify-center border px-[42px] py-4 text-[32px] font-bold",
                          selected === v
                            ? "border-[hsl(var(--brand-2))] text-[hsl(var(--brand-2))]"
                            : "border-[hsl(var(--brand-soft))] text-[hsl(var(--brand-soft))]"
                        )}
                      >
                        {v}
                      </button>
                    ) : (
                      <DayCountOption
                        key={`${v}-${idx}`}
                        value={v}
                        active={selected === v}
                        onClick={() => setSelected(v)}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex w-full justify-end">
                <Button asChild className="h-[41px] w-[101px] justify-center px-8 py-[10px]">
                  <Link
                    to={`/plan/builder?days=${encodeURIComponent(selected === "Every Day" ? "7" : selected)}`}
                    aria-label="Next"
                  >
                    <span className="text-[hsl(var(--brand-ink))]">{">"}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter active="plan" />
    </div>
  );
}


