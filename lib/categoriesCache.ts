import { cache } from "react";
import { apiGet } from "@/lib/api";
import { db } from "@/lib/db";

export type Category = {
    id?: string;
    name: string;
    slug: string;
    enabled?: boolean;
};

type CategoryIndex = {
    bySlug: Record<string, Category>;
    list: Category[];
};

declare global {
    // eslint-disable-next-line no-var
    var __bdCategoryIndex: CategoryIndex | undefined;
}

function normalize(raw: any): Category[] {
    const list = raw?.data?.categories ?? raw?.categories ?? [];
    return (Array.isArray(list) ? list : [])
        .filter((c: any) => c && c.slug && c.name)
        .filter((c: any) => c.enabled !== false)
        .map((c: any) => ({ id: c.id, name: c.name, slug: c.slug, enabled: c.enabled }));
}

/**
 * Server cache (per request) + global cache (warm between requests in same runtime)
 */
export const getCategoryIndex = cache(async (): Promise<CategoryIndex> => {
    if (globalThis.__bdCategoryIndex?.list?.length) return globalThis.__bdCategoryIndex;

    try {
        const categories = await db.category.findMany({
            where: { enabled: true },
            orderBy: { name: "asc" },
        });

        const list = normalize({ categories });

        const bySlug: Record<string, Category> = {};
        for (const c of list) bySlug[c.slug] = c;

        const idx = { list, bySlug };
        globalThis.__bdCategoryIndex = idx;
        return idx;
    } catch (err) {
        console.error("Failed to fetch categories index from DB:", err);
        return { list: [], bySlug: {} };
    }
});

export async function resolveCategoryName(slug?: string | null): Promise<string | null> {
    if (!slug) return null;
    const idx = await getCategoryIndex();
    return idx.bySlug[slug]?.name ?? null;
}
