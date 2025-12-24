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
            return NextResponse.json({ listings: [] });
        }

        const listings = await prisma.creatorListing.findMany({
            where: { creatorId: creator.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ listings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { user, error } = await requireApiRole("CREATOR");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const body = await req.json();

        // Find or create creator profile if needed (should exist if role is CREATOR)
        let creator = await prisma.creatorProfile.findUnique({
            where: { userId: user.id },
        });

        if (!creator) {
            creator = await prisma.creatorProfile.create({
                data: {
                    userId: user.id,
                    displayName: user.email.split('@')[0],
                }
            });
        }

        const listing = await prisma.creatorListing.create({
            data: {
                creatorId: creator.id,
                type: body.type,
                category: body.category,
                title: body.title,
                description: body.description,
                priceType: body.price_type || "FIXED",
                currency: body.currency || "USD",
                price: body.price,
                country: body.country,
                state: body.state,
                city: body.city,
                status: body.status || "ACTIVE",
            },
        });

        return NextResponse.json({ listing });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
