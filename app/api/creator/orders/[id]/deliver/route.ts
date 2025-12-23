import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireApiRole("CREATOR");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const body = await req.json();
        const order = await prisma.creatorOrder.findUnique({
            where: { id: params.id },
            include: { creator: true },
        });

        if (!order || order.creator.userId !== user.id) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Create delivery record
        const delivery = await prisma.creatorDelivery.create({
            data: {
                orderId: params.id,
                message: body.message,
                files: body.files || [],
            },
        });

        // Update order status to DELIVERED
        await prisma.creatorOrder.update({
            where: { id: params.id },
            data: { status: "DELIVERED" },
        });

        return NextResponse.json({ delivery });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
