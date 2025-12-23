// app/api/rfq/[id]/quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateFullPricing } from "@/lib/pricing";

// POST - Generate quote for RFQ (Ops only)
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Ops and Admin can generate quotes
        if (user.role !== "OPS" && user.role !== "ADMIN") {
            return NextResponse.json({ error: "Only Ops can generate quotes" }, { status: 403 });
        }

        const { id } = params;
        const body = await req.json();
        const {
            unitPrice,
            shippingEstimate,
            notes,
        } = body;

        if (!unitPrice) {
            return NextResponse.json({ error: "unitPrice is required" }, { status: 400 });
        }

        // Get RFQ with related data
        const rfq = await db.request.findUnique({
            where: { id },
            include: {
                buyer: {
                    include: { user: true },
                },
                supplier: true,
            },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        if (!rfq.supplierId) {
            return NextResponse.json(
                { error: "Assign a supplier before generating quote" },
                { status: 400 }
            );
        }

        // Calculate pricing using pricing engine
        const pricingInput = {
            basePrice: parseFloat(unitPrice),
            quantity: rfq.quantity,
            categorySlug: rfq.categorySlug || "general",
            destinationCountry: rfq.deliveryCountry || "NG",
            originCountry: rfq.buyer?.user?.country || "NG",
            serviceTier: rfq.serviceTier as "BASIC" | "PREMIUM" | "BUSINESS" || "BASIC",
        };

        let pricingBreakdown;
        try {
            pricingBreakdown = calculateFullPricing(pricingInput);
        } catch (pricingError) {
            // Fallback manual calculation
            const subtotal = parseFloat(unitPrice) * rfq.quantity;
            const fulfillmentFee = subtotal * 0.052; // 5.2%
            const shipping = parseFloat(shippingEstimate || "0");

            pricingBreakdown = {
                subtotal,
                fulfillmentFee,
                shippingEstimate: shipping,
                total: subtotal + fulfillmentFee + shipping,
            };
        }

        // Update RFQ with quote
        const updatedRfq = await db.request.update({
            where: { id },
            data: {
                status: "QUOTED",
                estimatedPricing: JSON.stringify({
                    unitPrice: parseFloat(unitPrice),
                    quantity: rfq.quantity,
                    ...pricingBreakdown,
                    notes,
                    quotedAt: new Date().toISOString(),
                    quotedBy: user.email,
                }),
                estimatedTotal: pricingBreakdown.total,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Quote generated successfully",
            quote: {
                rfqId: updatedRfq.id,
                unitPrice: parseFloat(unitPrice),
                quantity: rfq.quantity,
                ...pricingBreakdown,
                status: updatedRfq.status,
            },
        });

    } catch (error) {
        console.error("Error generating quote:", error);
        return NextResponse.json({ error: "Failed to generate quote" }, { status: 500 });
    }
}

// GET - Get quote details for RFQ
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        const rfq = await db.request.findUnique({
            where: { id },
            include: {
                buyer: { include: { user: { select: { email: true } } } },
            },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        // Access control
        const isOps = user.role === "OPS" || user.role === "ADMIN";
        const isBuyer = rfq.buyer.user.email === user.email;

        if (!isOps && !isBuyer) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        if (rfq.status === "PENDING") {
            return NextResponse.json({ error: "Quote not yet generated" }, { status: 404 });
        }

        return NextResponse.json({
            rfqId: rfq.id,
            status: rfq.status,
            estimatedTotal: rfq.estimatedTotal,
            pricing: rfq.estimatedPricing ? JSON.parse(rfq.estimatedPricing as string) : null,
        });

    } catch (error) {
        console.error("Error fetching quote:", error);
        return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
    }
}
