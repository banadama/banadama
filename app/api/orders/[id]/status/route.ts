// app/api/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Valid status transitions
const STATUS_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["PAID", "CANCELLED"],
    PAID: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [], // Terminal state
    CANCELLED: [], // Terminal state
};

// PATCH - Update order status
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
        const { status, trackingNumber } = body;

        if (!status) {
            return NextResponse.json({ error: "status is required" }, { status: 400 });
        }

        const order = await db.order.findUnique({
            where: { id },
            include: {
                buyer: { include: { user: true } },
                supplier: { include: { user: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const isOps = user.role === "OPS" || user.role === "ADMIN";
        const isBuyer = order.buyer.user.email === user.email;
        const isSupplier = order.supplier.user.email === user.email;

        // Permission matrix
        const allowedTransitions: Record<string, string[]> = {
            // Buyer can cancel pending orders
            BUYER: order.status === "PENDING" ? ["CANCELLED"] : [],
            // Supplier can update processing → shipped
            SUPPLIER: ["PROCESSING", "SHIPPED"].includes(order.status)
                ? STATUS_TRANSITIONS[order.status] || []
                : [],
            // Ops can do anything
            OPS: STATUS_TRANSITIONS[order.status] || [],
        };

        let userRole = "NONE";
        if (isOps) userRole = "OPS";
        else if (isSupplier) userRole = "SUPPLIER";
        else if (isBuyer) userRole = "BUYER";

        if (!allowedTransitions[userRole]?.includes(status)) {
            return NextResponse.json(
                { error: `Cannot transition from ${order.status} to ${status}` },
                { status: 400 }
            );
        }

        // Validate tracking number for SHIPPED status
        if (status === "SHIPPED" && !trackingNumber && !order.trackingNumber) {
            return NextResponse.json(
                { error: "trackingNumber is required when marking as SHIPPED" },
                { status: 400 }
            );
        }

        // Update order
        const updatedOrder = await db.order.update({
            where: { id },
            data: {
                status,
                ...(trackingNumber ? { trackingNumber } : {}),
                ...(status === "SHIPPED" ? { shippedAt: new Date() } : {}),
                ...(status === "DELIVERED" ? { deliveredAt: new Date() } : {}),
            },
        });

        return NextResponse.json({
            success: true,
            order: {
                id: updatedOrder.id,
                status: updatedOrder.status,
                trackingNumber: updatedOrder.trackingNumber,
            },
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
