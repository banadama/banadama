import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const listing = await prisma.creatorListing.findUnique({
            where: { id: params.id },
            include: {
                creator: {
                    select: {
                        displayName: true,
                        verificationTick: true,
                        bio: true,
                    }
                }
            },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        const formatted = {
            ...listing,
            creatorName: listing.creator.displayName,
            creatorTick: listing.creator.verificationTick,
        };

        return NextResponse.json({ listing: formatted });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
