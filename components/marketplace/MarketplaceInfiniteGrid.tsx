"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import { UnifiedMarketCard } from "@/components/marketplace/UnifiedMarketCard";
import { Icons } from "@/components/icons/icons";

type Props = {
    context: "MARKETPLACE" | "NEAR_ME" | "GLOBAL";
    initialItems: any[];
    initialPage: number;
    limit: number;
    initialHasMore: boolean;
};

function buildQueryKey(sp: URLSearchParams) {
    const q = new URLSearchParams(sp.toString());
    q.delete("page");
    return q.toString(); // stable key for cache
}

function withPage(sp: URLSearchParams, page: number, limit: number) {
    const q = new URLSearchParams(sp.toString());
    q.set("page", String(page));
    q.set("limit", String(limit));
    return q.toString();
}

export function MarketplaceInfiniteGrid({
    context,
    initialItems,
    initialPage,
    limit,
    initialHasMore,
}: Props) {
    const router = useRouter();
    const sp = useSearchParams();

    const queryKey = React.useMemo(() => buildQueryKey(new URLSearchParams(sp.toString())), [sp]);
    const cacheKey = React.useMemo(() => `bd:market:cache:${context}:${queryKey}`, [context, queryKey]);

    const [items, setItems] = React.useState<any[]>(initialItems ?? []);
    const [page, setPage] = React.useState<number>(initialPage ?? 1);
    const [hasMore, setHasMore] = React.useState<boolean>(initialHasMore ?? false);
    const [loading, setLoading] = React.useState(false);

    const sentinelRef = React.useRef<HTMLDivElement | null>(null);

    // Restore from sessionStorage when user comes back (same query)
    React.useEffect(() => {
        try {
            const raw = sessionStorage.getItem(cacheKey);
            if (!raw) return;
            const data = JSON.parse(raw) as { items: any[]; page: number; hasMore: boolean; scrollY?: number };

            // Only restore if URL filters match (we key by them)
            if (Array.isArray(data.items) && data.items.length) {
                setItems(data.items);
                setPage(data.page || 1);
                setHasMore(Boolean(data.hasMore));
                if (typeof data.scrollY === "number") {
                    requestAnimationFrame(() => window.scrollTo(0, data.scrollY!));
                }
            }
        } catch {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cacheKey]);

    // Persist state on changes
    React.useEffect(() => {
        try {
            const payload = {
                items: items.slice(0, 240), // cap to avoid huge storage
                page,
                hasMore,
                scrollY: typeof window !== "undefined" ? window.scrollY : 0,
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(payload));
        } catch {
            // ignore
        }
    }, [items, page, hasMore, cacheKey]);

    async function loadMore() {
        if (loading || !hasMore) return;
        setLoading(true);

        const nextPage = page + 1;
        try {
            const qs = withPage(new URLSearchParams(sp.toString()), nextPage, limit);
            const res = await apiGet<any>(`/api/marketplace/feed?${qs}`);

            const data = res?.data ?? res;
            const next = data?.items ?? [];
            const more = Boolean(data?.hasMore);

            setItems((prev) => {
                // de-dup by id
                const seen = new Set(prev.map((x: any) => `${x.kind}:${x.id}`));
                const merged = [...prev];
                for (const p of next) if (!seen.has(`${p.kind}:${p.id}`)) merged.push(p);
                return merged;
            });

            setPage(nextPage);
            setHasMore(more);

            // Update URL "page" without scrolling/jumping (preserve state/shareability)
            const p = new URLSearchParams(sp.toString());
            p.set("page", String(nextPage));
            p.set("limit", String(limit));
            router.replace(`?${p.toString()}`, { scroll: false });
        } catch {
            // soft fail: keep UI stable
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }

    // IntersectionObserver trigger
    React.useEffect(() => {
        if (!sentinelRef.current) return;
        const el = sentinelRef.current;

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) loadMore();
            },
            { root: null, rootMargin: "600px", threshold: 0.01 }
        );

        io.observe(el);
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentinelRef.current, hasMore, loading, page, sp]);

    const LoaderIcon = Icons.get("Loader");
    const ChevronRightIcon = Icons.get("ChevronRight");

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 12,
                }}
            >
                {items.map((it: any) => {
                    return (
                        <UnifiedMarketCard
                            key={`${it.kind}:${it.id}`}
                            item={it}
                            from={context === "NEAR_ME" ? "near-me" : context === "GLOBAL" ? "global" : "marketplace"}
                        />
                    );
                })}
            </div>

            <div style={{ display: "grid", placeItems: "center" }}>
                {loading ? (
                    <div className="bd-badge">
                        <LoaderIcon size={14} /> Loading
                    </div>
                ) : hasMore ? (
                    <button className="bd-btn" onClick={loadMore}>
                        <ChevronRightIcon size={18} /> Load more
                    </button>
                ) : (
                    <div style={{ color: "var(--bd-muted)" }}>End of results</div>
                )}
            </div>

            {/* Sentinel */}
            <div ref={sentinelRef} style={{ height: 1 }} />
        </div>
    );
}
