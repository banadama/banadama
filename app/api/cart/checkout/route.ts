// app/api/cart/checkout/route.ts - Cart Checkout API (creates checkout session)

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";

/**
 * POST /api/cart/checkout
 * Create checkout session from cart
 * Body: { tradeMode: "LOCAL" | "GLOBAL_BUY_ONLY", address?: object }
 * Returns: { checkoutSessionId: string }
 */
export async function POST(request: NextRequest) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { tradeMode = "LOCAL", address = {} } = body;

        // In production:
        // 1. Fetch cart items
        // 2. Calculate pricing
        // 3. Create checkout session

        const checkoutSessionId = `CS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Mock: create session (would be stored in DB)
        // await prisma.checkoutSession.create({
        //   data: {
        //     id: checkoutSessionId,
        //     userId: user.id,
        //     status: "DRAFT",
        //     tradeMode,
        //     address,
        //     items: [...cartItems],
        //     pricing: calculatedPricing,
        //   }
        // });

        return NextResponse.json({
            success: true,
            checkoutSessionId,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
    }
}
