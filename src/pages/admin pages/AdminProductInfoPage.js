import React from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { supabase } from "../../lib/supabaseClient";

const PRODUCT_IMAGES_BUCKET = process.env.REACT_APP_SUPABASE_PRODUCT_IMAGES_BUCKET || "product-images";

function pickPkFallback() {
  return "product_id";
}

export default function AdminProductInfoPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [sp] = useSearchParams();
  const pkCol = sp.get("pk") || pickPkFallback();
  const productId = params.productId;
  const isNew = !productId || productId === "new";

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    price: "",
    color: "",
    size: "",
    category: "",
    image_1: "",
    image_2: "",
    image_3: "",
    image_4: "",
  });

  // Determine which size options to show based on category
  const getSizeOptions = () => {
    const category = form.category;
    if (category.includes("shoes")) {
      return { type: "number", options: [] };
    } else if (category.includes("clothing")) {
      return { type: "dropdown", options: ["XS", "S", "M", "L", "XL", "XXL"] };
    } else if (category === "accessories" || category === "sports-nutrition") {
      return { type: "static", options: [] };
    }
    return { type: "text", options: [] };
  };

  const sizeConfig = getSizeOptions();

  // Track which image slot is being uploaded
  const [uploadingSlot, setUploadingSlot] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setError("");
      if (isNew) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error: err } = await supabase.from("products").select("*").eq(pkCol, productId).maybeSingle();
        if (err) throw err;
        const row = data || {};
        if (!mounted) return;
        setForm({
          name: String(row?.name || ""),
          description: String(row?.description || ""),
          price: row?.price == null ? "" : String(row.price),
          color: String(row?.color || ""),
          size: String(row?.size || ""),
          category: String(row?.category || ""),
          image_1: String(row?.image_1 || ""),
          image_2: String(row?.image_2 || ""),
          image_3: String(row?.image_3 || ""),
          image_4: String(row?.image_4 || ""),
        });
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load product.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isNew, pkCol, productId]);

  async function uploadImageToStorage(file) {
    if (!file) return { ok: false, error: "No file selected." };
    const ext = String(file.name || "").split(".").pop() || "png";
    const safeExt = ext.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "png";
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const path = `products/${id}.${safeExt}`;

    const { error: upErr } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });
    if (upErr) return { ok: false, error: upErr.message || "Upload failed." };

    const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) return { ok: false, error: "Upload succeeded but no public URL was returned." };
    return { ok: true, url: publicUrl };
  }

  const handleImageClick = (slotIndex) => {
    setUploadingSlot(slotIndex);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || uploadingSlot === null) return;
    
    setError("");
    const res = await uploadImageToStorage(file);
    if (!res.ok) {
      setError(res.error || "Upload failed.");
      return;
    }
    
    const fieldName = `image_${uploadingSlot + 1}`;
    setForm((s) => ({ ...s, [fieldName]: res.url }));
    e.target.value = "";
    setUploadingSlot(null);
  };

  async function onSave() {
    setError("");
    setSaving(true);
    try {
      const priceValue = form.price === "" ? null : Number(form.price);
      
      // Validate that price is not negative
      if (priceValue !== null && priceValue < 0) {
        setError("Price cannot be negative.");
        setSaving(false);
        return;
      }

      const sizeValue = String(form.size || "").trim();
      
      // Validate size for shoes (must be non-negative number if provided)
      if (form.category.includes("shoes") && sizeValue) {
        const sizeNum = Number(sizeValue);
        if (isNaN(sizeNum) || sizeNum < 0) {
          setError("Shoe size must be a non-negative number.");
          setSaving(false);
          return;
        }
      }

      const payload = {
        name: String(form.name || "").trim(),
        description: String(form.description || "").trim() || null,
        price: priceValue,
        color: String(form.color || "").trim() || null,
        size: sizeValue || null,
        category: String(form.category || "").trim() || null,
        image_1: String(form.image_1 || "").trim() || null,
        image_2: String(form.image_2 || "").trim() || null,
        image_3: String(form.image_3 || "").trim() || null,
        image_4: String(form.image_4 || "").trim() || null,
      };
      if (!payload.name) {
        setError("Name is required.");
        return;
      }

      if (isNew) {
        const { error: err } = await supabase.from("products").insert(payload);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("products").update(payload).eq(pkCol, productId);
        if (err) throw err;
      }
      navigate("/dashboard/products", { replace: true });
    } catch (e) {
      setError(e?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-background">
      <AdminSidebar />

      <div className="absolute left-[297px] top-[21px] right-[40px]">
        {/* Header / Nav */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="outline" className="h-auto px-6 py-2">
            <Link to="/dashboard/products">Back</Link>
          </Button>
          <div className="text-[20px] tracking-[-0.6px] text-[#a1a1a1]">
            {isNew ? "New Product" : "Edit Product"}
          </div>
          <div />
        </div>

        <div className="flex w-full max-w-[1240px] items-start gap-[64px]">
            {/* Hidden file input for image uploads */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="flex items-start gap-[32px]">
              <div className="flex w-[92px] flex-col gap-[19px]">
                {[0, 1, 2, 3].map((i) => {
                  const imgUrl = form[`image_${i + 1}`];
                  return (
                    <div
                      key={i}
                      className="h-[87px] w-[92px] overflow-hidden rounded-[20px] bg-white/5 cursor-pointer border border-white/10 hover:border-white/30 relative group"
                      onClick={() => handleImageClick(i)}
                      title="Click to upload image"
                    >
                      {imgUrl ? (
                        <img alt="" src={imgUrl} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-white/30">
                          Upload
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="h-[723px] w-[563px] overflow-hidden rounded-[20px] border border-[rgba(254,238,174,0.1)] bg-white/5">
                {form.image_1 ? <img alt="" src={form.image_1} className="h-full w-full object-cover" /> : null}
              </div>
            </div>

            <div className="w-[412px]">
              {loading ? <div className="text-sm text-white/70">Loading…</div> : null}
              {error ? <div className="mb-4 text-sm font-semibold text-[hsl(var(--brand-2))]">{error}</div> : null}

              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[34px] font-semibold tracking-[-1.02px] text-white">Product</div>
                  <div className="mt-2 text-[42px] font-semibold tracking-[-1.26px] text-white">
                    {form.price ? `$${form.price}` : ""}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-[14px] font-semibold text-[hsl(var(--brand-soft))]">Name</div>
                  <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="text-[14px] font-semibold text-[hsl(var(--brand-soft))]">Price</div>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                    placeholder="200"
                    min="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-[14px] font-semibold text-[hsl(var(--brand-soft))]">Category</div>
                  <select
                    className="flex h-10 w-full rounded-[14px] border border-[hsl(var(--brand))] bg-transparent px-3 py-2 text-sm text-foreground shadow-[0px_0px_0px_1px_hsl(var(--brand-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={form.category}
                    onChange={(e) => setForm((s) => ({ ...s, category: e.target.value, size: "" }))}
                  >
                    <option value="" className="bg-[hsl(var(--background))]">Select a category...</option>
                    <option value="mens-shoes" className="bg-[hsl(var(--background))]">Men's Shoes</option>
                    <option value="womens-shoes" className="bg-[hsl(var(--background))]">Women's Shoes</option>
                    <option value="mens-clothing" className="bg-[hsl(var(--background))]">Men's Clothing</option>
                    <option value="womens-clothing" className="bg-[hsl(var(--background))]">Women's Clothing</option>
                    <option value="accessories" className="bg-[hsl(var(--background))]">Accessories</option>
                    <option value="sports-nutrition" className="bg-[hsl(var(--background))]">Sports Nutrition</option>
                  </select>
                </div>

                {/* Conditional Size field based on category */}
                {sizeConfig.type !== "static" && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[14px] font-semibold text-[hsl(var(--brand-soft))]">
                      Size
                      {!form.category && <span className="text-xs text-white/40"> (select category first)</span>}
                    </div>
                    {sizeConfig.type === "number" && (
                      <Input
                        type="number"
                        value={form.size}
                        onChange={(e) => setForm((s) => ({ ...s, size: e.target.value }))}
                        placeholder="e.g. 10"
                        min="0"
                        disabled={!form.category}
                      />
                    )}
                    {sizeConfig.type === "dropdown" && (
                      <select
                        className="flex h-10 w-full rounded-[14px] border border-[hsl(var(--brand))] bg-transparent px-3 py-2 text-sm text-foreground shadow-[0px_0px_0px_1px_hsl(var(--brand-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={form.size}
                        onChange={(e) => setForm((s) => ({ ...s, size: e.target.value }))}
                        disabled={!form.category}
                      >
                        <option value="" className="bg-[hsl(var(--background))]">Select a size...</option>
                        {sizeConfig.options.map((opt) => (
                          <option key={opt} value={opt} className="bg-[hsl(var(--background))]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                    {sizeConfig.type === "text" && (
                      <Input
                        value={form.size}
                        onChange={(e) => setForm((s) => ({ ...s, size: e.target.value }))}
                        placeholder="e.g. S, M, L"
                        disabled={!form.category}
                      />
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="text-[14px] font-semibold text-[hsl(var(--brand-soft))]">Color</div>
                  <Input
                    value={form.color}
                    onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))}
                    placeholder="e.g. Red"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-[14px] font-semibold text-[hsl(var(--brand-soft))]">Details</div>
                  <textarea
                    className="min-h-[140px] w-full rounded-[14px] border border-[hsl(var(--brand))] bg-transparent px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/70 shadow-[0px_0px_0px_1px_hsl(var(--brand-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={form.description}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button type="button" disabled={saving} onClick={onSave}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}