import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireApiRole("CREATOR");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const order = await prisma.creatorOrder.findUnique({
            where: { id: params.id },
            include: { creator: true },
        });

        if (!order || order.creator.userId !== user.id) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const deliveries = await prisma.creatorDelivery.findMany({
            where: { orderId: params.id },
            orderBy: { deliveredAt: "desc" },
        });

        return NextResponse.json({ deliveries });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
