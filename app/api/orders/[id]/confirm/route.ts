// app/api/orders/[id]/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// POST - Confirm delivery and release escrow (Buyer only)
export async function POST(
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
                buyer: { include: { user: true } },
                supplier: { include: { user: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Only the buyer can confirm delivery
        if (order.buyer.user.email !== user.email) {
            return NextResponse.json(
                { error: "Only the buyer can confirm delivery" },
                { status: 403 }
            );
        }

        // Must be in DELIVERED or SHIPPED status
        if (!["DELIVERED", "SHIPPED"].includes(order.status)) {
            return NextResponse.json(
                { error: "Order must be delivered or shipped to confirm" },
                { status: 400 }
            );
        }

        // Transaction: Update order and release funds
        const result = await db.$transaction(async (tx) => {
            // Update order status to DELIVERED
            const updatedOrder = await tx.order.update({
                where: { id },
                data: {
                    status: "DELIVERED",
                    deliveredAt: order.deliveredAt || new Date(),
                    confirmedAt: new Date(),
                },
            });

            // Get or create supplier wallet
            let supplierWallet = await tx.wallet.findFirst({
                where: { userId: order.supplier.userId },
            });

            if (!supplierWallet) {
                supplierWallet = await tx.wallet.create({
                    data: {
                        userId: order.supplier.userId,
                        balance: 0,
                        lockedBalance: 0,
                        status: "ACTIVE",
                    },
                });
            }

            // Calculate payout (total minus platform fee - already included in pricing)
            const payoutAmount = order.totalPrice;

            // Create transaction for escrow release
            await tx.transaction.create({
                data: {
                    walletId: supplierWallet.id,
                    type: "PAYMENT_RELEASE",
                    amount: payoutAmount,
                    status: "COMPLETED",
                    reference: `ORDER-${order.id}-RELEASE`,
                    description: `Payment released for order ${order.id}`,
                },
            });

            // Update supplier wallet balance
            await tx.wallet.update({
                where: { id: supplierWallet.id },
                data: {
                    balance: { increment: payoutAmount },
                },
            });

            // Get buyer wallet and update locked balance
            const buyerWallet = await tx.wallet.findFirst({
                where: { userId: order.buyer.userId },
            });

            if (buyerWallet) {
                await tx.wallet.update({
                    where: { id: buyerWallet.id },
                    data: {
                        lockedBalance: { decrement: order.totalPrice },
                    },
                });
            }

            return updatedOrder;
        });

        return NextResponse.json({
            success: true,
            message: "Delivery confirmed. Payment released to supplier.",
            order: {
                id: result.id,
                status: result.status,
                confirmedAt: result.confirmedAt,
            },
        });

    } catch (error) {
        console.error("Error confirming delivery:", error);
        return NextResponse.json({ error: "Failed to confirm delivery" }, { status: 500 });
    }
}
