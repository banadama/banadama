// app/api/marketplace/products/route.ts - Marketplace Products API with Filtering + Pagination

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


function toInt(v: string | null, def: number) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : def;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    // Parse query params
    const q = searchParams.get("q")?.trim() || null;
    const country = (() => {
        const c = (searchParams.get("country") || "").toUpperCase();
        return c === "NG" || c === "BD" ? c : null;
    })();
    const category = searchParams.get("category")?.trim() || null;

    const supplierType = (() => {
        const t = (searchParams.get("supplierType") || "").toUpperCase();
        return t === "FACTORY" || t === "WHOLESALER" || t === "RETAIL" ? t : null;
    })();

    const tick = (() => {
        const t = (searchParams.get("tick") || "").toUpperCase();
        return t === "NONE" || t === "GREEN_TICK" || t === "BLUE_TICK" ? t : null;
    })();

    const mode = (() => {
        const m = (searchParams.get("mode") || "").toUpperCase();
        return m === "BUY_NOW" || m === "RFQ" || m === "BOTH" ? m : null;
    })();

    const state = searchParams.get("state")?.trim() || null;
    const city = searchParams.get("city")?.trim() || null;

    const sort = (searchParams.get("sort") || "RELEVANCE").toUpperCase();
    const page = toInt(searchParams.get("page"), 1);
    const limitRaw = toInt(searchParams.get("limit"), 24);
    const limit = Math.min(limitRaw, 60);
    const offset = (page - 1) * limit;

    const globalOnly = searchParams.get("globalOnly") === "true";

    try {
        // Build Prisma where clause
        const where: any = {
            status: "ACTIVE",
        };

        if (country) where.country = country;
        if (category) where.categorySlug = category;
        if (globalOnly) where.globalVisible = true;

        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { categorySlug: { contains: q, mode: "insensitive" } },
            ];
        }

        if (mode === "BUY_NOW") {
            where.buyNowEnabled = true;
        } else if (mode === "RFQ") {
            where.rfqEnabled = true;
        } else if (mode === "BOTH") {
            where.buyNowEnabled = true;
            where.rfqEnabled = true;
        }

        // Account/supplier type filter
        if (supplierType || tick) {
            where.account = {};
            if (supplierType) where.account.type = supplierType;
            if (tick) where.account.verificationLevel = tick;
        }

        // Build orderBy
        let orderBy: any = { createdAt: "desc" };
        if (sort === "NEWEST") {
            orderBy = { createdAt: "desc" };
        } else if (sort === "PRICE_LOW") {
            orderBy = { buyNowPrice: "asc" };
        } else if (sort === "PRICE_HIGH") {
            orderBy = { buyNowPrice: "desc" };
        } else if (sort === "MOQ_LOW") {
            orderBy = { moq: "asc" };
        } else if (sort === "LEADTIME_LOW") {
            orderBy = { leadTimeDays: "asc" };
        }

        // Get total count
        const total = await db.product.count({ where });

        // Fetch products with supplier info
        const products = await db.product.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy,
            include: {
                account: {
                    include: {
                        SupplierProfile: true,
                    },
                },
            },
        });

        // Enrich and filter by state/city (address is JSONB)
        let enriched = products.map((p: any) => {
            const address = p.account?.SupplierProfile?.address as any;
            return {
                id: p.id,
                title: p.title,
                slug: p.slug,
                categorySlug: p.categorySlug,
                country: p.country,
                moq: p.moq,
                leadTimeDays: p.leadTimeDays,
                buyNowEnabled: p.buyNowEnabled,
                rfqEnabled: p.rfqEnabled,
                currency: p.currency,
                buyNowPrice: p.buyNowPrice,
                images: p.images,
                description: p.description,
                globalVisible: p.globalVisible,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                supplierName: p.account?.SupplierProfile?.displayName || p.account?.name || "Supplier",
                supplierType: p.account?.type || "FACTORY",
                supplierTick: p.account?.verificationLevel || "NONE",
                supplierState: address?.state || null,
                supplierCity: address?.city || null,
            };
        });

        // Apply state/city filter (post-query for JSONB)
        if (state) {
            enriched = enriched.filter((p: any) => p.supplierState === state);
        }
        if (city) {
            enriched = enriched.filter((p: any) => p.supplierCity === city);
        }

        // Adjust total if state/city filtered
        const adjustedTotal = (state || city) ? enriched.length : total;

        return NextResponse.json({
            ok: true,
            data: {
                products: enriched,
                page,
                limit,
                total: adjustedTotal,
                hasMore: offset + enriched.length < adjustedTotal,
            },
        });
    } catch (error) {
        // Fallback to mock data for development
        const mockProducts = [
            {
                id: "p1",
                title: "Cotton Fabric Roll",
                slug: "cotton-fabric-roll",
                categorySlug: "textile",
                country: "BD",
                buyNowEnabled: true,
                rfqEnabled: true,
                buyNowPrice: 2500,
                moq: 50,
                leadTimeDays: 14,
                currency: "USD",
                images: ["/placeholder-product.png"],
                supplierName: "Dhaka Textile Works",
                supplierType: "FACTORY",
                supplierTick: "GREEN_TICK",
                supplierState: "Dhaka",
                supplierCity: "Gulshan",
                globalVisible: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: "p2",
                title: "Packaging Tape Industrial",
                slug: "packaging-tape-industrial",
                categorySlug: "packaging",
                country: "NG",
                buyNowEnabled: true,
                rfqEnabled: true,
                buyNowPrice: 8500,
                moq: 24,
                leadTimeDays: 3,
                currency: "NGN",
                images: ["/placeholder-product.png"],
                supplierName: "Ikeja Packaging",
                supplierType: "WHOLESALER",
                supplierTick: "BLUE_TICK",
                supplierState: "Lagos",
                supplierCity: "Ikeja",
                globalVisible: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: "p3",
                title: "Fashion Dress Collection",
                slug: "fashion-dress-collection",
                categorySlug: "fashion",
                country: "NG",
                buyNowEnabled: true,
                rfqEnabled: false,
                buyNowPrice: 15000,
                moq: 10,
                leadTimeDays: 5,
                currency: "NGN",
                images: ["/placeholder-product.png"],
                supplierName: "Lagos Fashion Hub",
                supplierType: "RETAIL",
                supplierTick: "GREEN_TICK",
                supplierState: "Lagos",
                supplierCity: "Victoria Island",
                globalVisible: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: "p4",
                title: "Premium Leather Shoes",
                slug: "premium-leather-shoes",
                categorySlug: "footwear",
                country: "BD",
                buyNowEnabled: false,
                rfqEnabled: true,
                buyNowPrice: null,
                moq: 100,
                leadTimeDays: 21,
                currency: "USD",
                images: ["/placeholder-product.png"],
                supplierName: "BD Footwear Factory",
                supplierType: "FACTORY",
                supplierTick: "NONE",
                supplierState: "Chittagong",
                supplierCity: "Chittagong City",
                globalVisible: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: "p5",
                title: "Organic Cotton T-Shirts",
                slug: "organic-cotton-tshirts",
                categorySlug: "apparel",
                country: "BD",
                buyNowEnabled: true,
                rfqEnabled: true,
                buyNowPrice: 450,
                moq: 200,
                leadTimeDays: 28,
                currency: "USD",
                images: ["/placeholder-product.png"],
                supplierName: "Green Apparel Ltd",
                supplierType: "FACTORY",
                supplierTick: "GREEN_TICK",
                supplierState: "Dhaka",
                supplierCity: "Gazipur",
                globalVisible: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        // Apply filters to mock data
        let filtered = [...mockProducts];

        if (q) {
            const qLower = q.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(qLower) ||
                p.categorySlug.toLowerCase().includes(qLower) ||
                p.supplierName.toLowerCase().includes(qLower)
            );
        }
        if (country) {
            filtered = filtered.filter(p => p.country === country);
        }
        if (category) {
            filtered = filtered.filter(p => p.categorySlug === category);
        }
        if (supplierType) {
            filtered = filtered.filter(p => p.supplierType === supplierType);
        }
        if (tick) {
            filtered = filtered.filter(p => p.supplierTick === tick);
        }
        if (mode === "BUY_NOW") {
            filtered = filtered.filter(p => p.buyNowEnabled);
        } else if (mode === "RFQ") {
            filtered = filtered.filter(p => p.rfqEnabled);
        } else if (mode === "BOTH") {
            filtered = filtered.filter(p => p.buyNowEnabled && p.rfqEnabled);
        }
        if (state) {
            filtered = filtered.filter(p => p.supplierState === state);
        }
        if (city) {
            filtered = filtered.filter(p => p.supplierCity === city);
        }
        if (globalOnly) {
            filtered = filtered.filter(p => p.globalVisible);
        }

        // Apply sort
        if (sort === "NEWEST") {
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === "PRICE_LOW") {
            filtered.sort((a, b) => (a.buyNowPrice ?? Infinity) - (b.buyNowPrice ?? Infinity));
        } else if (sort === "PRICE_HIGH") {
            filtered.sort((a, b) => (b.buyNowPrice ?? -Infinity) - (a.buyNowPrice ?? -Infinity));
        } else if (sort === "MOQ_LOW") {
            filtered.sort((a, b) => a.moq - b.moq);
        } else if (sort === "LEADTIME_LOW") {
            filtered.sort((a, b) => (a.leadTimeDays ?? Infinity) - (b.leadTimeDays ?? Infinity));
        }

        // Paginate
        const total = filtered.length;
        const paginated = filtered.slice(offset, offset + limit);

        return NextResponse.json({
            ok: true,
            data: {
                products: paginated,
                page,
                limit,
                total,
                hasMore: offset + paginated.length < total,
            },
        });
    }
}
