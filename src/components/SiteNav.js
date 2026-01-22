import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useAuth } from "../auth/AuthContext";
import ProfileMenu from "./ProfileMenu";
import AuthLink from "./AuthLink";
import { mcpAsset, siteImage } from "../lib/publicAssets";

const imgLogoNav = mcpAsset("6680259d-380b-4863-8164-84549f5e8b31");
// When logged in, show this icon instead of the Login button.
// Stored in Supabase Storage bucket: `site-images/login.svg`
const imgProfileIcon = siteImage("login.svg");

export default function SiteNav({
  active = "home",
  className,
  layout = "contained",
  showCartIcon = false,
  cartTo = "/cart",
}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const boxRef = React.useRef(null);
  const mobileRef = React.useRef(null);
  const isLoginPage = location?.pathname === "/login";

  React.useEffect(() => {
    function onDown(e) {
      if (profileOpen) {
        if (boxRef.current && !boxRef.current.contains(e.target)) setProfileOpen(false);
      }

      if (mobileOpen) {
        if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("pointerdown", onDown);
    };
  }, [profileOpen, mobileOpen]);

  const navItemBase = "text-[hsl(var(--figma-text))]";

  const items = [
    { key: "home", label: "Home", to: "/", kind: "link" },
    { key: "about", label: "About", to: "/about", kind: "link" },
    { key: "products", label: "Products", to: "/products", kind: "link" },
    { key: "articles", label: "Articles", to: "/articles", kind: "link" },
    { key: "plan", label: "Plan", to: "/plan", kind: "auth" },
  ];

  return (
    <div className={cn("relative w-full", className)}>
      {/* Matches Figma/About: centered 1240 container + generous vertical padding */}
      <div
        className={cn(
          "flex w-full items-center justify-between gap-4 py-[65px]",
          layout === "contained" && "mx-auto max-w-[1240px]",
          layout === "full" && "px-4 sm:px-6 lg:px-10"
        )}
      >
        {/* Left: Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <img alt="" src={imgLogoNav} className="h-[38px] w-[40px]" />
          <div className="text-2xl font-bold text-primary">LIFTLY</div>
        </div>

        {/* Center: Links (desktop) */}
        <div className="hidden items-center gap-12 text-base md:flex">
          {items.map((it) => {
            const cls = cn(navItemBase, active === it.key && "font-semibold text-primary underline");
            if (it.kind === "auth") {
              return (
                <AuthLink key={it.key} to={it.to} className={cls}>
                  {it.label}
                </AuthLink>
              );
            }
            return (
              <Link key={it.key} to={it.to} className={cls}>
                {it.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>

          {showCartIcon ? (
            <Link
              to={cartTo}
              aria-label="Cart"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
          ) : null}

          {isAuthenticated ? (
            <div className="relative" ref={boxRef}>
              <button
                type="button"
                aria-label="Open profile menu"
                className="relative h-[45px] w-[45px] shrink-0"
                onPointerDown={(e) => {
                  // Open on first tap (especially on mobile) and avoid needing a second click.
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileOpen(false);
                  setProfileOpen((v) => !v);
                }}
              >
                <img alt="" src={imgProfileIcon} className="h-full w-full" />
              </button>

              {profileOpen ? (
                <div className="absolute right-0 top-[58px] z-50">
                  <ProfileMenu onClose={() => setProfileOpen(false)} />
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Login is hidden when authenticated or already on the login page */}
          {!isAuthenticated && !isLoginPage ? (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen ? (
        <div className="md:hidden" ref={mobileRef}>
          <div
            className={cn(
              "-mt-4 w-full rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur",
              layout === "contained" && "mx-auto max-w-[1240px]",
              layout === "full" && "px-4 sm:px-6 lg:px-10"
            )}
          >
            <div className="flex flex-col gap-3 text-base">
              {items.map((it) => {
                const cls = cn(navItemBase, active === it.key && "font-semibold text-primary underline");
                if (it.kind === "auth") {
                  return (
                    <AuthLink
                      key={it.key}
                      to={it.to}
                      className={cls}
                      onClick={() => setMobileOpen(false)}
                    >
                      {it.label}
                    </AuthLink>
                  );
                }
                return (
                  <Link
                    key={it.key}
                    to={it.to}
                    className={cls}
                    onClick={() => setMobileOpen(false)}
                  >
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


