// app/api/orders/[id]/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


// GET - Get single order by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        const order = await db.order.findUnique({
            where: { id },
            include: {
                buyer: {
                    include: { user: { select: { email: true, country: true } } },
                },
                supplier: {
                    include: { user: { select: { email: true } } },
                },
                request: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Access control
        const isOps = user.role === "OPS" || user.role === "ADMIN";
        const isBuyer = order.buyer.user.email === user.email;
        const isSupplier = order.supplier.user.email === user.email;

        if (!isOps && !isBuyer && !isSupplier) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({
            order: {
                id: order.id,
                productName: order.productName,
                quantity: order.quantity,
                totalPrice: order.totalPrice,
                status: order.status,
                deliveryAddress: order.deliveryAddress,
                deliveryCity: order.deliveryCity,
                deliveryCountry: order.deliveryCountry,
                trackingNumber: order.trackingNumber,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                pricing: order.pricingSnapshot ? JSON.parse(order.pricingSnapshot as string) : null,
                supplier: {
                    name: order.supplier.businessName,
                    email: isOps ? order.supplier.user.email : undefined,
                },
                buyer: isOps ? {
                    email: order.buyer.user.email,
                } : undefined,
            },
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}
