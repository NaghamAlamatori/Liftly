import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { mcpAsset } from "../lib/publicAssets";

const imgCart = mcpAsset("f43d7e6c-f9e6-4762-9cb1-3928f68d017d");
const imgLogo2 = mcpAsset("1f770d87-8fd8-4838-a76e-ab3fd7e5f012");
const imgStars = mcpAsset("e60163f3-73a8-4e8d-b169-a6fbd54536be");
const imgFooterLogo = mcpAsset("ce02d4eb-3c4d-4cb0-a7b0-3e4322725adc");

function Vector({ className = "" }) {
  return (
    <div className={className} data-name="Vector" data-node-id="160:875">
      <img alt="" className="block h-full w-full max-w-none" src={imgCart} />
    </div>
  );
}

function AddedToCartModal({ onClose, onBuyMore }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className="relative flex h-[330px] w-[620px] max-w-full flex-col items-center justify-between rounded-[20px] bg-[#FFFEFB] px-[54px] py-[53px]"
        role="dialog"
        aria-modal="true"
        aria-label="Added to cart"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-6 top-6 text-black"
        >
          <span className="text-[22px] leading-none">×</span>
        </button>

        <div className="text-center">
          <div className="text-[35px] font-bold leading-[1.15] text-primary">
            The product has been successfully
            <br />
            added to the cart
          </div>
          <div className="mt-6 text-[15px] font-bold text-black">
            You can view the products you added on the user profile
          </div>
        </div>

        <button
          type="button"
          onClick={onBuyMore}
          className="rounded-[30px] bg-primary px-8 py-3 text-[15px] font-bold text-[hsl(var(--brand-ink))] shadow-[0px_16px_24px_rgba(0,0,0,0.18)]"
        >
          Buy More
        </button>
      </div>
    </div>
  );
}

export default function ProductInfoPage() {
  const { id } = useParams();
  const [addedOpen, setAddedOpen] = React.useState(false);
  const navigate = useNavigate();

  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [activeImage, setActiveImage] = React.useState(null);
  const [selectedColor, setSelectedColor] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error: err } = await supabase.from("products").select("*").eq("product_id", id).single();
        if (err) throw err;
        if (mounted) {
          setProduct(data);
          // Set default active image
          if (data.image_1) setActiveImage(data.image_1);
          else if (data.image_2) setActiveImage(data.image_2);
          else if (data.image_3) setActiveImage(data.image_3);
          else if (data.image_4) setActiveImage(data.image_4);
          
          // Set default selections if available
          const c = (data.color || "").split(",").map((s) => s.trim()).filter(Boolean);
          if (c.length > 0) setSelectedColor(c[0]);
          
          const s = (data.size || "").split(",").map((s) => s.trim()).filter(Boolean);
          if (s.length > 0) setSelectedSize(s[0]);
        }
      } catch (e) {
        if (mounted) setError("Product not found");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image_1 || activeImage, // fallback
      color: selectedColor || "Default",
      size: selectedSize || "Default",
      qty: 1
    };

    const cart = JSON.parse(localStorage.getItem("liftly_cart") || "[]");
    const existingIdx = cart.findIndex(
      (item) => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size
    );

    if (existingIdx >= 0) {
      cart[existingIdx].qty += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("liftly_cart", JSON.stringify(cart));
    setAddedOpen(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !product) {
    return <div className="min-h-screen flex items-center justify-center text-white">Product not found.</div>;
  }

  const images = [product.image_1, product.image_2, product.image_3, product.image_4].filter(Boolean);
  const colors = (product.color || "").split(",").map((s) => s.trim()).filter(Boolean);
  const sizes = (product.size || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="bg-background flex flex-col items-center gap-[100px] relative min-h-screen w-full" data-name="Product Info" data-node-id="187:1411">
      {/* Header */}
      <div className="flex w-[1240px] items-center justify-between py-[65px]" data-node-id="187:1412">
        <div className="flex items-center gap-2" data-node-id="187:1413">
          <div className="relative h-[38px] w-[40px]" data-name="logo 2" data-node-id="187:1414">
            <img alt="" className="block h-full w-full max-w-none" src={imgLogo2} />
          </div>
          <p className="text-[24px] font-bold text-primary" data-node-id="187:1425">
            LIFTLY
          </p>
        </div>

        <div className="flex items-center gap-[48px] text-[16px] text-[hsl(var(--figma-text))]" data-node-id="187:1426">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">
            <span className="font-semibold text-primary underline"> Products</span>
          </Link>
          <Link to="/articles">Articles</Link>
          <Link to="/plan">Plan</Link>
        </div>

        <Link to="/cart" className="block">
          <Vector className="relative h-[45px] w-[45px]" />
        </Link>
      </div>

      {/* Body */}
      <div className="relative flex w-[1440px] flex-col items-center justify-center gap-[10px]" data-node-id="187:1428">
        <p className="absolute left-[87px] top-[72px] w-[330px] text-[20px] tracking-[-0.6px] text-[#a1a1a1]" data-node-id="189:1620">
          {`Home > Products > ${product.name}`}
        </p>

        <Link
          to="/products"
          className="absolute bottom-[72px] left-[100px] z-10 flex items-center rounded-[30px] border border-[hsl(var(--brand-soft))] px-[32px] py-[8px] text-[14px] font-bold text-[hsl(var(--brand-soft))] shadow-[0px_1px_2px_rgba(0,0,0,0.2)]"
          data-node-id="187:1470"
        >
          Back
        </Link>

        <div className="bg-background flex flex-col items-center overflow-clip py-[31px]" data-node-id="221:1518">
          <div className="relative h-[978px] w-[1440px]" data-node-id="221:1519">
            <div className="absolute left-[87px] top-[115px] flex items-start gap-[64px]" data-node-id="221:1582">
              {/* Images */}
              <div className="flex items-start gap-[32px]" data-node-id="221:1581">
                <div className="flex w-[92px] flex-col items-start gap-[19px]" data-node-id="221:1520">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative h-[88px] w-full overflow-hidden rounded-[16px] bg-card shadow-[0px_41px_11px_0px_rgba(0,0,0,0),0px_26px_10px_0px_rgba(0,0,0,0.01),0px_15px_9px_0px_rgba(0,0,0,0.03),0px_7px_7px_0px_rgba(0,0,0,0.04),0px_2px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:opacity-80"
                      onClick={() => setActiveImage(src)}
                    >
                      <img alt="" src={src} className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                  ))}
                </div>

                <div className="relative h-[723px] w-[563px] overflow-hidden rounded-[20px] border border-[rgba(254,238,174,0.1)]" data-node-id="221:1528">
                  {activeImage && (
                    <img alt="" src={activeImage} className="absolute inset-0 h-full w-full object-cover" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex w-[412px] flex-col items-start gap-[48px]" data-node-id="221:1529">
                <div className="flex w-full flex-col items-start gap-[32px]" data-node-id="221:1583">
                  <div className="flex w-full flex-col items-start gap-[16px]" data-node-id="221:1530">
                    <div className="flex w-full flex-col items-start gap-[4px]" data-node-id="221:1531">
                      <p className="w-[412px] text-left text-[34px] font-semibold leading-[1.32] tracking-[-1.02px] text-white" data-node-id="221:1532">
                        {product.name}
                      </p>
                      <div className="relative h-[16px] w-[83px]" data-node-id="221:1533">
                        <img alt="" className="block h-full w-full" src={imgStars} />
                      </div>
                    </div>
                    <p className="w-full text-left text-[42px] font-semibold leading-[1.32] tracking-[-1.26px] text-white" data-node-id="221:1539">
                      ${product.price}
                    </p>
                  </div>

                  {/* Color */}
                  {colors.length > 0 && (
                    <div className="flex w-[146px] flex-col items-start gap-[8px]" data-node-id="221:1540">
                      <p className="w-full text-left text-[20px] tracking-[-0.6px] text-white" data-node-id="221:1541">
                        Color
                      </p>
                      <div className="flex w-full items-center gap-[16px] flex-wrap" data-node-id="221:1542">
                        {colors.map((c, idx) => (
                           <div 
                             key={idx} 
                             className={`px-3 py-1 rounded-full border cursor-pointer transition-colors ${
                               selectedColor === c 
                                 ? "bg-primary border-primary text-[hsl(var(--brand-ink))]" 
                                 : "border-white text-white hover:bg-white/10"
                             }`}
                             onClick={() => setSelectedColor(c)}
                           >
                             {c}
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size */}
                  {sizes.length > 0 && (
                    <div className="flex w-[257px] flex-col items-start gap-[8px]" data-node-id="221:1546">
                      <p className="w-full text-left text-[20px] tracking-[-0.6px] text-white" data-node-id="221:1547">
                        Select Size
                      </p>
                      <div className="flex w-full flex-wrap items-start gap-[16px]" data-node-id="221:1548">
                        {sizes.map((s) => (
                          <div 
                            key={s} 
                            className={`flex h-[42px] w-[75px] items-center justify-center rounded-[5px] cursor-pointer transition-colors ${
                              selectedSize === s 
                                ? "bg-primary" 
                                : "bg-[hsl(var(--figma-text))]"
                            }`}
                            onClick={() => setSelectedSize(s)}
                          >
                            <p className={`text-[14px] leading-[1.32] ${selectedSize === s ? "text-[hsl(var(--brand-ink))] font-bold" : "text-black"}`}>{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to cart */}
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-[5px] bg-primary px-[77px] py-[10px] hover:opacity-90 active:scale-95 transition-all"
                    data-node-id="221:1559"
                    onClick={addToCart}
                  >
                    <p
                      className="text-[20px] font-bold leading-[1.32] tracking-[-0.6px] text-[hsl(var(--brand-ink))]"
                      data-node-id="221:1560"
                    >
                      Add to Cart
                    </p>
                  </button>
                </div>

                {/* Details */}
                <div className="flex w-full flex-col items-start gap-[8px]" data-node-id="221:1561">
                  <p className="w-full text-[20px] leading-[1.32] tracking-[-0.6px] text-white" data-node-id="221:1562">
                    Details
                  </p>
                  <div className="w-full text-justify text-[16px] leading-[1.32] tracking-[-0.48px] text-[hsl(var(--figma-text))]/90" data-node-id="221:1563">
                    <p>{product.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-[100px] py-[40px]" data-node-id="187:1444">
        <div className="mx-auto flex w-[1240px] flex-col items-center justify-between gap-10">
          <div className="flex w-full items-center justify-between p-[8px]" data-node-id="187:1446">
            <div className="flex items-center gap-[16px]" data-node-id="187:1447">
              <img alt="" className="h-[75px] w-[80px]" src={imgFooterLogo} />
              <p className="text-[64px] font-bold text-primary" data-node-id="187:1459">
                LIFTLY
              </p>
            </div>
            <div className="flex items-center gap-[48px] text-[14px] text-[hsl(var(--figma-text))]" data-node-id="187:1460">
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
          <p className="text-[12px] leading-[20px] text-white/65" data-node-id="187:1461">
            © 2025 Liftly. All rights reserved.
          </p>
        </div>
      </div>

      {addedOpen ? (
        <AddedToCartModal
          onClose={() => setAddedOpen(false)}
          onBuyMore={() => {
            setAddedOpen(false);
            navigate("/products");
          }}
        />
      ) : null}
    </div>
  );
}


