// components/marketplace/MarketplaceFilters.tsx - Premium Dashboard Style
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons/icons";
import { MarketFilters, normalizeFilters, toQueryString, SortKey } from "@/components/marketplace/marketFilters";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { apiGet } from "@/lib/api";
import clsx from "clsx";

export function MarketplaceFilters({ context }: { context: "MARKETPLACE" | "NEAR_ME" | "GLOBAL" }) {
    const router = useRouter();
    const sp = useSearchParams();
    const { showToast } = useToast();

    const [filters, setFilters] = React.useState<MarketFilters>(() => ({
        q: sp.get("q") ?? "",
        country: (sp.get("country") as any) ?? undefined,
        category: sp.get("category") ?? undefined,
        supplierType: (sp.get("supplierType") as any) ?? "ANY",
        tick: (sp.get("tick") as any) ?? "ANY",
        mode: (sp.get("mode") as any) ?? "ANY",
        sort: (sp.get("sort") as SortKey) ?? "RELEVANCE",
        source: (sp.get("source") as any) ?? "ALL",
    }));

    const [categories, setCategories] = React.useState<Array<{ slug: string; name: string }>>([]);

    React.useEffect(() => {
        (async () => {
            try {
                const res = await apiGet("/api/categories");
                const list = res?.items ?? res?.categories ?? res?.data?.categories ?? [];
                setCategories(list.filter((c: any) => c?.enabled !== false));
            } catch {
                setCategories([]);
            }
        })();
    }, []);

    React.useEffect(() => {
        setFilters({
            q: sp.get("q") ?? "",
            country: (sp.get("country") as any) ?? undefined,
            category: sp.get("category") ?? undefined,
            supplierType: (sp.get("supplierType") as any) ?? "ANY",
            tick: (sp.get("tick") as any) ?? "ANY",
            mode: (sp.get("mode") as any) ?? "ANY",
            sort: (sp.get("sort") as any) ?? "RELEVANCE",
            source: (sp.get("source") as any) ?? "ALL",
        });
    }, [sp]);

    function apply(next: MarketFilters) {
        const n = normalizeFilters(next, context);
        if (context === "GLOBAL" && n.mode === "RFQ") {
            showToast("RFQ is not available in Global mode.", "info");
            n.mode = "ANY";
        }
        router.push(toQueryString({ ...n, page: 1 }));
    }

    const Select = ({ label, value, options, onChange, disabled, title }: any) => (
        <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
            <div className="relative group">
                <select
                    className={clsx(
                        "w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2 text-[11px] text-slate-200 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all appearance-none cursor-pointer",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    title={title}
                >
                    {options.map((opt: any) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-orange-500 transition-colors">
                    <Icons.ChevronDown size={14} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-1">
            {/* Search Input */}
            <div className="relative mb-6">
                <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-[11px] text-white placeholder:text-slate-600 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                    placeholder="Search keywords..."
                    value={filters.q ?? ""}
                    onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && apply(filters)}
                />
            </div>

            {/* CreatorsMart Entry */}
            <div
                onClick={() => setFilters({ ...filters, source: filters.source === "CREATORS_DIGITAL" ? "ALL" : "CREATORS_DIGITAL" })}
                className={clsx(
                    "group flex items-center justify-between p-4 rounded-xl border mb-6 cursor-pointer transition-all",
                    filters.source === "CREATORS_DIGITAL"
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                        : "bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-white"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "p-2 rounded-lg transition-colors",
                        filters.source === "CREATORS_DIGITAL" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400"
                    )}>
                        <Icons.Brush size={16} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-tight">CreatorsMart</h3>
                        <p className="text-[9px] opacity-60">Digital Assets</p>
                    </div>
                </div>
                {filters.source === "CREATORS_DIGITAL" && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                        <Icons.Check size={12} className="text-white" />
                    </div>
                )}
            </div>

            {/* Standard Filters */}
            <div className="space-y-1">
                <Select
                    label="Region"
                    value={filters.country}
                    onChange={(v: any) => setFilters({ ...filters, country: v || undefined })}
                    disabled={context === "NEAR_ME"}
                    options={[
                        { label: "Global", value: "" },
                        { label: "Nigeria", value: "NG" },
                        { label: "Bangladesh", value: "BD" },
                    ]}
                />

                <Select
                    label="Category"
                    value={filters.category}
                    onChange={(v: any) => setFilters({ ...filters, category: v || undefined })}
                    options={[
                        { label: "All Categories", value: "" },
                        ...categories.map(c => ({ label: c.name, value: c.slug }))
                    ]}
                />

                <Select
                    label="Type"
                    value={filters.supplierType}
                    onChange={(v: any) => setFilters({ ...filters, supplierType: v })}
                    options={[
                        { label: "All Suppliers", value: "ANY" },
                        { label: "Factory Direct", value: "FACTORY" },
                        { label: "Wholesaler", value: "WHOLESALER" },
                    ]}
                />
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <button
                    onClick={() => apply(filters)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black py-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all uppercase tracking-widest"
                >
                    Update Feed
                </button>
                <button
                    onClick={() => {
                        const empty = { q: "", country: undefined, category: undefined, supplierType: "ANY", tick: "ANY", mode: "ANY", sort: "RELEVANCE", source: "ALL" };
                        setFilters(empty as any);
                        router.push(toQueryString(empty as any));
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-slate-400 text-[11px] font-bold py-3 rounded-xl transition-all"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
}

