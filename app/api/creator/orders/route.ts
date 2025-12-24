export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";


export async function GET() {
    const { user, error } = await requireApiRole("CREATOR");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const creator = await prisma.creatorProfile.findUnique({
            where: { userId: user.id },
        });

        if (!creator) {
            return NextResponse.json({ orders: [] });
        }

        const orders = await prisma.creatorOrder.findMany({
            where: { creatorId: creator.id },
            include: {
                listing: {
                    select: { title: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const formatted = orders.map(o => ({
            ...o,
            listingTitle: o.listing.title
        }));

        return NextResponse.json({ orders: formatted });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
