// app/marketplace/page.tsx - Main Marketplace Page (Infinite Grid)
import { apiGet } from "@/lib/api";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { MarketplaceInfiniteGrid } from "@/components/marketplace/MarketplaceInfiniteGrid";
import { toQueryString, MarketFilters } from "@/components/marketplace/marketFilters";
import { getCategoryIndex } from "@/lib/categoriesCache";
import { Icons } from "@/components/icons/icons";

async function getMarketplaceData(filters: MarketFilters) {
    try {
        const qs = toQueryString(filters);
        const res = await apiGet<any>(`/api/marketplace/feed${qs}`);
        return res?.data ?? res ?? { items: [], total: 0, hasMore: false, page: 1, limit: 24 };
    } catch {
        return { items: [], total: 0, hasMore: false, page: 1, limit: 24 };
    }
}

export default async function MarketplacePage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;

    const filters: MarketFilters = {
        q: typeof params?.q === "string" ? params.q : undefined,
        country: (params?.country as any) ?? undefined,
        category: typeof params?.category === "string" ? params.category : undefined,
        supplierType: (params?.supplierType as any) ?? "ANY",
        tick: (params?.tick as any) ?? "ANY",
        mode: (params?.mode as any) ?? "ANY",
        sort: (params?.sort as any) ?? "RELEVANCE",
        page: params?.page ? Number(params.page) : 1,
        limit: params?.limit ? Number(params.limit) : 24,
        source: (params?.source as any) ?? "ALL",
    };

    const data = await getMarketplaceData(filters);
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

    const Shield = Icons.get("Shield");
    const CheckCircle = Icons.get("Check");
    const Star = Icons.get("Star");
    const Search = Icons.get("Search");

    return (
        <div style={{ background: "var(--bd-bg)" }}>
            {/* Orange Header */}
            <div style={{ background: "linear-gradient(135deg, var(--bd-brand) 0%, #f97316 100%)", borderBottom: "none" }}>
                <div className="bd-container" style={{ padding: "24px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                                <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, color: "white" }}>Marketplace</h1>
                                {data.total && (
                                    <div style={{ background: "rgba(255, 255, 255, 0.25)", color: "white", padding: "6px 14px", borderRadius: 999, fontSize: 14, fontWeight: 700, border: "1px solid rgba(255, 255, 255, 0.3)" }}>
                                        {data.total.toLocaleString()} products
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.95)" }}>
                                Discover quality products from verified suppliers worldwide
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgba(255, 255, 255, 0.2)", borderRadius: 999, border: "1px solid rgba(255, 255, 255, 0.3)", backdropFilter: "blur(10px)" }}>
                                <Shield size={18} style={{ color: "white" }} />
                                <span style={{ fontWeight: 600, fontSize: 14, color: "white" }}>Escrow Protected</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgba(255, 255, 255, 0.2)", borderRadius: 999, border: "1px solid rgba(255, 255, 255, 0.3)", backdropFilter: "blur(10px)" }}>
                                <CheckCircle size={18} style={{ color: "white" }} />
                                <span style={{ fontWeight: 600, fontSize: 14, color: "white" }}>Verified Sellers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Sidebar + Grid */}
            <div className="bd-container" style={{ padding: "24px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 30, alignItems: "start" }}>

                    {/* Left Sidebar - Enhanced Filters */}
                    <aside style={{ position: "sticky", top: 20 }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 12, borderBottom: "2px solid var(--bd-border)" }}>
                                <Search size={20} style={{ color: "var(--bd-brand)" }} />
                                <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Filters</h2>
                            </div>
                        </div>

                        <div style={{
                            background: "white",
                            border: "1px solid var(--bd-border)",
                            borderRadius: 12,
                            padding: 0,
                            maxHeight: "calc(100vh - 240px)",
                            overflowY: "auto",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                        }}>
                            <MarketplaceFilters context="MARKETPLACE" />
                        </div>

                        {/* Enhanced Trust Info */}
                        <div style={{
                            marginTop: 24,
                            padding: 20,
                            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            borderRadius: 12,
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                        }}>
                            <div style={{ fontWeight: 900, marginBottom: 16, fontSize: 15 }}>Why shop on Banadama?</div>
                            <div style={{ display: "grid", gap: 14 }}>
                                <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
                                    <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: 8, borderRadius: 8, flexShrink: 0 }}>
                                        <Shield size={18} style={{ color: "var(--bd-success)", display: "block" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Payment Protection</div>
                                        <div style={{ color: "var(--bd-muted)", fontSize: 13, lineHeight: 1.4 }}>Secure escrow system holds funds safely</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
                                    <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: 8, borderRadius: 8, flexShrink: 0 }}>
                                        <CheckCircle size={18} style={{ color: "var(--bd-success)", display: "block" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Quality Verified</div>
                                        <div style={{ color: "var(--bd-muted)", fontSize: 13, lineHeight: 1.4 }}>All suppliers monitored for quality</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
                                    <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: 8, borderRadius: 8, flexShrink: 0 }}>
                                        <Star size={18} style={{ color: "var(--bd-success)", display: "block" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Best Prices</div>
                                        <div style={{ color: "var(--bd-muted)", fontSize: 13, lineHeight: 1.4 }}>Competitive rates from multiple sellers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content - Products Grid */}
                    <main>
                        <MarketplaceInfiniteGrid
                            key={gridKey}
                            context="MARKETPLACE"
                            initialItems={items}
                            initialPage={page}
                            limit={limit}
                            initialHasMore={hasMore}
                        />
                    </main>

                </div>
            </div>
        </div>
    );
}
