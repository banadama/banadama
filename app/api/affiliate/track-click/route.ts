export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isWithinAttributionWindow } from "@/config/affiliate";


// POST /api/affiliate/track-click - Record a link click
export async function POST(request: NextRequest) {
    try {
        // Public endpoint, no auth required (tracked via link ID)
        const body = await request.json();
        const { linkId, ipAddress, userAgent, referer } = body;

        if (!linkId) {
            return NextResponse.json({ error: "Link ID required" }, { status: 400 });
        }

        const link = await db.affiliateLink.findUnique({
            where: { id: linkId },
        });

        if (!link) {
            return NextResponse.json({ error: "Invalid link" }, { status: 404 });
        }

        // Record click
        await db.affiliateClick.create({
            data: {
                linkId,
                affiliateId: link.affiliateId,
                ipAddress: ipAddress || "unknown",
                userAgent: userAgent || "unknown",
                referer: referer || null,
            },
        });

        // Update link stats
        await db.affiliateLink.update({
            where: { id: linkId },
            data: { clicks: { increment: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking click:", error);
        return NextResponse.json(
            { error: "Failed to track click" },
            { status: 500 }
        );
    }
}
