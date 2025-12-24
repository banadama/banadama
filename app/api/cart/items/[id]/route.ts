// app/api/cart/items/[id]/route.ts - Cart Item API (PATCH, DELETE)

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";

/**
 * PATCH /api/cart/items/[id]
 * Update cart item quantity
 * Body: { qty: number }
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        const { qty } = body;

        if (typeof qty !== "number" || qty < 1) {
            return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
        }

        // In production:
        // await prisma.cartItem.update({ where: { id }, data: { qty } });

        return NextResponse.json({
            success: true,
            item: { id, qty },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update item" }, { status: 500 });
    }
}

/**
 * DELETE /api/cart/items/[id]
 * Remove item from cart
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // In production:
        // await prisma.cartItem.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to remove item" }, { status: 500 });
    }
}
