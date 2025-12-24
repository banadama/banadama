export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";


export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireApiRole("BUYER");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const order = await prisma.creatorOrder.findUnique({
            where: { id: params.id },
            include: {
                creator: { select: { displayName: true } },
                listing: { select: { title: true } },
            },
        });

        if (!order || order.buyerUserId !== user.id) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
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
