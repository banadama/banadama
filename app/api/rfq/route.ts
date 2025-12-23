// app/api/rfq/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// POST - Create new RFQ (Buyer only)
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (user.role !== "BUYER") {
            return NextResponse.json({ error: "Only buyers can create RFQs" }, { status: 403 });
        }

        const body = await req.json();
        const {
            productName,
            categorySlug,
            quantity,
            targetPrice,
            description,
            specifications,
            deliveryAddress,
            deliveryCity,
            deliveryCountry,
            serviceTier = "BASIC",
        } = body;

        // Validate required fields
        if (!productName || !quantity || !deliveryAddress) {
            return NextResponse.json(
                { error: "Missing required fields: productName, quantity, deliveryAddress" },
                { status: 400 }
            );
        }

        // Get buyer profile
        const buyerProfile = await db.buyerProfile.findFirst({
            where: { user: { email: user.email } },
        });

        if (!buyerProfile) {
            return NextResponse.json({ error: "Buyer profile not found" }, { status: 404 });
        }

        // Create the RFQ
        const rfq = await db.request.create({
            data: {
                buyerId: buyerProfile.id,
                productName,
                categorySlug: categorySlug || "general",
                quantity: parseInt(quantity),
                targetPrice: targetPrice ? parseFloat(targetPrice) : null,
                description,
                specifications,
                deliveryAddress,
                deliveryCity,
                deliveryCountry: deliveryCountry || "NG",
                serviceTier,
                status: "PENDING",
            },
        });

        return NextResponse.json({
            success: true,
            rfq: {
                id: rfq.id,
                productName: rfq.productName,
                status: rfq.status,
                createdAt: rfq.createdAt,
            },
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating RFQ:", error);
        return NextResponse.json({ error: "Failed to create RFQ" }, { status: 500 });
    }
}

// GET - Get RFQs for current user (role-based)
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "20");

        let rfqs;

        if (user.role === "BUYER") {
            // Buyer sees their own RFQs
            const buyerProfile = await db.buyerProfile.findFirst({
                where: { user: { email: user.email } },
            });

            if (!buyerProfile) {
                return NextResponse.json({ error: "Buyer profile not found" }, { status: 404 });
            }

            rfqs = await db.request.findMany({
                where: {
                    buyerId: buyerProfile.id,
                    ...(status ? { status: status as any } : {}),
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            });

        } else if (user.role === "OPS" || user.role === "ADMIN") {
            // Ops/Admin sees all RFQs
            rfqs = await db.request.findMany({
                where: status ? { status: status as any } : {},
                include: {
                    buyer: {
                        include: {
                            user: {
                                select: { email: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            });

        } else if (user.role === "FACTORY" || user.role === "WHOLESALER" || user.role === "SUPPLIER") {
            // Supplier sees assigned RFQs
            const supplierProfile = await db.supplierProfile.findFirst({
                where: { user: { email: user.email } },
            });

            if (!supplierProfile) {
                return NextResponse.json({ error: "Supplier profile not found" }, { status: 404 });
            }

            rfqs = await db.request.findMany({
                where: {
                    supplierId: supplierProfile.id,
                    ...(status ? { status: status as any } : {}),
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            });

        } else {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({ rfqs });

    } catch (error) {
        console.error("Error fetching RFQs:", error);
        return NextResponse.json({ error: "Failed to fetch RFQs" }, { status: 500 });
    }
}
