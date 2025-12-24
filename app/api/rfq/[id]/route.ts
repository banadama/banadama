// app/api/rfq/[id]/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


// GET - Get single RFQ by ID
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
                buyer: {
                    include: {
                        user: {
                            select: { email: true, country: true },
                        },
                    },
                },
                supplier: {
                    include: {
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        // Access control
        const isOps = user.role === "OPS" || user.role === "ADMIN";
        const isBuyer = rfq.buyer.user.email === user.email;
        const isSupplier = rfq.supplier?.user.email === user.email;

        if (!isOps && !isBuyer && !isSupplier) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({ rfq });

    } catch (error) {
        console.error("Error fetching RFQ:", error);
        return NextResponse.json({ error: "Failed to fetch RFQ" }, { status: 500 });
    }
}

// PATCH - Update RFQ (Ops only for most fields)
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json();

        const rfq = await db.request.findUnique({
            where: { id },
            include: { buyer: { include: { user: true } } },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        const isOps = user.role === "OPS" || user.role === "ADMIN";
        const isBuyer = rfq.buyer.user.email === user.email;

        // Buyers can only update their own pending RFQs
        if (isBuyer && rfq.status !== "PENDING") {
            return NextResponse.json(
                { error: "Cannot modify RFQ after it's been processed" },
                { status: 400 }
            );
        }

        // Non-Ops, non-buyers cannot update
        if (!isOps && !isBuyer) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Determine what can be updated
        const allowedBuyerFields = ["productName", "description", "specifications", "quantity"];
        const allowedOpsFields = ["status", "supplierId", "estimatedTotal", "estimatedPricing"];

        const updateData: any = {};

        if (isBuyer) {
            for (const field of allowedBuyerFields) {
                if (body[field] !== undefined) {
                    updateData[field] = body[field];
                }
            }
        }

        if (isOps) {
            for (const field of [...allowedBuyerFields, ...allowedOpsFields]) {
                if (body[field] !== undefined) {
                    updateData[field] = body[field];
                }
            }
        }

        const updatedRfq = await db.request.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            rfq: updatedRfq,
        });

    } catch (error) {
        console.error("Error updating RFQ:", error);
        return NextResponse.json({ error: "Failed to update RFQ" }, { status: 500 });
    }
}

// DELETE - Cancel RFQ (Buyer or Ops)
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

        const rfq = await db.request.findUnique({
            where: { id },
            include: { buyer: { include: { user: true } } },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        const isOps = user.role === "OPS" || user.role === "ADMIN";
        const isBuyer = rfq.buyer.user.email === user.email;

        if (!isOps && !isBuyer) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Only pending RFQs can be cancelled by buyer
        if (isBuyer && rfq.status !== "PENDING") {
            return NextResponse.json(
                { error: "Cannot cancel RFQ after it's been processed" },
                { status: 400 }
            );
        }

        // Soft delete - update status to REJECTED
        await db.request.update({
            where: { id },
            data: { status: "REJECTED" },
        });

        return NextResponse.json({ success: true, message: "RFQ cancelled" });

    } catch (error) {
        console.error("Error cancelling RFQ:", error);
        return NextResponse.json({ error: "Failed to cancel RFQ" }, { status: 500 });
    }
}
