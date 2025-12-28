// app/rfq/new/page.tsx - Ultra-Premium RFQ Creation Form
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createRfq } from "@/lib/rfqApi";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";

const CATEGORIES = [
    { value: "textiles", label: "Textiles", icon: Icons.Brush, color: "bg-orange-50 text-orange-600" },
    { value: "electronics", label: "Electronics", icon: Icons.Grid, color: "bg-blue-50 text-blue-600" },
    { value: "packaging", label: "Packaging", icon: Icons.Package, color: "bg-emerald-50 text-emerald-600" },
    { value: "agriculture", label: "Agri & Food", icon: Icons.Leaf, color: "bg-green-50 text-green-600" },
    { value: "machinery", label: "Machinery", icon: Icons.Settings, color: "bg-slate-50 text-slate-600" },
    { value: "chemicals", label: "Chemicals", icon: Icons.Flask, color: "bg-purple-50 text-purple-600" },
    { value: "services", label: "Creators", icon: Icons.Users, color: "bg-pink-50 text-pink-600" },
    { value: "other", label: "Other", icon: Icons.HelpCircle, color: "bg-slate-100 text-slate-400" },
];

const REGIONS = [
    { value: "LAGOS", label: "Lagos, NG", flag: "🇳🇬" },
    { value: "SOUTH_WEST", label: "SW Nigeria", flag: "🇳🇬" },
    { value: "NORTH", label: "North NG", flag: "🇳🇬" },
    { value: "EAST", label: "East NG", flag: "🇳🇬" },
    { value: "BANGLADESH", label: "Dhaka, BD", flag: "🇧🇩" },
    { value: "GLOBAL", label: "Global", flag: "🌐" },
];

const SERVICE_PLANS = [
    { id: "BASIC", name: "Basic Sourcing", price: "Free", desc: "List on marketplace & wait for bids", perks: ["Public Listing", "Standard Bids"] },
    { id: "MANAGED", name: "Managed Ops", price: "₦15,000", desc: "Ops team finds & vets 3 suppliers", perks: ["Verified Quotes", "Escrow Setup", "Lead time: 48h"], popular: true },
    { id: "WHITE_GLOVE", name: "White Glove", price: "₦45,000", desc: "Full QC, logistics & door delivery", perks: ["Personal Agent", "Quality Report", "Freight Booking"] },
];

export default function NewRequestPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams?.get("productId");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [productInfo, setProductInfo] = useState<any | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("textiles");
    const [quantity, setQuantity] = useState(100);
    const [budget, setBudget] = useState(0);
    const [region, setRegion] = useState("LAGOS");
    const [plan, setPlan] = useState("BASIC");

    useEffect(() => {
        if (!productId) return;
        (async () => {
            try {
                const data = await apiGet<any>(`/api/marketplace/products/${productId}`);
                if (data) {
                    setProductInfo(data);
                    setTitle(`Quote Request for ${data.title}`);
                    setCategory(data.categorySlug || "other");
                    if (data.moq) setQuantity(data.moq);
                }
            } catch (err) {
                console.error("Failed to fetch product details", err);
            }
        })();
    }, [productId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await createRfq<any>({
                title,
                description,
                category,
                quantity,
                productSubtotal: budget,
                region,
                productId: productId || undefined,
                servicePlan: plan,
            });

            if (result.success && result.request) {
                router.push(`/rfq/${result.request.id}`);
            } else {
                throw new Error("Submission failed");
            }
        } catch (err: any) {
            setError(err.message || "Failed to create request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-16 pb-40">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 px-4">
                <div className="flex flex-col gap-4">
                    <Link href="/rfq" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors group px-1">
                        <Icons.ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                        Post Sourcing <br /><span className="text-orange-500">Requirement.</span>
                    </h1>
                </div>
                <div className="max-w-sm">
                    <p className="text-slate-500 font-medium text-lg leading-snug">
                        Tell us what you need. Our global network of verified manufacturers is ready to provide custom quotes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-16 items-start px-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">01. Select Category</h2>
                            <Badge variant="accent" className="rounded-lg">Required</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {CATEGORIES.map((c) => {
                                const Icon = c.icon;
                                const isActive = category === c.value;
                                return (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setCategory(c.value)}
                                        className={`group relative flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300 ${isActive ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-500/5 shadow-xl" : "border-slate-100 bg-white hover:border-slate-200 shadow-sm"}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive ? "bg-orange-500 text-white shadow-lg" : `${c.color} group-hover:scale-110`}`}>
                                            <Icon size={20} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-orange-600" : "text-slate-500"}`}>{c.label}</span>
                                        {isActive && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Card className="border-none shadow-premium bg-white rounded-[2.5rem] overflow-hidden">
                        <CardBody className="p-12 flex flex-col gap-10">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">02. Product Specifications</h2>
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Request Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. 10,000 Cotton Canvas Tote Bags for Retail"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Quantity</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                                <Icons.Package size={20} />
                                            </div>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] pl-16 pr-8 py-5 text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Budget (Est ₦)</label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-orange-500 transition-colors">₦</span>
                                            <input
                                                type="number"
                                                value={budget}
                                                onChange={(e) => setBudget(Number(e.target.value))}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] pl-16 pr-8 py-5 text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500/50 outline-none transition-all"
                                                placeholder="Per unit"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Detailed Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Add more details: dimensions, material types, colors, logo placement, packaging needs..."
                                        rows={8}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">03. Final Destination</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                            {REGIONS.map((r) => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => setRegion(r.value)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${region === r.value ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md" : "border-slate-50 bg-white hover:border-slate-200 text-slate-500"}`}
                                >
                                    <span className="text-xl">{r.flag}</span>
                                    <span className="text-[9px] font-black uppercase tracking-tight">{r.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">04. Select Service Level</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {SERVICE_PLANS.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setPlan(s.id)}
                                    className={`relative flex flex-col p-8 rounded-[2rem] border-2 text-left transition-all group ${plan === s.id ? "border-slate-900 bg-slate-900 text-white shadow-2xl" : "border-slate-100 bg-white hover:border-slate-200 text-slate-900"}`}
                                >
                                    {s.popular && (
                                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg ${plan === s.id ? "bg-orange-500 text-white" : "bg-slate-900 text-white"}`}>
                                            Recommended
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black uppercase tracking-tight">{s.name}</span>
                                            <span className={`text-[10px] font-bold ${plan === s.id ? "text-slate-400" : "text-slate-400"}`}>{s.price}</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${plan === s.id ? "border-emerald-500 bg-emerald-500" : "border-slate-200"}`}>
                                            {plan === s.id && <Icons.Check size={12} className="text-white" />}
                                        </div>
                                    </div>
                                    <p className={`text-xs font-medium leading-relaxed mb-6 ${plan === s.id ? "text-slate-300" : "text-slate-500"}`}>{s.desc}</p>
                                    <div className="space-y-3 mt-auto">
                                        {s.perks.map((p, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <Icons.Check size={12} className={plan === s.id ? "text-emerald-400" : "text-emerald-500"} />
                                                <span className={`text-[10px] font-bold ${plan === s.id ? "text-slate-200" : "text-slate-600"}`}>{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex pt-8">
                        <Button
                            type="submit"
                            disabled={loading || !title}
                            className="flex-1 bg-orange-500 text-white font-black py-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all text-sm uppercase tracking-[0.3em] active:scale-95 disabled:opacity-50 group overflow-hidden relative"
                        >
                            <span className="relative z-10">{loading ? "VALIDATING & SAVING..." : "CONFIRM & POST SOURCING REQUEST"}</span>
                            {!loading && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                        </Button>
                    </div>
                </form>

                <div className="flex flex-col gap-8 sticky top-32">
                    <Card className="border-none shadow-premium bg-slate-50 rounded-[2.5rem] overflow-hidden">
                        <CardBody className="p-8">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Live Preview</h4>
                            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <Icons.RFQ size={16} />
                                    </div>
                                    <Badge variant="accent" size="sm" className="rounded-lg text-[8px]">DRAFT</Badge>
                                </div>
                                <h3 className="text-sm font-black text-slate-900 mb-2 truncate">{title || "Your Request Title"}</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 uppercase rounded-md tracking-tighter">{category}</span>
                                    <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 uppercase rounded-md tracking-tighter">{quantity} units</span>
                                    <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 uppercase rounded-md tracking-tighter">{region}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Est. Value</span>
                                    <span className="text-xs font-black text-slate-900">₦{(budget * quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border-none shadow-2xl bg-[#0F172A] text-white rounded-[2.5rem] overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-12 -mt-12" />
                        <CardBody className="p-8 relative z-10">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500">
                                <Icons.ShieldCheck size={24} />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Banadama Protected</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">Your payments stay in escrow until you confirm delivery quality. We protect both buyer and factory.</p>
                            <ul className="space-y-4">
                                {["Verified Supplies Only", "100% Quality Guarantee", "Safe Global Payments"].map((point, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Icons.Check className="text-emerald-500 shrink-0" size={12} />
                                        <span className="text-[10px] font-bold text-slate-300">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
