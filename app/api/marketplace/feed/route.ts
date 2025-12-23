import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type SortKey = "RELEVANCE" | "NEWEST" | "PRICE_LOW" | "PRICE_HIGH";
type SourceKey = "ALL" | "PRODUCTS" | "CREATORS_DIGITAL";

function toInt(v: string | null, def: number) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : def;
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function normCountry(v: string | null) {
    const c = (v || "").toUpperCase();
    return c === "NG" || c === "BD" ? c : null;
}

function normSort(v: string | null): SortKey {
    const s = (v || "RELEVANCE").toUpperCase();
    return (["RELEVANCE", "NEWEST", "PRICE_LOW", "PRICE_HIGH"] as const).includes(s as any) ? (s as SortKey) : "RELEVANCE";
}

function normSource(v: string | null): SourceKey {
    const s = (v || "ALL").toUpperCase();
    return (["ALL", "PRODUCTS", "CREATORS_DIGITAL"] as const).includes(s as any) ? (s as SourceKey) : "ALL";
}

function safeStr(v: string | null) {
    const t = v?.trim();
    return t ? t : null;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const q = safeStr(searchParams.get("q"));
    const country = normCountry(searchParams.get("country"));
    const category = safeStr(searchParams.get("category"));
    const sort = normSort(searchParams.get("sort"));
    const source = normSource(searchParams.get("source"));

    const page = toInt(searchParams.get("page"), 1);
    const limit = clamp(toInt(searchParams.get("limit"), 24), 1, 60);
    const offset = (page - 1) * limit;

    const supplierType = safeStr(searchParams.get("supplierType"))?.toUpperCase() ?? null;
    const tick = safeStr(searchParams.get("tick"))?.toUpperCase() ?? null;
    const mode = safeStr(searchParams.get("mode"))?.toUpperCase() ?? null;
    const state = safeStr(searchParams.get("state"));
    const city = safeStr(searchParams.get("city"));
    const globalOnly = searchParams.get("globalOnly") === "true";

    try {
        let items: any[] = [];

        // 1) Load supplier products
        if (source === "ALL" || source === "PRODUCTS") {
            const productWhere: any = {
                isActive: true,
                approvalStatus: "APPROVED",
                isHiddenByAdmin: false,
            };

            if (country) productWhere.countryOfOrigin = country;
            if (category) productWhere.categorySlug = category;
            if (q) {
                productWhere.OR = [
                    { name: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                    { categorySlug: { contains: q, mode: "insensitive" } },
                ];
            }

            if (mode === "BUY_NOW") productWhere.allowBuyNow = true;
            else if (mode === "RFQ") productWhere.allowRfq = true;
            else if (mode === "BOTH") {
                productWhere.allowBuyNow = true;
                productWhere.allowRfq = true;
            }

            if (supplierType || tick || state || city) {
                const sWhere: any = {};
                if (supplierType) sWhere.type = supplierType;
                if (tick === "GREEN_TICK") sWhere.isVerified = true;
                if (city) sWhere.city = city;
                else if (state) sWhere.city = { contains: state, mode: "insensitive" };
                productWhere.supplier = sWhere;
            }

            const products = await db.product.findMany({
                where: productWhere,
                include: {
                    supplier: true,
                },
            });

            const mappedProducts = products.map((p) => ({
                kind: "PRODUCT",
                id: p.id,
                slug: p.id, // using id as slug since slug field not confirmed reliably in schema
                title: p.name,
                description: p.description,
                categorySlug: p.categorySlug,
                categoryName: p.categoryName,
                country: p.countryOfOrigin,
                buyNowEnabled: p.allowBuyNow,
                rfqEnabled: p.allowRfq,
                priceBuyNow: p.unitPrice, // ProductCard expects priceBuyNow
                moq: p.moq || 1,
                images: p.images,
                createdAt: p.createdAt,
                supplier: {
                    name: p.supplier?.businessName || "Supplier",
                    verification: p.supplier?.isVerified ? "GREEN_TICK" : "NONE",
                    type: p.supplier?.type || "FACTORY",
                },
                supplierCity: p.supplier?.city || null,
                _sortPrice: p.unitPrice,
            }));

            items = [...items, ...mappedProducts];
        }

        // 2) Load creator digital listings
        if (source === "ALL" || source === "CREATORS_DIGITAL") {
            const creatorWhere: any = {
                status: "ACTIVE",
                type: "DIGITAL",
            };

            if (q) {
                creatorWhere.OR = [
                    { title: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ];
            }
            if (category) creatorWhere.category = category;

            const creatorListings = await db.creatorListing.findMany({
                where: creatorWhere,
                include: {
                    creator: true,
                },
            });

            const mappedCreators = creatorListings.map((cl) => ({
                kind: "CREATOR_DIGITAL",
                id: cl.id,
                title: cl.title,
                description: cl.description,
                category: cl.category,
                price_type: cl.priceType, // CreatorListingCard expects price_type
                currency: cl.currency,
                price: cl.price,
                media: cl.media,
                createdAt: cl.createdAt,
                creatorName: cl.creator.displayName,
                creatorTick: cl.creator.hasBlueTick ? "BLUE_TICK" : cl.creator.hasGreenTick ? "GREEN_TICK" : "NONE",
                _sortPrice: cl.price || 0,
            }));

            items = [...items, ...mappedCreators];
        }

        // 3) Sort
        if (sort === "NEWEST") {
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === "PRICE_LOW") {
            items.sort((a, b) => (a._sortPrice ?? Infinity) - (b._sortPrice ?? Infinity));
        } else if (sort === "PRICE_HIGH") {
            items.sort((a, b) => (b._sortPrice ?? -Infinity) - (a._sortPrice ?? -Infinity));
        } else {
            if (!q) items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        const total = items.length;
        const paginated = items.slice(offset, offset + limit).map(({ _sortPrice, ...rest }) => rest);
        const hasMore = offset + paginated.length < total;

        return NextResponse.json({
            ok: true,
            data: {
                items: paginated,
                page,
                limit,
                total,
                hasMore,
            },
        });

    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
