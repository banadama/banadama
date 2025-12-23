"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createRfq } from "@/lib/rfqApi";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";

const CATEGORIES = [
    { value: "textiles", label: "Textiles & Fabrics" },
    { value: "electronics", label: "Electronics" },
    { value: "packaging", label: "Packaging Materials" },
    { value: "agriculture", label: "Agriculture & Food" },
    { value: "machinery", label: "Machinery & Equipment" },
    { value: "chemicals", label: "Chemicals & Raw Materials" },
    { value: "services", label: "Services / Creators" },
    { value: "other", label: "Other" },
];

const SERVICE_PLANS = [
    { value: "BASIC", label: "Basic", desc: "Standard processing" },
    { value: "STANDARD", label: "Standard", desc: "Priority support + tracking" },
    { value: "PREMIUM", label: "Premium", desc: "Dedicated agent + insurance" },
];

interface ProductInfo {
    id: string;
    name?: string;
    title?: string;
    categorySlug?: string;
    moq?: number;
    unitPrice?: number;
    supplierName?: string;
}

export default function NewRequestPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams?.get("productId");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("textiles");
    const [quantity, setQuantity] = useState(100);
    const [servicePlan, setServicePlan] = useState("BASIC");
    const [productSubtotal, setProductSubtotal] = useState(50000);
    const [region, setRegion] = useState("LAGOS");

    // Prefill from product if productId is provided
    useEffect(() => {
        if (!productId) return;
        setLoadingProduct(true);
        (async () => {
            try {
                // Try to fetch product info for prefill
                const data = await apiGet<any>("/api/marketplace/products?limit=100");
                const products = data.products || [];
                const found = products.find((p: any) => p.id === productId || p.slug === productId);

                if (found) {
                    setProductInfo(found);
                    // Prefill form fields
                    setTitle(`Quote Request: ${found.name || found.title || ""}`);
                    if (found.categorySlug) setCategory(found.categorySlug);
                    if (found.moq) setQuantity(found.moq);
                    if (found.unitPrice && found.moq) {
                        setProductSubtotal(found.unitPrice * found.moq);
                    }
                }
            } catch {
                // Silent fail - just don't prefill
            } finally {
                setLoadingProduct(false);
            }
        })();
    }, [productId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Uses rfqApi helper with automatic fallback from /api/rfq to /api/requests
            const result = await createRfq<any>({
                title,
                description,
                category,
                quantity,
                servicePlan,
                productSubtotal,
                region,
                productId: productId || undefined,
            });

            if (result.success && result.request) {
                router.push(`/buyer/requests/${result.request.id}`);
            } else {
                throw new Error(result.error || "Failed to create request");
            }
        } catch (err: any) {
            setError(err.message || "Failed to create request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <Link href="/buyer/requests" className="text-sm text-emerald-400 hover:text-emerald-300">
                    ← Back to Requests
                </Link>
                <h1 className="text-2xl font-semibold text-slate-50 mt-4">Create New RFQ</h1>
                <p className="text-sm text-slate-400 mt-1">Request a quote from our verified suppliers</p>
            </div>

            {/* Product Prefill Banner */}
            {productId && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    {loadingProduct ? (
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Icons.Package size={20} />
                            <span className="text-sm">Loading product info...</span>
                        </div>
                    ) : productInfo ? (
                        <div className="flex items-center gap-3">
                            <Icons.Product size={20} className="text-emerald-400" />
                            <div>
                                <p className="text-sm font-medium text-emerald-400">
                                    Requesting quote for: {productInfo.name || productInfo.title}
                                </p>
                                {productInfo.supplierName && (
                                    <p className="text-xs text-emerald-400/70">Supplier: {productInfo.supplierName}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Icons.RFQ size={20} />
                            <span className="text-sm">Requesting quote for product: {productId}</span>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                    <h3 className="font-medium text-slate-100">Request Details</h3>

                    <div>
                        <label className="block text-sm text-slate-300 mb-1">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Custom T-Shirts for Event"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your requirements in detail..."
                            rows={4}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Quantity *</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                min={1}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Estimated Budget (₦)</label>
                            <input
                                type="number"
                                value={productSubtotal}
                                onChange={(e) => setProductSubtotal(parseInt(e.target.value) || 0)}
                                min={0}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Delivery Region</label>
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            >
                                <option value="LAGOS">Lagos</option>
                                <option value="SOUTH_WEST">South West Nigeria</option>
                                <option value="NORTH">Northern Nigeria</option>
                                <option value="EAST">Eastern Nigeria</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Service Plan */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="font-medium text-slate-100 mb-4">Service Plan</h3>
                    <div className="grid gap-3">
                        {SERVICE_PLANS.map((plan) => (
                            <label
                                key={plan.value}
                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${servicePlan === plan.value
                                    ? "border-emerald-500 bg-emerald-500/10"
                                    : "border-slate-700 hover:border-slate-600"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="servicePlan"
                                    value={plan.value}
                                    checked={servicePlan === plan.value}
                                    onChange={(e) => setServicePlan(e.target.value)}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 ${servicePlan === plan.value ? "border-emerald-500 bg-emerald-500" : "border-slate-500"
                                    }`} />
                                <div>
                                    <p className="font-medium text-slate-100">{plan.label}</p>
                                    <p className="text-xs text-slate-400">{plan.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || !title}
                        className="flex-1 rounded-lg bg-emerald-500 py-3 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                    <Link
                        href="/buyer/requests"
                        className="rounded-lg border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:border-slate-600 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
