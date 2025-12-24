// app/api/admin/finance/orders/[id]/refund/route.ts - Order Refund API (FINANCE_ADMIN)

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";


// POST /api/admin/finance/orders/[id]/refund
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // FINANCE_ADMIN only
    const { user: admin, error } = await requireApiRole("FINANCE_ADMIN");
    if (error) {
        // Fallback to ADMIN if FINANCE_ADMIN not implemented
        const adminCheck = await requireApiRole("ADMIN");
        if (adminCheck.error) {
            return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Finance admin access required" } }, { status: 403 });
        }
    }

    const { id } = await params;

    try {
        const body = await request.json().catch(() => ({}));
        const { reason } = body;

        const order = await db.order.findUnique({ where: { id } });
        if (!order) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Order not found" } }, { status: 404 });
        }

        // Create refund record
        const refund = await db.refund.create({
            data: {
                orderId: id,
                amount: order.totalAmount,
                reason: reason || "Admin initiated refund",
                status: "PENDING",
                requestedAt: new Date(),
            },
        });

        // Update order status
        await db.order.update({
            where: { id },
            data: { status: "REFUND_REQUESTED" },
        });

        await logAdminAction({
            adminId: admin?.id || "system",
            action: "CREATE_REFUND",
            targetType: "ORDER",
            targetId: id,
            after: createSnapshot({ refundId: refund.id, reason }),
        });

        return NextResponse.json({
            ok: true,
            data: { orderId: id, refundId: refund.id, status: "REFUND_CREATED" },
        });
    } catch (err) {
        console.error("Error creating refund:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to create refund" } }, { status: 500 });
    }
}
