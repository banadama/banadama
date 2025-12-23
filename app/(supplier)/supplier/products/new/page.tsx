"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
    { value: "textiles", label: "Textiles & Clothing" },
    { value: "electronics", label: "Electronics" },
    { value: "packaging", label: "Packaging" },
    { value: "food", label: "Food & Beverage" },
    { value: "furniture", label: "Furniture" },
    { value: "other", label: "Other" },
];

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "textiles",
        description: "",
        price: "",
        moq: "",
        rfqEnabled: true,
        groupBuyEnabled: false,
        specifications: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.push("/supplier/products?success=true");
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/supplier/products"
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                    ← Back to Products
                </Link>
                <h1 className="text-2xl font-semibold text-slate-50 mt-2">
                    Add New Product
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    List a product for buyers to purchase
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                    <h2 className="font-medium text-slate-100">Product Information</h2>

                    <div className="space-y-1">
                        <label className="text-xs text-slate-300">Product Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Custom T-Shirts with Logo Print"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-slate-300">Category *</label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-slate-300">Description *</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your product..."
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors resize-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-slate-300">Specifications (optional)</label>
                        <textarea
                            rows={2}
                            value={formData.specifications}
                            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                            placeholder="Materials, sizes, colors available, etc."
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                    <h2 className="font-medium text-slate-100">Pricing & Quantity</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-300">Unit Price (₦) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="15000"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300">Minimum Order Quantity (MOQ)</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.moq}
                                onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                                placeholder="100"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                    <h2 className="font-medium text-slate-100">Selling Options</h2>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.rfqEnabled}
                            onChange={(e) => setFormData({ ...formData, rfqEnabled: e.target.checked })}
                            className="rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                        />
                        <div>
                            <p className="text-sm text-slate-200">Enable RFQ (Request for Quote)</p>
                            <p className="text-xs text-slate-500">
                                Allow buyers to request custom quotes for this product
                            </p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.groupBuyEnabled}
                            onChange={(e) => setFormData({ ...formData, groupBuyEnabled: e.target.checked })}
                            className="rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                        />
                        <div>
                            <p className="text-sm text-slate-200">Enable Group Buy</p>
                            <p className="text-xs text-slate-500">
                                Allow buyers to pool orders to reach MOQ together
                            </p>
                        </div>
                    </label>
                </div>

                {/* Info */}
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-xl">ℹ️</span>
                        <div>
                            <p className="text-sm font-medium text-blue-300">How it works</p>
                            <p className="text-xs text-blue-200 mt-1">
                                Your product will be visible to buyers in the marketplace.
                                When orders come in, Banadama Ops will create Purchase Orders for you.
                                Payment is held in escrow until delivery is confirmed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-lg bg-emerald-500 py-3 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                    <Link
                        href="/supplier/products"
                        className="rounded-lg border border-slate-700 px-6 py-3 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
