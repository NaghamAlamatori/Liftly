import React from "react";
import { Link } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { mcpAsset } from "../lib/publicAssets";

const imgDelete02 = mcpAsset("cac42c35-aa86-48cc-a5ef-cbc67e9a7681");
const imgFooterLogo = mcpAsset("a0544397-ed14-48f3-b263-31cb93ff5ee2");

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

function CartRow({ image, delIcon, title, color, size, price, qty, onQtyChange, onRemove }) {
  return (
    <div className="flex h-[165.849px] w-[598.558px] items-end gap-[15.251px]">
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
        <button type="button" onClick={onRemove} aria-label={`Remove ${title}`} className="h-[30.501px] w-[30.501px]">
          <img alt="" className="h-[30.501px] w-[30.501px]" src={delIcon} />
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
  const [items, setItems] = React.useState(() => {
    try {
      const saved = localStorage.getItem("liftly_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const updateCart = (newItems) => {
    setItems(newItems);
    localStorage.setItem("liftly_cart", JSON.stringify(newItems));
  };

  const subtotal = React.useMemo(() => items.reduce((sum, it) => sum + parseMoney(it.price) * Number(it.qty || 1), 0), [items]);
  const discount = React.useMemo(() => subtotal * 0.2, [subtotal]);
  const delivery = 0;
  const total = Math.max(0, subtotal - discount + delivery);

  return (
    <div className="bg-background flex flex-col items-center gap-[100px] relative min-h-screen w-full" data-name="Cart" data-node-id="264:1523">
      {/* Header */}
      <div className="w-full" data-node-id="264:1524">
        {/* Remove cart icon on cart page */}
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
          // Use a combination of id, color, and size to uniquely identify the item to remove
          const newItems = items.filter((p) => 
            !(p.id === deleteTarget.id && p.color === deleteTarget.color && p.size === deleteTarget.size)
          );
          updateCart(newItems);
          setDeleteTarget(null);
        }}
      />

      {/* Body */}
      <div className="relative flex w-[1440px] flex-col items-center justify-center gap-[10px]" data-node-id="264:1540">
        <p className="absolute left-[100px] top-[72px] w-[330px] text-[20px] tracking-[-0.6px] text-[#a1a1a1]" data-node-id="264:1590">
          {"Home > Products > Cart"}
        </p>

        <Link
          to="/products"
          className="absolute bottom-[72px] left-[100px] z-10 flex items-center rounded-[30px] border border-[hsl(var(--brand-soft))] px-[32px] py-[8px] text-[14px] font-bold text-[hsl(var(--brand-soft))] shadow-[0px_1px_2px_rgba(0,0,0,0.2)]"
          data-node-id="264:1609"
        >
          Back
        </Link>

        <div className="bg-background flex flex-col items-center overflow-clip py-[31px]" data-node-id="264:1541">
          <div className="relative min-h-[600px] w-full max-w-[1440px] flex flex-col items-center pt-[50px] pb-[100px]" data-node-id="264:1542">
            <div className="w-full max-w-[1240px] flex flex-col gap-[40px]">
               <h1 className="text-[40px] font-bold text-primary">YOUR CART</h1>
               
               {items.length === 0 ? (
                 <div className="text-white text-xl">Your cart is empty. <Link to="/products" className="text-primary underline">Go to Products</Link></div>
               ) : (
                 <div className="flex items-start justify-between gap-10">
                   {/* Items List */}
                   <div className="flex-1 flex flex-col gap-6">
                      {items.map((it, idx) => (
                        <CartRow
                          key={`${it.id}-${it.color}-${it.size}-${idx}`}
                          image={it.image}
                          delIcon={imgDelete02}
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
                   <div className="w-[400px] shrink-0 rounded-[23px] border border-[hsl(var(--brand-soft))] bg-card p-6 text-white">
                      <h2 className="text-[28px] font-semibold mb-6">Order Summary</h2>
                      <div className="flex flex-col gap-4 text-xl">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatMoney(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount (-20%)</span>
                          <span className="text-primary">{formatMoney(discount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span>{delivery === 0 ? "Free" : formatMoney(delivery)}</span>
                        </div>
                        
                        <div className="h-px bg-[hsl(var(--brand-soft))] my-2" />
                        
                        <div className="flex justify-between font-bold text-2xl">
                          <span>Total</span>
                          <span>{formatMoney(total)}</span>
                        </div>
                        
                        <button className="mt-6 w-full rounded-xl bg-primary py-4 text-center text-xl font-bold text-[hsl(var(--brand-ink))] hover:opacity-90">
                          Go to Checkout
                        </button>
                      </div>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-[100px] py-[40px]" data-node-id="264:1591">
        <div className="mx-auto flex w-[1240px] flex-col items-center justify-between gap-10">
          <div className="flex w-full items-center justify-between p-[8px]" data-node-id="264:1593">
            <div className="flex items-center gap-[16px]" data-node-id="264:1594">
              <img alt="" className="h-[75px] w-[80px]" src={imgFooterLogo} />
              <p className="text-[64px] font-bold text-primary" data-node-id="264:1606">
                LIFTLY
              </p>
            </div>
            <div className="flex items-center gap-[48px] text-[14px] text-[hsl(var(--figma-text))]" data-node-id="264:1607">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/products" className="font-semibold text-primary underline">
                {" "}
                Products
              </Link>
              <Link to="/articles">Articles</Link>
              <Link to="/plan">Plan</Link>
            </div>
          </div>
          <p className="text-[12px] leading-[20px] text-white/65" data-node-id="264:1608">
            © 2025 Liftly. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}


