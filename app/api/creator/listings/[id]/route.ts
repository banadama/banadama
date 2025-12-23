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
        const listing = await prisma.creatorListing.findUnique({
            where: { id: params.id },
            include: { creator: true },
        });

        if (!listing || listing.creator.userId !== user.id) {
            return NextResponse.json({ error: "Listing not found or access denied" }, { status: 404 });
        }

        return NextResponse.json({ listing });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireApiRole("CREATOR");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const body = await req.json();
        const listing = await prisma.creatorListing.findUnique({
            where: { id: params.id },
            include: { creator: true },
        });

        if (!listing || listing.creator.userId !== user.id) {
            return NextResponse.json({ error: "Listing not found or access denied" }, { status: 404 });
        }

        const updated = await prisma.creatorListing.update({
            where: { id: params.id },
            data: {
                type: body.type,
                category: body.category,
                title: body.title,
                description: body.description,
                priceType: body.price_type,
                currency: body.currency,
                price: body.price,
                country: body.country,
                state: body.state,
                city: body.city,
                status: body.status,
            },
        });

        return NextResponse.json({ listing: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
