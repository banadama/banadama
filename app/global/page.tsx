// app/global/page.tsx - Global Marketplace (Infinite Grid)
import { apiGet } from "@/lib/api";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { MarketplaceInfiniteGrid } from "@/components/marketplace/MarketplaceInfiniteGrid";
import { Icons } from "@/components/icons/icons";
import { getCategoryIndex } from "@/lib/categoriesCache";
import { toQueryString, MarketFilters } from "@/components/marketplace/marketFilters";

async function getGlobalProducts(filters: MarketFilters) {
    try {
        const qs = toQueryString({ ...filters, mode: "BUY_NOW" });
        const res = await apiGet<any>(`/api/marketplace/feed${qs}${qs ? "&" : "?"}globalOnly=true`);
        return res?.data ?? res ?? { items: [], total: 0, hasMore: false, page: 1, limit: 24 };
    } catch {
        return { items: [], total: 0, hasMore: false, page: 1, limit: 24 };
    }
}

export default async function GlobalPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const GlobeIcon = Icons.get("Globe");
    const ShieldIcon = Icons.get("Shield");

    const params = await searchParams;

    const filters: MarketFilters = {
        q: typeof params?.q === "string" ? params.q : undefined,
        country: (params?.country as any) ?? undefined,
        category: typeof params?.category === "string" ? params.category : undefined,
        supplierType: (params?.supplierType as any) ?? "ANY",
        tick: (params?.tick as any) ?? "ANY",
        mode: "BUY_NOW", // Enforced
        sort: (params?.sort as any) ?? "RELEVANCE",
        page: params?.page ? Number(params.page) : 1,
        limit: params?.limit ? Number(params.limit) : 24,
    };

    const data = await getGlobalProducts(filters);
    const { page, limit, hasMore } = data;
    const initialItems = data.items || [];

    // Enrich with category names
    const idx = await getCategoryIndex();
    const items = initialItems.map((p: any) => ({
        ...p,
        categoryName: idx.bySlug[p.categorySlug || p.category]?.name ?? (p.categorySlug || p.category),
    }));

    // Key by current query (filters), excluding page
    const keyParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v && k !== "page") keyParams.set(k, String(v));
    });
    const gridKey = keyParams.toString();

    return (
        <div className="bd-container bd-page">
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <GlobeIcon size={24} />
                    <span className="bd-badge bd-badge-success">Global</span>
                </div>
                <h1 className="bd-h1">Global Market</h1>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Source products and digital services from verified suppliers worldwide.
                </p>
            </div>

            <div className="bd-card bd-card-pad" style={{ marginBottom: 24, background: "var(--bd-muted-bg)", display: "flex", gap: 16, alignItems: "center" }}>
                <ShieldIcon size={32} />
                <div>
                    <div style={{ fontWeight: 700 }}>Global Buy-Only Mode</div>
                    <p className="bd-small" style={{ opacity: 0.7 }}>RFQ is disabled for international orders to ensure secure escrow payments.</p>
                </div>
            </div>

            <MarketplaceFilters context="GLOBAL" />

            <div style={{ marginTop: 24 }}>
                <MarketplaceInfiniteGrid
                    key={gridKey}
                    context="GLOBAL"
                    initialItems={items}
                    initialPage={page}
                    limit={limit}
                    initialHasMore={hasMore}
                />
            </div>
        </div>
    );
}
