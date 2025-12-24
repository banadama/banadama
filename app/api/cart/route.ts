// app/api/cart/route.ts - Cart API (GET, DELETE)

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";

// Mock cart storage (in production, use database)
const MOCK_CART = {
    items: [
        {
            id: "cart-item-1",
            productId: "p1",
            title: "Packaging Nylon Bags - Heavy Duty",
            image: "/placeholder-product.png",
            qty: 100,
            currency: "NGN",
            unitPrice: 3500,
            supplier: { id: "s1", name: "Lagos Packaging Co.", verificationLevel: "GREEN_TICK" as const },
            mode: "BUY_NOW" as const,
        },
    ],
    totals: {
        subtotal: 350000,
        currency: "NGN",
    },
};

/**
 * GET /api/cart
 * Returns user's cart items and totals
 */
export async function GET(request: NextRequest) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // In production: fetch cart from database
        // const cart = await prisma.cart.findFirst({ where: { userId: user.id }, include: { items: true } });

        return NextResponse.json({
            cart: { id: "cart-1" },
            items: MOCK_CART.items,
            totals: MOCK_CART.totals,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch cart" }, { status: 500 });
    }
}

/**
 * DELETE /api/cart
 * Clears the entire cart
 */
export async function DELETE(request: NextRequest) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // In production: delete all cart items
        // await prisma.cartItem.deleteMany({ where: { cart: { userId: user.id } } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to clear cart" }, { status: 500 });
    }
}
