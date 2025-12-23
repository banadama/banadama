// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET - Get orders for current user (role-based)
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "20");

        let orders;

        if (user.role === "BUYER") {
            // Buyer sees their own orders
            const buyerProfile = await db.buyerProfile.findFirst({
                where: { user: { email: user.email } },
            });

            if (!buyerProfile) {
                return NextResponse.json({ error: "Buyer profile not found" }, { status: 404 });
            }

            orders = await db.order.findMany({
                where: {
                    buyerId: buyerProfile.id,
                    ...(status ? { status: status as any } : {}),
                },
                include: {
                    supplier: {
                        select: { businessName: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            });

        } else if (user.role === "FACTORY" || user.role === "WHOLESALER" || user.role === "SUPPLIER") {
            // Supplier sees their orders
            const supplierProfile = await db.supplierProfile.findFirst({
                where: { user: { email: user.email } },
            });

            if (!supplierProfile) {
                return NextResponse.json({ error: "Supplier profile not found" }, { status: 404 });
            }

            orders = await db.order.findMany({
                where: {
                    supplierId: supplierProfile.id,
                    ...(status ? { status: status as any } : {}),
                },
                include: {
                    buyer: {
                        include: { user: { select: { email: true } } },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            });

        } else if (user.role === "OPS" || user.role === "ADMIN") {
            // Ops/Admin sees all orders
            orders = await db.order.findMany({
                where: status ? { status: status as any } : {},
                include: {
                    buyer: {
                        include: { user: { select: { email: true } } },
                    },
                    supplier: {
                        select: { businessName: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            });

        } else {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({
            orders: orders.map((o) => ({
                id: o.id,
                productName: o.productName,
                quantity: o.quantity,
                totalPrice: o.totalPrice,
                status: o.status,
                createdAt: o.createdAt,
                supplier: o.supplier?.businessName,
            })),
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// POST - Create order directly (Buy Now flow)
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (user.role !== "BUYER") {
            return NextResponse.json({ error: "Only buyers can create orders" }, { status: 403 });
        }

        const body = await req.json();
        const {
            productId,
            quantity,
            deliveryAddress,
            deliveryCity,
            deliveryCountry,
        } = body;

        if (!productId || !quantity || !deliveryAddress) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get buyer profile
        const buyerProfile = await db.buyerProfile.findFirst({
            where: { user: { email: user.email } },
        });

        if (!buyerProfile) {
            return NextResponse.json({ error: "Buyer profile not found" }, { status: 404 });
        }

        // Get product
        const product = await db.product.findUnique({
            where: { id: productId },
            include: { supplier: true },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Check MOQ if applicable
        if (product.moq && quantity < product.moq) {
            return NextResponse.json(
                { error: `Minimum order quantity is ${product.moq}` },
                { status: 400 }
            );
        }

        // Calculate total
        const subtotal = product.unitPrice * quantity;
        const fulfillmentFee = subtotal * 0.052; // 5.2%
        const totalPrice = subtotal + fulfillmentFee;

        // Create order
        const order = await db.order.create({
            data: {
                buyerId: buyerProfile.id,
                supplierId: product.supplierId,
                productId: product.id,
                productName: product.name,
                quantity,
                totalPrice,
                pricingSnapshot: JSON.stringify({
                    unitPrice: product.unitPrice,
                    quantity,
                    subtotal,
                    fulfillmentFee,
                    total: totalPrice,
                }),
                status: "PENDING", // Awaiting payment
                deliveryAddress,
                deliveryCity,
                deliveryCountry: deliveryCountry || "NG",
            },
        });

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                totalPrice: order.totalPrice,
                status: order.status,
            },
            nextStep: `/buyer/orders/${order.id}/pay`,
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
