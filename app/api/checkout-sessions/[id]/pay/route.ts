// app/api/checkout-sessions/[id]/pay/route.ts - Checkout Session Pay API
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";

/**
 * POST /api/checkout-sessions/[id]/pay
 * Process payment and lock escrow
 * Returns: { success: boolean, orderIds: string[] }
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sessionId } = params;

        // In production:
        // 1. Validate session is in DRAFT status
        // 2. Validate address is complete
        // 3. Process payment (Paystack/Flutterwave)
        // 4. Create order(s) from session items
        // 5. Lock escrow
        // 6. Update session status to PAID_ESCROW
        // 7. Clear cart

        // const session = await prisma.checkoutSession.findUnique({ where: { id: sessionId } });
        // if (!session || session.status !== "DRAFT") throw new Error("Invalid session");

        // const payment = await processPayment(session.pricing.total, user);
        // const orders = await createOrdersFromSession(session);
        // await lockEscrow(orders, payment);
        // await prisma.checkoutSession.update({ where: { id: sessionId }, data: { status: "PAID_ESCROW" } });

        // Generate mock order ID
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        return NextResponse.json({
            success: true,
            orderIds: [orderId],
            orderId, // Single order for convenience
            message: "Payment processed. Escrow locked.",
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Payment failed" }, { status: 500 });
    }
}
