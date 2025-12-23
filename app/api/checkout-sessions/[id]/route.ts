// app/api/checkout-sessions/[id]/route.ts - Checkout Session API (GET, PATCH)
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";

// Mock checkout session (in production, use database)
const MOCK_SESSION = {
    id: "CS-MOCK-001",
    status: "DRAFT" as const,
    tradeMode: "LOCAL" as const,
    address: {
        name: "",
        phone: "",
        country: "NG",
        state: "",
        city: "",
        address1: "",
        notes: "",
    },
    items: [
        {
            productId: "p1",
            title: "Packaging Nylon Bags - Heavy Duty",
            image: "/placeholder-product.png",
            qty: 100,
            unitPrice: 3500,
            lineTotal: 350000,
            currency: "NGN",
            supplier: { name: "Lagos Packaging Co.", verificationLevel: "GREEN_TICK" },
        },
    ],
    pricing: {
        currency: "NGN",
        subtotal: 350000,
        platformFee: 8750, // 2.5%
        shipping: 15000,
        total: 373750,
    },
};

/**
 * GET /api/checkout-sessions/[id]
 * Get checkout session details
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // In production: fetch from database
        // const session = await prisma.checkoutSession.findUnique({ where: { id }, include: { items: true } });

        // Return mock session with the requested ID
        return NextResponse.json({
            ...MOCK_SESSION,
            id,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch session" }, { status: 500 });
    }
}

/**
 * PATCH /api/checkout-sessions/[id]
 * Update checkout session (address, etc.)
 * Body: { address?: object }
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await requireApiRole("BUYER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        const { address } = body;

        // In production:
        // await prisma.checkoutSession.update({ where: { id }, data: { address } });

        return NextResponse.json({
            success: true,
            session: { id, address },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update session" }, { status: 500 });
    }
}
