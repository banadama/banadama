export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { lockFundsInEscrow } from "@/lib/escrow";


export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireApiRole("BUYER");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const order = await (prisma as any).creatorOrder.findUnique({
            where: { id: params.id },
        });

        if (!order || order.buyerUserId !== user!.id) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.status !== "PENDING") {
            return NextResponse.json({ error: "Order is already paid or cannot be paid" }, { status: 400 });
        }

        // 1. Attempt to lock funds in escrow
        try {
            await lockFundsInEscrow({
                buyerUserId: user!.id,
                orderId: order.id,
                amount: order.total,
                description: `Escrow lock for creator order ${order.id}`
            });
        } catch (escrowError: any) {
            return NextResponse.json({ error: escrowError.message || "Insufficient balance or escrow error" }, { status: 400 });
        }

        // 2. Update order status
        const updated = await (prisma as any).creatorOrder.update({
            where: { id: params.id },
            data: { status: "PAID_ESCROW" },
        });

        return NextResponse.json({ order: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
