// components/marketplace/marketFilters.ts - Filter Model (Single Source of Truth)
export type SupplierType = "FACTORY" | "WHOLESALER" | "RETAIL";
export type TickLevel = "NONE" | "GREEN_TICK" | "BLUE_TICK";
export type ListingMode = "BUY_NOW" | "RFQ" | "BOTH";

export type SortKey =
    | "RELEVANCE"
    | "NEWEST"
    | "PRICE_LOW"
    | "PRICE_HIGH"
    | "MOQ_LOW"
    | "LEADTIME_LOW";

export type MarketFilters = {
    q?: string;
    country?: "NG" | "BD";
    category?: string;

    supplierType?: SupplierType | "ANY";
    tick?: TickLevel | "ANY";
    mode?: ListingMode | "ANY";

    sort?: SortKey;
    page?: number;
    limit?: number;
    source?: "ALL" | "PRODUCTS" | "CREATORS_DIGITAL";
};

export function normalizeFilters(input: MarketFilters, ctx: "MARKETPLACE" | "NEAR_ME" | "GLOBAL"): MarketFilters {
    const f: MarketFilters = { ...input };

    // Global is buy-only: force mode != RFQ
    if (ctx === "GLOBAL") {
        if (f.mode === "RFQ") f.mode = "ANY";
    }
    return f;
}

export function toQueryString(filters: MarketFilters) {
    const p = new URLSearchParams();

    const add = (k: string, v?: string) => {
        if (!v) return;
        if (v === "ANY") return;
        p.set(k, v);
    };

    add("q", filters.q);
    add("country", filters.country);
    add("category", filters.category);
    add("supplierType", filters.supplierType as any);
    add("tick", filters.tick as any);
    add("mode", filters.mode as any);
    add("sort", filters.sort);
    add("source", filters.source);

    if (filters.page && filters.page > 1) p.set("page", String(filters.page));
    if (filters.limit) p.set("limit", String(filters.limit));

    const s = p.toString();
    return s ? `?${s}` : "";
}
