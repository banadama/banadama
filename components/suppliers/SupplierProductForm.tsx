// components/suppliers/SupplierProductForm.tsx - Unified Supplier Product Form
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";

type Mode = "BUY_NOW" | "RFQ" | "BOTH";
type Country = "NG" | "BD";

export function SupplierProductForm({
    mode,
    productId,
    basePath,
}: {
    mode: "create" | "edit";
    productId?: string;
    basePath: string; // e.g. "/retail/products" or "/factory/products"
}) {
    const router = useRouter();
    const toast = useToast();

    const [loading, setLoading] = React.useState(false);
    const [cats, setCats] = React.useState<Array<{ slug: string; name: string }>>([]);

    const [form, setForm] = React.useState<any>({
        title: "",
        categorySlug: "",
        country: "NG" as Country,
        listingMode: "BOTH" as Mode,
        moq: "1",
        buyNowPrice: "",
        currency: "USD",
        leadTimeDays: "",
        images: [""] as string[],
        description: "",
    });

    // Load categories (public endpoint recommended)
    React.useEffect(() => {
        (async () => {
            try {
                const res = await apiGet("/api/categories");
                setCats(res?.categories ?? []);
            } catch {
                // fallback: still usable
                setCats([
                    { slug: "textile", name: "Textile" },
                    { slug: "packaging", name: "Packaging" },
                    { slug: "footwear", name: "Footwear" },
                    { slug: "home-textile", name: "Home Textile" },
                    { slug: "fashion", name: "Fashion" },
                ]);
            }
        })();
    }, []);

    // Load existing product for edit
    React.useEffect(() => {
        if (mode !== "edit" || !productId) return;
        (async () => {
            setLoading(true);
            try {
                const p = await apiGet(`/api/supplier/products/${productId}`);
                setForm((f: any) => ({
                    ...f,
                    title: p?.title ?? "",
                    categorySlug: p?.categorySlug ?? "",
                    country: (p?.country ?? "NG") as Country,
                    listingMode: toListingMode(p?.buyNowEnabled, p?.rfqEnabled),
                    moq: String(p?.moq ?? "1"),
                    buyNowPrice: p?.buyNowPrice ? String(p.buyNowPrice) : "",
                    currency: p?.currency ?? "USD",
                    leadTimeDays: p?.leadTimeDays ? String(p.leadTimeDays) : "",
                    images: (p?.images?.length ? p.images : [""]) as string[],
                    description: p?.description ?? "",
                }));
            } catch {
                toast.push({ type: "error", title: "Load failed", message: "Unable to load product." });
            } finally {
                setLoading(false);
            }
        })();
    }, [mode, productId]);

    function toListingMode(buyNowEnabled?: boolean, rfqEnabled?: boolean): Mode {
        if (buyNowEnabled && rfqEnabled) return "BOTH";
        if (buyNowEnabled) return "BUY_NOW";
        return "RFQ";
    }

    function computeFlags(m: Mode) {
        return {
            buyNowEnabled: m === "BUY_NOW" || m === "BOTH",
            rfqEnabled: m === "RFQ" || m === "BOTH",
        };
    }

    function setImage(i: number, v: string) {
        setForm((f: any) => {
            const next = [...f.images];
            next[i] = v;
            return { ...f, images: next };
        });
    }

    function addImage() {
        setForm((f: any) => ({ ...f, images: [...f.images, ""] }));
    }

    function removeImage(i: number) {
        setForm((f: any) => ({ ...f, images: f.images.filter((_: any, idx: number) => idx !== i) }));
    }

    async function submit() {
        if (loading) return;

        if (!form.title.trim()) {
            toast.push({ type: "warning", title: "Missing title", message: "Enter product title." });
            return;
        }
        if (!form.categorySlug) {
            toast.push({ type: "warning", title: "Missing category", message: "Select category." });
            return;
        }

        const flags = computeFlags(form.listingMode as Mode);

        // Buy Now requires price
        if (flags.buyNowEnabled && !String(form.buyNowPrice).trim()) {
            toast.push({ type: "warning", title: "Missing price", message: "Buy Now requires a fixed price." });
            return;
        }

        const payload = {
            title: form.title,
            categorySlug: form.categorySlug,
            country: form.country,
            moq: Number(form.moq || 1),
            description: form.description,
            images: (form.images ?? []).filter((x: string) => x.trim()),
            leadTimeDays: form.leadTimeDays ? Number(form.leadTimeDays) : null,

            ...flags,
            currency: form.currency,
            buyNowPrice: flags.buyNowEnabled ? Number(form.buyNowPrice) : null,
        };

        setLoading(true);
        try {
            if (mode === "create") {
                await apiPost("/api/supplier/products", payload);
                toast.push({ type: "success", title: "Created", message: "Product created successfully." });
            } else {
                await apiPatch(`/api/supplier/products/${productId}`, payload);
                toast.push({ type: "success", title: "Saved", message: "Product updated successfully." });
            }
            router.push(basePath);
        } catch {
            toast.push({ type: "error", title: "Save failed", message: "Unable to save product. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <div>
                        <div style={{ fontWeight: 950, fontSize: 20 }}>{mode === "create" ? "New Product" : "Edit Product"}</div>
                        <div style={{ color: "var(--bd-muted)", marginTop: 4 }}>Set Buy Now, RFQ, or Both for this product.</div>
                    </div>
                    <button className="bd-btn bd-btn-primary" onClick={submit} disabled={loading}>
                        <Icons.Check size={18} /> {loading ? "Saving..." : "Save"}
                    </button>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                    <input className="bd-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <select className="bd-input" value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}>
                            <option value="">Select category...</option>
                            {cats.map((c) => (
                                <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                        </select>

                        <select className="bd-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                            <option value="NG">Nigeria</option>
                            <option value="BD">Bangladesh</option>
                        </select>
                    </div>

                    {/* Listing mode */}
                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                        <div style={{ fontWeight: 950, marginBottom: 10 }}>Listing Mode</div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <ModeButton value="BUY_NOW" current={form.listingMode} onChange={(v) => setForm({ ...form, listingMode: v })} label="Buy Now" icon="Cart" />
                            <ModeButton value="RFQ" current={form.listingMode} onChange={(v) => setForm({ ...form, listingMode: v })} label="RFQ" icon="Document" />
                            <ModeButton value="BOTH" current={form.listingMode} onChange={(v) => setForm({ ...form, listingMode: v })} label="Both" icon="Package" />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        <input className="bd-input" placeholder="MOQ" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} />
                        <input className="bd-input" placeholder="Lead time (days)" value={form.leadTimeDays} onChange={(e) => setForm({ ...form, leadTimeDays: e.target.value })} />
                        <select className="bd-input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                            <option value="USD">USD</option>
                            <option value="NGN">NGN</option>
                            <option value="BDT">BDT</option>
                        </select>
                    </div>

                    {/* Buy now price required only if buyNow enabled */}
                    {((form.listingMode as Mode) === "BUY_NOW" || (form.listingMode as Mode) === "BOTH") ? (
                        <input className="bd-input" placeholder="Buy Now price" value={form.buyNowPrice} onChange={(e) => setForm({ ...form, buyNowPrice: e.target.value })} />
                    ) : (
                        <div className="bd-badge">
                            <Icons.Document size={14} /> RFQ-only listing (fixed price not required)
                        </div>
                    )}

                    <textarea
                        className="bd-input"
                        style={{ minHeight: 110, paddingTop: 10 }}
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    {/* Images */}
                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
                            <div style={{ fontWeight: 950 }}>Images</div>
                            <button className="bd-btn" type="button" onClick={addImage}>
                                <Icons.Plus size={18} /> Add
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: 10 }}>
                            {form.images.map((src: string, i: number) => (
                                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                                    <input
                                        className="bd-input"
                                        placeholder="Image URL"
                                        value={src}
                                        onChange={(e) => setImage(i, e.target.value)}
                                    />
                                    <button className="bd-btn" type="button" onClick={() => removeImage(i)} disabled={form.images.length <= 1}>
                                        <Icons.X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <a className="bd-btn" href={basePath}>
                            <Icons.ChevronLeft size={18} /> Cancel
                        </a>
                        <button className="bd-btn bd-btn-primary" onClick={submit} disabled={loading} style={{ justifyContent: "center" }}>
                            <Icons.Check size={18} /> {loading ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModeButton({
    value,
    current,
    onChange,
    label,
    icon,
}: {
    value: Mode;
    current: Mode;
    onChange: (v: Mode) => void;
    label: string;
    icon: "Cart" | "Document" | "Package";
}) {
    const active = value === current;
    const Icon =
        icon === "Cart" ? Icons.Cart :
            icon === "Document" ? Icons.Document :
                Icons.Package;

    return (
        <button
            type="button"
            className={active ? "bd-btn bd-btn-primary" : "bd-btn"}
            onClick={() => onChange(value)}
            style={{ justifyContent: "center" }}
        >
            <Icon size={18} /> {label}
        </button>
    );
}
