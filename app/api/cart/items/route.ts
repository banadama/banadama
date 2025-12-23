// app/api/cart/items/route.ts - Cart Items API (POST - add item)
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";

/**
 * POST /api/cart/items
 * Add item to cart
 * Body: { productId: string, qty: number }
 */
export async function POST(request: NextRequest) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { productId, qty = 1 } = body;

        if (!productId) {
            return NextResponse.json({ error: "productId is required" }, { status: 400 });
        }

        // In production:
        // 1. Get or create cart for user
        // 2. Check if product exists and is buy-now enabled
        // 3. Add item to cart or update quantity if already exists
        // const cartItem = await prisma.cartItem.upsert({ ... });

        const itemId = `cart-item-${Date.now()}`;

        return NextResponse.json({
            success: true,
            item: {
                id: itemId,
                productId,
                qty,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to add item" }, { status: 500 });
    }
}
