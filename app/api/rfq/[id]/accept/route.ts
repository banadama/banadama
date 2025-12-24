// app/api/rfq/[id]/accept/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


// POST - Accept quote and create order (Buyer only)
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Get RFQ with quote
        const rfq = await db.request.findUnique({
            where: { id },
            include: {
                buyer: { include: { user: true } },
                supplier: { include: { user: true } },
            },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        // Only the buyer can accept
        if (rfq.buyer.user.email !== user.email) {
            return NextResponse.json({ error: "Only the buyer can accept the quote" }, { status: 403 });
        }

        // Must be in QUOTED status
        if (rfq.status !== "QUOTED") {
            return NextResponse.json(
                { error: "RFQ must be in QUOTED status to accept" },
                { status: 400 }
            );
        }

        // Must have supplier assigned
        if (!rfq.supplierId || !rfq.supplier) {
            return NextResponse.json(
                { error: "No supplier assigned to this RFQ" },
                { status: 400 }
            );
        }

        // Must have estimated total
        if (!rfq.estimatedTotal) {
            return NextResponse.json(
                { error: "Quote not properly generated" },
                { status: 400 }
            );
        }

        // Transaction: Update RFQ and create Order
        const result = await db.$transaction(async (tx) => {
            // Update RFQ status to APPROVED
            const updatedRfq = await tx.request.update({
                where: { id },
                data: { status: "APPROVED" },
            });

            // Create the Order
            const order = await tx.order.create({
                data: {
                    buyerId: rfq.buyerId,
                    supplierId: rfq.supplierId!,
                    requestId: rfq.id,
                    productName: rfq.productName,
                    quantity: rfq.quantity,
                    totalPrice: rfq.estimatedTotal!,
                    pricingSnapshot: rfq.estimatedPricing || "{}",
                    status: "PENDING", // Awaiting payment
                    deliveryAddress: rfq.deliveryAddress,
                    deliveryCity: rfq.deliveryCity,
                    deliveryCountry: rfq.deliveryCountry,
                },
            });

            return { rfq: updatedRfq, order };
        });

        return NextResponse.json({
            success: true,
            message: "Quote accepted. Proceed to payment.",
            order: {
                id: result.order.id,
                status: result.order.status,
                totalPrice: result.order.totalPrice,
            },
            nextStep: `/buyer/orders/${result.order.id}/pay`,
        });

    } catch (error) {
        console.error("Error accepting quote:", error);
        return NextResponse.json({ error: "Failed to accept quote" }, { status: 500 });
    }
}

// POST - Reject quote (Buyer only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json().catch(() => ({}));
        const { reason } = body;

        const rfq = await db.request.findUnique({
            where: { id },
            include: { buyer: { include: { user: true } } },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        // Only the buyer can reject
        if (rfq.buyer.user.email !== user.email) {
            return NextResponse.json({ error: "Only the buyer can reject the quote" }, { status: 403 });
        }

        // Must be in QUOTED status
        if (rfq.status !== "QUOTED") {
            return NextResponse.json(
                { error: "RFQ must be in QUOTED status to reject" },
                { status: 400 }
            );
        }

        // Update RFQ status to REJECTED
        await db.request.update({
            where: { id },
            data: {
                status: "REJECTED",
                // Store rejection reason in pricing JSON
                estimatedPricing: JSON.stringify({
                    ...JSON.parse(rfq.estimatedPricing as string || "{}"),
                    rejectedAt: new Date().toISOString(),
                    rejectionReason: reason || "Buyer rejected quote",
                }),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Quote rejected",
        });

    } catch (error) {
        console.error("Error rejecting quote:", error);
        return NextResponse.json({ error: "Failed to reject quote" }, { status: 500 });
    }
}
