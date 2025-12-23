// components/marketplace/MarketplaceFilters.tsx - Marketplace Filters UI
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons/icons";
import { MarketFilters, normalizeFilters, toQueryString, SortKey } from "@/components/marketplace/marketFilters";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { apiGet } from "@/lib/api";

export function MarketplaceFilters({ context }: { context: "MARKETPLACE" | "NEAR_ME" | "GLOBAL" }) {
    const router = useRouter();
    const sp = useSearchParams();
    const toast = useToast();

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

    // Load categories from API
    React.useEffect(() => {
        (async () => {
            try {
                const res = await apiGet("/api/categories");
                const list = res?.data?.categories ?? res?.categories ?? [];
                setCategories(list.filter((c: any) => c?.enabled !== false));
            } catch {
                setCategories([]);
            }
        })();
    }, []);

    // Sync filters with URL (for back/forward navigation)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sp]);

    function apply(next: MarketFilters) {
        const n = normalizeFilters(next, context);

        if (context === "GLOBAL" && n.mode === "RFQ") {
            toast.push({ type: "info", title: "Global market is buy-only", message: "RFQ is not available in Global mode." });
            n.mode = "ANY";
        }

        router.push(toQueryString({ ...n, page: 1 }));
    }

    function reset() {
        setFilters({
            q: "",
            country: undefined,
            category: undefined,
            supplierType: "ANY",
            tick: "ANY",
            mode: "ANY",
            sort: "RELEVANCE",
            source: "ALL",
        });
        router.push("");
    }

    const FilterIcon = Icons.get("Filter");
    const XIcon = Icons.get("X");
    const SearchIcon = Icons.get("Search");

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 950, display: "flex", gap: 8, alignItems: "center" }}>
                    <FilterIcon size={18} /> Filters
                </div>
                <button className="bd-btn" onClick={reset}>
                    <XIcon size={18} /> Reset
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 10 }}>
                <input
                    className="bd-input"
                    placeholder="Search products"
                    value={filters.q ?? ""}
                    onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                    style={{ gridColumn: "span 2" }}
                />

                <select
                    className="bd-input"
                    value={filters.country ?? ""}
                    onChange={(e) => setFilters({ ...filters, country: (e.target.value || undefined) as any })}
                    disabled={context === "NEAR_ME"}
                    title={context === "NEAR_ME" ? "Near Me is locked to your local country" : ""}
                >
                    <option value="">Country</option>
                    <option value="NG">Nigeria</option>
                    <option value="BD">Bangladesh</option>
                </select>

                <select
                    className="bd-input"
                    value={filters.category ?? ""}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                >
                    <option value="">Category</option>
                    {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                </select>

                <select className="bd-input" value={filters.supplierType ?? "ANY"} onChange={(e) => setFilters({ ...filters, supplierType: e.target.value as any })}>
                    <option value="ANY">Supplier type</option>
                    <option value="FACTORY">Factory</option>
                    <option value="WHOLESALER">Wholesaler</option>
                    <option value="RETAIL">Retail</option>
                </select>

                <select className="bd-input" value={filters.tick ?? "ANY"} onChange={(e) => setFilters({ ...filters, tick: e.target.value as any })}>
                    <option value="ANY">Verification</option>
                    <option value="GREEN_TICK">Green tick</option>
                    <option value="BLUE_TICK">Blue tick</option>
                    <option value="NONE">No tick</option>
                </select>

                <select
                    className="bd-input"
                    value={filters.mode ?? "ANY"}
                    onChange={(e) => setFilters({ ...filters, mode: e.target.value as any })}
                    disabled={context === "GLOBAL"}
                    title={context === "GLOBAL" ? "Global mode is buy-only" : ""}
                >
                    <option value="ANY">Mode</option>
                    <option value="BUY_NOW">Buy Now</option>
                    {context !== "GLOBAL" ? <option value="RFQ">RFQ</option> : null}
                    {context !== "GLOBAL" ? <option value="BOTH">Both</option> : null}
                </select>

                <select className="bd-input" value={filters.source ?? "ALL"} onChange={(e) => setFilters({ ...filters, source: e.target.value as any })}>
                    <option value="ALL">Source: All</option>
                    <option value="PRODUCTS">Source: Products</option>
                    <option value="CREATORS_DIGITAL">Source: Creators (Digital)</option>
                </select>

                <select className="bd-input" value={filters.sort ?? "RELEVANCE"} onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}>
                    <option value="RELEVANCE">Sort: Relevance</option>
                    <option value="NEWEST">Newest</option>
                    <option value="PRICE_LOW">Price: Low to High</option>
                    <option value="PRICE_HIGH">Price: High to Low</option>
                    <option value="MOQ_LOW">MOQ: Low to High</option>
                    <option value="LEADTIME_LOW">Lead time: Low to High</option>
                </select>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="bd-btn bd-btn-primary" onClick={() => apply(filters)} style={{ justifyContent: "center" }}>
                    <SearchIcon size={18} /> Apply
                </button>
            </div>
        </div>
    );
}
