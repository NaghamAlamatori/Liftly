import React from "react";
import { Link } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { mcpAsset } from "../lib/publicAssets";
import { useAuth } from "../auth/AuthContext";

const imgFooterLogo = mcpAsset("a0544397-ed14-48f3-b263-31cb93ff5ee2");
const LEGACY_CART_KEY = "liftly_cart";
const GUEST_CART_KEY = "liftly_cart_guest";
const DYNAMIC_PREFIX = "liftly_cart_";

function mergeCartLists(a, b) {
  const merged = Array.isArray(a) ? [...a] : [];
  const extras = Array.isArray(b) ? b : [];

  for (const item of extras) {
    if (!item) continue;
    const idx = merged.findIndex(
      (m) => m.id === item.id && m.color === item.color && m.size === item.size
    );
    if (idx >= 0) {
      const currentQty = Number(merged[idx].qty || 1);
      const extraQty = Number(item.qty || 1);
      merged[idx] = { ...merged[idx], qty: currentQty + (Number.isFinite(extraQty) ? extraQty : 0) };
    } else {
      merged.push(item);
    }
  }

  return merged;
}

function formatMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0$";
  return `${Math.round(num)}$`;
}

function parseMoney(price) {
  const raw = String(price || "").replace(/[^\d.]/g, "");
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function CartRow({ image, title, color, size, price, qty, onQtyChange, onRemove }) {
  return (
    /* 4. Increased spacing: Added margin-bottom or you can rely on the parent gap-12 */
    <div className="flex h-[165.849px] w-[598.558px] items-end gap-[15.251px] mb-4">
      <div className="relative h-[165.849px] w-[173.475px] overflow-hidden rounded-[16px] bg-card shadow-[0px_78.159px_20.969px_0px_rgba(0,0,0,0),0px_49.564px_19.063px_0px_rgba(0,0,0,0.01),0px_28.595px_17.157px_0px_rgba(0,0,0,0.03),0px_13.344px_13.344px_0px_rgba(0,0,0,0.04),0px_3.813px_7.625px_0px_rgba(0,0,0,0.05)]">
        <img alt="" className="absolute top-0 h-full w-[142.44%] object-cover" src={image} style={{ left: "-1.58%" }} />
      </div>

      <div className="flex w-[339.324px] flex-col items-start gap-[9.532px] font-semibold leading-[1.32] text-white">
        <p className="w-full text-[28px] tracking-[-0.84px]">{title}</p>
        <p className="w-full text-[24px] tracking-[-0.72px]">{`Color : ${color}`}</p>
        <p className="w-full text-[24px] tracking-[-0.72px]">{`Size : ${size}`}</p>
        <p className="w-full text-[28px] tracking-[-0.84px]">{`Price : ${price}`}</p>
      </div>

      <div className="flex w-[78.159px] flex-col items-end gap-[104.847px]">
        {/* 1. Fixed trash icon: Swapped img for an inline SVG to prevent logo overrides */}
        <button type="button" onClick={onRemove} aria-label={`Remove ${title}`} className="flex h-[30.501px] w-[30.501px] items-center justify-center text-red-500 hover:text-red-400 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
          </svg>
        </button>
        <div className="flex h-[30.501px] w-full items-center justify-between rounded-[38.126px] bg-[hsl(var(--figma-text))] p-[15.251px]">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="text-[22.876px] font-semibold leading-[1.32] tracking-[-0.6863px] text-[hsl(var(--brand-ink))]"
            onClick={() => onQtyChange?.(Math.max(1, Number(qty || 1) - 1))}
          >
            -
          </button>
          <span className="text-[22.876px] font-semibold leading-[1.32] tracking-[-0.6863px] text-[hsl(var(--brand-ink))]">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="text-[22.876px] font-semibold leading-[1.32] tracking-[-0.6863px] text-[hsl(var(--brand-ink))]"
            onClick={() => onQtyChange?.(Number(qty || 1) + 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { user } = useAuth();
  const cartKey = React.useMemo(
    () => (user?.id ? `${DYNAMIC_PREFIX}${user.id}` : GUEST_CART_KEY),
    [user?.id]
  );

  const [items, setItems] = React.useState([]);
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  React.useEffect(() => {
    try {
      let base = [];

      // When logged in, merge any legacy/guest carts into this user's cart
      if (user?.id) {
        const legacyRaw = localStorage.getItem(LEGACY_CART_KEY);
        const guestRaw = localStorage.getItem(GUEST_CART_KEY);

        if (legacyRaw) {
          try {
            base = mergeCartLists(base, JSON.parse(legacyRaw));
          } catch (_e) {
            // ignore malformed legacy data
          }
        }

        if (guestRaw) {
          try {
            base = mergeCartLists(base, JSON.parse(guestRaw));
          } catch (_e) {
            // ignore malformed guest data
          }
        }

        if (base.length) {
          // Persist merged data to the user-specific cart and clear legacy locations
          const existingRaw = localStorage.getItem(cartKey);
          let existing = [];
          if (existingRaw) {
            try {
              existing = JSON.parse(existingRaw);
            } catch (_e) {
              existing = [];
            }
          }

          const mergedForUser = mergeCartLists(base, existing);
          localStorage.setItem(cartKey, JSON.stringify(mergedForUser));
          localStorage.removeItem(LEGACY_CART_KEY);
          localStorage.removeItem(GUEST_CART_KEY);
          localStorage.setItem("liftly_last_user_id", user.id);
        }
      } else {
        // When logged out, expose the last user's cart under the guest cart
        const lastUserId = localStorage.getItem("liftly_last_user_id");
        if (lastUserId) {
          const lastUserKey = `${DYNAMIC_PREFIX}${lastUserId}`;
          const lastRaw = localStorage.getItem(lastUserKey);
          if (lastRaw) {
            try {
              base = mergeCartLists(base, JSON.parse(lastRaw));
            } catch (_e) {
              // ignore malformed previous user data
            }
          }
        }
      }

      // Always include whatever is already stored for the current cart key
      const savedRaw = localStorage.getItem(cartKey);
      let saved = [];
      if (savedRaw) {
        try {
          saved = JSON.parse(savedRaw);
        } catch (_e) {
          saved = [];
        }
      }

      const merged = mergeCartLists(base, saved);
      setItems(merged);
      localStorage.setItem(cartKey, JSON.stringify(merged));
    } catch (_e) {
      setItems([]);
    }
  }, [cartKey, user?.id]);

  const updateCart = (newItems) => {
    setItems(newItems);
    localStorage.setItem(cartKey, JSON.stringify(newItems));
  };

  const subtotal = React.useMemo(() => items.reduce((sum, it) => sum + parseMoney(it.price) * Number(it.qty || 1), 0), [items]);
  const discount = React.useMemo(() => subtotal * 0.2, [subtotal]);
  const delivery = 0;
  const total = Math.max(0, subtotal - discount + delivery);

  return (
    <div className="bg-background flex flex-col items-center relative min-h-screen w-full" data-name="Cart">
      {/* Header Section */}
      <div className="w-full">
        <SiteNav active="products" />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove item?"
        description="This will remove the item from your cart."
        confirmText="Remove"
        confirmVariant="danger"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          const newItems = items.filter((p) => 
            !(p.id === deleteTarget.id && p.color === deleteTarget.color && p.size === deleteTarget.size)
          );
          updateCart(newItems);
          setDeleteTarget(null);
        }}
      />

      {/* Main Content Body */}
      <div className="flex w-full max-w-[1240px] flex-col py-10">
        
        <div className="flex w-full items-center justify-between mb-12">
          <Link
            to="/products"
            className="flex items-center rounded-[30px] border border-[hsl(var(--brand-soft))] px-6 py-2 text-[14px] font-bold text-[hsl(var(--brand-soft))] shadow-sm hover:bg-white/5 transition-colors"
          >
            Back
          </Link>
          <p className="text-[18px] tracking-[-0.6px] text-[#a1a1a1] text-right">
            {"Home > Products > Cart"}
          </p>
        </div>

        <div className="flex flex-col gap-10">
          <h1 className="text-[48px] font-bold text-primary">YOUR CART</h1>
          
          {items.length === 0 ? (
            <div className="text-white text-xl py-20 text-center">
              Your cart is empty. <Link to="/products" className="text-primary underline">Go to Products</Link>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-16">
              <div className="flex-1 flex flex-col gap-12">
                {items.map((it, idx) => (
                  <CartRow
                    key={`${it.id}-${it.color}-${it.size}-${idx}`}
                    image={it.image}
                    title={it.name}
                    color={it.color}
                    size={it.size}
                    price={formatMoney(it.price)}
                    qty={it.qty}
                    onQtyChange={(newQty) => {
                      const newItems = [...items];
                      newItems[idx].qty = newQty;
                      updateCart(newItems);
                    }}
                    onRemove={() => setDeleteTarget(it)}
                  />
                ))}
              </div>

              {/* Summary */}
              <div className="w-[400px] shrink-0 rounded-[23px] border border-[hsl(var(--brand-soft))] bg-card p-8 text-white sticky top-10">
                <h2 className="text-[28px] font-semibold mb-6">Order Summary</h2>
                <div className="flex flex-col gap-4 text-xl">
                  <div className="flex justify-between">
                    <span className="opacity-70">Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Discount (-20%)</span>
                    <span className="text-primary">{formatMoney(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Delivery</span>
                    <span>{delivery === 0 ? "Free" : formatMoney(delivery)}</span>
                  </div>
                  
                  <div className="h-px bg-[hsl(var(--brand-soft))] my-4" />
                  
                  <div className="flex justify-between font-bold text-3xl">
                    <span>Total</span>
                    <span>{formatMoney(total)}</span>
                  </div>
                  
                  <button className="mt-8 w-full rounded-xl bg-primary py-4 text-center text-xl font-bold text-[hsl(var(--brand-ink))] hover:brightness-110 transition-all">
                    Go to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full px-[100px] py-[60px] border-t border-white/10 mt-20">
        <div className="mx-auto flex w-[1240px] flex-col items-center justify-between gap-10">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[16px]">
              <img alt="" className="h-[75px] w-[80px]" src={imgFooterLogo} />
              <p className="text-[64px] font-bold text-primary">LIFTLY</p>
            </div>
            <div className="flex items-center gap-[48px] text-[14px] text-[hsl(var(--figma-text))]">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/products" className="font-semibold text-primary underline">Products</Link>
              <Link to="/articles">Articles</Link>
              <Link to="/plan">Plan</Link>
            </div>
          </div>
          <p className="text-[12px] opacity-50">© 2026 Liftly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}