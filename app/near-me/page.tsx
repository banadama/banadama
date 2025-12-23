// app/near-me/page.tsx - Local Marketplace (NG/BD) with Infinite Grid
import { redirect } from "next/navigation";
import { apiGet } from "@/lib/api";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { NearMeLocationFilters } from "@/components/marketplace/NearMeLocationFilters";
import { MarketplaceInfiniteGrid } from "@/components/marketplace/MarketplaceInfiniteGrid";
import { MarketFilters, toQueryString } from "@/components/marketplace/marketFilters";
import { getCategoryIndex } from "@/lib/categoriesCache";
import { Icons } from "@/components/icons/icons";

async function getProducts(filters: MarketFilters, state?: string, city?: string) {
    try {
        const qs = toQueryString(filters);
        const apiQs = new URLSearchParams(qs.replace("?", ""));
        if (state) apiQs.set("state", state);
        if (city) apiQs.set("city", city);

        const res = await apiGet<any>(`/api/marketplace/feed?${apiQs.toString()}`);
        return res?.data ?? res ?? { items: [], total: 0, hasMore: false, page: 1, limit: 24 };
    } catch {
        return { items: [], total: 0, hasMore: false, page: 1, limit: 24 };
    }
}

async function getUserCountry(): Promise<"NG" | "BD"> {
    try {
        const me = await apiGet("/api/user");
        if (me?.country === "BD") return "BD";
        if (me?.country === "NG") return "NG";
    } catch { }
    return "NG"; // Default to Nigeria
}

export default async function NearMePage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const LocationIcon = Icons.get("Location");
    const GlobeIcon = Icons.get("Globe");
    const ClockIcon = Icons.get("Clock");
    const CheckIcon = Icons.get("Check");
    const ShieldIcon = Icons.get("Shield");
    const MapPinIcon = Icons.get("MapPin");

    const params = await searchParams;

    const urlCountry = typeof params?.country === "string" ? params.country : "";
    if (!urlCountry) {
        const userCountry = await getUserCountry();
        redirect(`/near-me?country=${userCountry}`);
    }

    const state = typeof params?.state === "string" ? params.state : undefined;
    const city = typeof params?.city === "string" ? params.city : undefined;

    const filters: MarketFilters = {
        q: typeof params?.q === "string" ? params.q : undefined,
        country: urlCountry as any,
        category: typeof params?.category === "string" ? params.category : undefined,
        supplierType: (params?.supplierType as any) ?? "ANY",
        tick: (params?.tick as any) ?? "ANY",
        mode: (params?.mode as any) ?? "ANY",
        sort: (params?.sort as any) ?? "RELEVANCE",
        page: params?.page ? Number(params.page) : 1,
        limit: params?.limit ? Number(params.limit) : 24,
    };

    const data = await getProducts(filters, state, city);
    const { page, limit, hasMore } = data;
    const initialItems = data.items || [];

    // Enrich with category names
    const idx = await getCategoryIndex();
    const items = initialItems.map((p: any) => ({
        ...p,
        categoryName: idx.bySlug[p.categorySlug || p.category]?.name ?? (p.categorySlug || p.category),
    }));

    const keyParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v && k !== "page") keyParams.set(k, String(v));
    });
    const gridKey = keyParams.toString();

    const countryName = urlCountry === "BD" ? "Bangladesh" : "Nigeria";
    const locationInfo = state ? (city ? `${city}, ${state}` : state) : countryName;

    return (
        <div className="bd-container" style={{ padding: "24px 16px" }}>
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <LocationIcon size={28} />
                    <h1 className="bd-h1">Buy Near Me</h1>
                </div>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Source products locally in {locationInfo} with fast delivery
                </p>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--bd-border)" }}>
                <a href="/near-me?country=NG" className={`bd-btn ${urlCountry === "NG" ? "bd-btn-primary" : ""}`}>
                    <GlobeIcon size={18} /> Nigeria
                </a>
                <a href="/near-me?country=BD" className={`bd-btn ${urlCountry === "BD" ? "bd-btn-primary" : ""}`}>
                    <GlobeIcon size={18} /> Bangladesh
                </a>
            </div>

            <NearMeLocationFilters country={urlCountry as "NG" | "BD"} />

            <div style={{ marginTop: 12 }}>
                <MarketplaceFilters context="NEAR_ME" />
            </div>

            <div style={{ marginTop: 24 }}>
                <MarketplaceInfiniteGrid
                    key={gridKey}
                    context="NEAR_ME"
                    initialItems={items}
                    initialPage={page}
                    limit={limit}
                    initialHasMore={hasMore}
                />
            </div>

            <div className="bd-card bd-card-pad" style={{ marginTop: 40 }}>
                <h3 className="bd-h3" style={{ textAlign: "center" }}>Why Buy Local?</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 20 }}>
                    <div style={{ textAlign: "center" }}>
                        <ClockIcon size={32} style={{ margin: "0 auto 8px" }} />
                        <div style={{ fontWeight: 700 }}>Faster Delivery</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Same-day or next-day</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <CheckIcon size={32} style={{ margin: "0 auto 8px" }} />
                        <div style={{ fontWeight: 700 }}>Lower Costs</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Reduced shipping fees</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <ShieldIcon size={32} style={{ margin: "0 auto 8px" }} />
                        <div style={{ fontWeight: 700 }}>Verified Suppliers</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Trusted local businesses</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <MapPinIcon size={32} style={{ margin: "0 auto 8px" }} />
                        <div style={{ fontWeight: 700 }}>Nearby Pickup</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Collect in person</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
