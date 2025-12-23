// components/marketplace/applyClientFilters.ts - Client-side Filtering & Sorting
import { MarketFilters, SortKey } from "@/components/marketplace/marketFilters";

export function applyClientFilters(products: any[], f: MarketFilters, ctx: "MARKETPLACE" | "NEAR_ME" | "GLOBAL") {
    let list = [...(products ?? [])];

    // Filters
    if (f.q) {
        const q = f.q.toLowerCase();
        list = list.filter((p) =>
            String(p.title ?? "").toLowerCase().includes(q) ||
            String(p.categorySlug ?? "").toLowerCase().includes(q) ||
            String(p.supplierName ?? "").toLowerCase().includes(q)
        );
    }
    if (f.country) list = list.filter((p) => p.country === f.country);
    if (f.category) list = list.filter((p) => String(p.categorySlug) === f.category);

    if (f.supplierType && f.supplierType !== "ANY") list = list.filter((p) => p.supplierType === f.supplierType);
    if (f.tick && f.tick !== "ANY") list = list.filter((p) => (p.supplierTick ?? "NONE") === f.tick);

    if (ctx !== "GLOBAL" && f.mode && f.mode !== "ANY") {
        list = list.filter((p) => {
            const buy = Boolean(p.buyNowEnabled);
            const rfq = Boolean(p.rfqEnabled);
            const m = buy && rfq ? "BOTH" : buy ? "BUY_NOW" : "RFQ";
            return m === f.mode;
        });
    }

    // Sorting
    const s: SortKey = (f.sort ?? "RELEVANCE") as any;

    const num = (x: any) => (typeof x === "number" ? x : x ? Number(x) : NaN);

    if (s === "NEWEST") {
        list.sort((a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0));
    } else if (s === "PRICE_LOW") {
        list.sort((a, b) => (num(a.buyNowPrice) || Infinity) - (num(b.buyNowPrice) || Infinity));
    } else if (s === "PRICE_HIGH") {
        list.sort((a, b) => (num(b.buyNowPrice) || -Infinity) - (num(a.buyNowPrice) || -Infinity));
    } else if (s === "MOQ_LOW") {
        list.sort((a, b) => (num(a.moq) || Infinity) - (num(b.moq) || Infinity));
    } else if (s === "LEADTIME_LOW") {
        list.sort((a, b) => (num(a.leadTimeDays) || Infinity) - (num(b.leadTimeDays) || Infinity));
    }

    return list;
}
