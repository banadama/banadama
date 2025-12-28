"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import { UnifiedMarketCard } from "@/components/marketplace/UnifiedMarketCard";
import { Icons } from "@/components/icons/icons";
import { Button } from "../ui/Button";

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
    return q.toString();
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

    React.useEffect(() => {
        try {
            const raw = sessionStorage.getItem(cacheKey);
            if (!raw) return;
            const data = JSON.parse(raw) as { items: any[]; page: number; hasMore: boolean; scrollY?: number };
            if (Array.isArray(data.items) && data.items.length) {
                setItems(data.items);
                setPage(data.page || 1);
                setHasMore(Boolean(data.hasMore));
                if (typeof data.scrollY === "number") {
                    requestAnimationFrame(() => window.scrollTo(0, data.scrollY!));
                }
            }
        } catch { }
    }, [cacheKey]);

    React.useEffect(() => {
        try {
            const payload = {
                items: items.slice(0, 240),
                page,
                hasMore,
                scrollY: typeof window !== "undefined" ? window.scrollY : 0,
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(payload));
        } catch { }
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
                const seen = new Set(prev.map((x: any) => `${x.kind}:${x.id}`));
                const merged = [...prev];
                for (const p of next) if (!seen.has(`${p.kind}:${p.id}`)) merged.push(p);
                return merged;
            });
            setPage(nextPage);
            setHasMore(more);
            const p = new URLSearchParams(sp.toString());
            p.set("page", String(nextPage));
            p.set("limit", String(limit));
            router.replace(`?${p.toString()}`, { scroll: false });
        } catch {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (!sentinelRef.current) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) loadMore();
            },
            { root: null, rootMargin: "600px", threshold: 0.01 }
        );
        io.observe(sentinelRef.current);
        return () => io.disconnect();
    }, [hasMore, loading, page, sp]);

    return (
        <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {items.map((it: any) => (
                    <UnifiedMarketCard
                        key={`${it.kind}:${it.id}`}
                        item={it}
                        from={context === "NEAR_ME" ? "near-me" : context === "GLOBAL" ? "global" : "marketplace"}
                    />
                ))}
            </div>

            <div className="flex justify-center py-10">
                {loading ? (
                    <div className="flex items-center gap-3 text-orange-500 font-bold bg-orange-50 px-6 py-3 rounded-2xl animate-pulse">
                        <Icons.Loader className="animate-spin" size={20} />
                        Sourcing more items...
                    </div>
                ) : hasMore ? (
                    <Button
                        variant="glass"
                        className="px-10 py-6 text-slate-600 font-black rounded-2xl border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                        onClick={loadMore}
                    >
                        Load more results
                    </Button>
                ) : (
                    <div className="text-slate-400 font-bold text-sm bg-slate-50 px-8 py-3 rounded-2xl border border-slate-100 italic">
                        You've reached the end of the marketplace.
                    </div>
                )}
            </div>

            {/* Sentinel */}
            <div ref={sentinelRef} className="h-4" />
        </div>
    );
}
