export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateSaleCommission } from "@/config/affiliate";


// POST /api/affiliate/track-sale - Record a sale/conversion (Internal/Admin)
export async function POST(request: NextRequest) {
  try {
    // Should be secured. Only Admin or System (via secret) can call this.
    // implementing Basic Auth or Role check.
    const { error } = await requireApiRole(["ADMIN"]);

    if (error) {
      // Allow internal bypass if SECRET matches (omitted for MVP simplicity, sticking to RBAC)
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const body = await request.json();
    const { linkId, orderId, orderValue } = body;

    const link = await db.affiliateLink.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Calculate commission
    const commission = calculateSaleCommission(orderValue);

    // Create conversion record
    await db.$transaction(async (tx) => {
      await tx.affiliateConversion.create({
        data: {
          linkId,
          affiliateId: link.affiliateId,
          amount: orderValue,
          commission,
          orderId,
          type: "SALE",
        },
      });

      // Update link stats
      await tx.affiliateLink.update({
        where: { id: linkId },
        data: {
          conversions: { increment: 1 }
        },
      });

      // Update profile earnings
      await tx.affiliateProfile.update({
        where: { userId: link.affiliateId },
        data: {
          totalEarnings: { increment: commission },
          availableBalance: { increment: commission }, // Instant availability for MVP? or use pending logic
        },
      });

      // Also update wallet if exists? For now, AffiliateProfile tracks earnings. 
      // Wallet integration typically happens at Payout.
    });

    return NextResponse.json({ success: true, commission });
  } catch (error) {
    console.error("Error tracking sale:", error);
    return NextResponse.json(
      { error: "Failed to track sale" },
      { status: 500 }
    );
  }
}
