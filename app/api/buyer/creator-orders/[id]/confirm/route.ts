export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { releaseCreatorEscrow } from "@/lib/escrow";


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

        if (order.status !== "DELIVERED") {
            return NextResponse.json({ error: "Order must be in DELIVERED status to confirm" }, { status: 400 });
        }

        // 1. Release escrow to creator
        try {
            await releaseCreatorEscrow({ orderId: order.id, description: "Funds released on buyer confirmation" });
        } catch (escrowError: any) {
            console.error("Escrow release failed:", escrowError);
            // We might still want to mark it confirmed OR fail? 
            // Better to fail if fund release is critical.
            return NextResponse.json({ error: "Failed to release funds" }, { status: 500 });
        }

        // 2. Update order status
        const updated = await (prisma as any).creatorOrder.update({
            where: { id: params.id },
            data: { status: "CONFIRMED" },
        });

        return NextResponse.json({ order: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
