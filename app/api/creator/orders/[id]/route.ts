export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
            include: {
                listing: { select: { title: true } },
                creator: true,
            },
        });

        if (!order || order.creator.userId !== user.id) {
            return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
        }

        return NextResponse.json({
            order: {
                ...order,
                listingTitle: order.listing.title
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
