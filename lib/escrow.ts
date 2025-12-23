// lib/escrow.ts
/**
 * Escrow Management Library
 * 
 * Handles all escrow-related operations:
 * - Lock funds on payment
 * - Release to supplier on delivery confirmation
 * - Refund to buyer on cancellation/dispute
 */

import { db } from "./db";
import { TransactionType, TransactionStatus } from "@prisma/client";

export interface EscrowLockParams {
    buyerUserId: string;
    orderId: string;
    amount: number;
    description?: string;
}

export interface EscrowReleaseParams {
    orderId: string;
    supplierUserId: string;
    amount: number;
    description?: string;
}

export interface EscrowRefundParams {
    orderId: string;
    buyerUserId: string;
    amount: number;
    reason?: string;
}

/**
 * Lock funds in escrow when buyer pays
 */
export async function lockFundsInEscrow(params: EscrowLockParams) {
    const { buyerUserId, orderId, amount, description } = params;

    return await db.$transaction(async (tx) => {
        // Get or create buyer wallet
        let wallet = await tx.wallet.findFirst({
            where: { userId: buyerUserId },
        });

        if (!wallet) {
            wallet = await tx.wallet.create({
                data: {
                    userId: buyerUserId,
                    balance: 0,
                    lockedBalance: 0,
                    status: "ACTIVE",
                },
            });
        }

        // Check if buyer has enough balance
        if (wallet.balance < amount) {
            throw new Error("Insufficient balance");
        }

        // Deduct from available balance and add to locked
        await tx.wallet.update({
            where: { id: wallet.id },
            data: {
                balance: { decrement: amount },
                lockedBalance: { increment: amount },
            },
        });

        // Create escrow lock transaction
        const transaction = await tx.transaction.create({
            data: {
                walletId: wallet.id,
                type: "PAYMENT_ESCROW",
                amount: -amount, // Negative because it's locked
                status: "COMPLETED",
                reference: `ESCROW-LOCK-${orderId}`,
                description: description || `Escrow lock for order ${orderId}`,
            },
        });

        return {
            success: true,
            transactionId: transaction.id,
            lockedAmount: amount,
        };
    });
}

/**
 * Release escrow funds to supplier when delivery is confirmed
 */
export async function releaseEscrowToSupplier(params: EscrowReleaseParams) {
    const { orderId, supplierUserId, amount, description } = params;

    return await db.$transaction(async (tx) => {
        // Get the order to find buyer
        const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { buyer: true },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // Get buyer wallet
        const buyerWallet = await tx.wallet.findFirst({
            where: { userId: order.buyer.userId },
        });

        if (buyerWallet) {
            // Deduct from locked balance
            await tx.wallet.update({
                where: { id: buyerWallet.id },
                data: {
                    lockedBalance: { decrement: amount },
                },
            });
        }

        // Get or create supplier wallet
        let supplierWallet = await tx.wallet.findFirst({
            where: { userId: supplierUserId },
        });

        if (!supplierWallet) {
            supplierWallet = await tx.wallet.create({
                data: {
                    userId: supplierUserId,
                    balance: 0,
                    lockedBalance: 0,
                    status: "ACTIVE",
                },
            });
        }

        // Add to supplier balance
        await tx.wallet.update({
            where: { id: supplierWallet.id },
            data: {
                balance: { increment: amount },
            },
        });

        // Create release transaction for supplier
        const transaction = await tx.transaction.create({
            data: {
                walletId: supplierWallet.id,
                type: "PAYMENT_RELEASE",
                amount: amount,
                status: "COMPLETED",
                reference: `ESCROW-RELEASE-${orderId}`,
                description: description || `Payment released for order ${orderId}`,
            },
        });

        return {
            success: true,
            transactionId: transaction.id,
            releasedAmount: amount,
        };
    });
}

/**
 * Refund escrow to buyer (cancellation/dispute)
 */
export async function refundEscrowToBuyer(params: EscrowRefundParams) {
    const { orderId, buyerUserId, amount, reason } = params;

    return await db.$transaction(async (tx) => {
        // Get buyer wallet
        const wallet = await tx.wallet.findFirst({
            where: { userId: buyerUserId },
        });

        if (!wallet) {
            throw new Error("Buyer wallet not found");
        }

        // Move from locked back to available
        await tx.wallet.update({
            where: { id: wallet.id },
            data: {
                balance: { increment: amount },
                lockedBalance: { decrement: amount },
            },
        });

        // Create refund transaction
        const transaction = await tx.transaction.create({
            data: {
                walletId: wallet.id,
                type: "REFUND",
                amount: amount,
                status: "COMPLETED",
                reference: `ESCROW-REFUND-${orderId}`,
                description: reason || `Refund for order ${orderId}`,
            },
        });

        return {
            success: true,
            transactionId: transaction.id,
            refundedAmount: amount,
        };
    });
}

/**
 * Get escrow status for an order
 */
export async function getOrderEscrowStatus(orderId: string) {
    const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
            buyer: { include: { user: true } },
            supplier: { include: { user: true } },
        },
    });

    if (!order) {
        return null;
    }

    // Check for escrow transactions
    const buyerWallet = await db.wallet.findFirst({
        where: { userId: order.buyer.userId },
    });

    const transactions = buyerWallet
        ? await db.transaction.findMany({
            where: {
                walletId: buyerWallet.id,
                reference: { contains: orderId },
            },
        })
        : [];

    const hasLock = transactions.some((t) => t.type === "PAYMENT_ESCROW");
    const hasRelease = transactions.some((t) => t.type === "PAYMENT_RELEASE");
    const hasRefund = transactions.some((t) => t.type === "REFUND");

    return {
        orderId,
        orderStatus: order.status,
        escrowStatus: hasRefund
            ? "REFUNDED"
            : hasRelease
                ? "RELEASED"
                : hasLock
                    ? "LOCKED"
                    : "NONE",
        amount: order.totalPrice,
        transactions: transactions.map((t) => ({
            type: t.type,
            amount: t.amount,
            status: t.status,
            createdAt: t.createdAt,
        })),
    };
}

/**
 * Calculate platform fee
 */
export function calculatePlatformFee(orderTotal: number): number {
    // 5.2% fulfillment fee
    return orderTotal * 0.052;
}

/**
 * Calculate supplier payout (after platform fee)
 */
export function calculateSupplierPayout(orderTotal: number): number {
    const platformFee = calculatePlatformFee(orderTotal);
    return orderTotal - platformFee;
}
/**
 * Release creator escrow funds to creator
 */
export async function releaseCreatorEscrow(params: { orderId: string, amount?: number, description?: string }) {
    const { orderId, amount, description } = params;

    return await db.$transaction(async (tx) => {
        const order = await (tx as any).creatorOrder.findUnique({
            where: { id: orderId },
            include: { creator: { include: { user: true } }, buyer: true }
        });

        if (!order) throw new Error("Order not found");
        if (!order.creator.user) throw new Error("Creator user mapping not found");

        const amountToRelease = amount ?? order.subtotal; // Default to subtotal
        // Platform fees stayed with platform (deducted from buyer during checkout)

        // 1. Deduct from buyer's locked balance (only the specific lock for this order)
        const buyerWallet = await tx.wallet.findFirst({
            where: { userId: order.buyerUserId },
        });

        if (buyerWallet) {
            await tx.wallet.update({
                where: { id: buyerWallet.id },
                data: {
                    // Note: If partial, we might only decrement the amountToRelease part? 
                    // No, usually we release the lock entirely.
                    lockedBalance: { decrement: order.total },
                },
            });
        }

        // 2. Add subtotal/amount to creator balance
        let creatorWallet = await tx.wallet.findFirst({
            where: { userId: order.creator.userId },
        });

        if (!creatorWallet) {
            creatorWallet = await tx.wallet.create({
                data: {
                    userId: order.creator.userId,
                    balance: 0,
                    lockedBalance: 0,
                    status: "ACTIVE",
                },
            });
        }

        await tx.wallet.update({
            where: { id: creatorWallet.id },
            data: {
                balance: { increment: amountToRelease },
            },
        });

        // 3. Create release transaction
        const transaction = await tx.transaction.create({
            data: {
                walletId: creatorWallet.id,
                type: "PAYMENT_RELEASE",
                amount: amountToRelease,
                status: "COMPLETED",
                reference: `CREATOR-ESCROW-RELEASE-${orderId}`,
                description: description || `Payment released for creator order ${orderId}`,
            },
        });

        return {
            success: true,
            transactionId: transaction.id,
            releasedAmount: amountToRelease,
        };
    });
}

/**
 * Refund creator escrow to buyer
 */
export async function refundCreatorEscrow(params: { orderId: string, amount?: number, reason?: string }) {
    const { orderId, amount, reason } = params;

    return await db.$transaction(async (tx) => {
        const order = await (tx as any).creatorOrder.findUnique({
            where: { id: orderId },
        });

        if (!order) throw new Error("Order not found");

        const refundTotal = amount ?? order.total;

        const buyerWallet = await tx.wallet.findFirst({
            where: { userId: order.buyerUserId },
        });

        if (!buyerWallet) throw new Error("Buyer wallet not found");

        // Move from locked back to available
        await tx.wallet.update({
            where: { id: buyerWallet.id },
            data: {
                balance: { increment: refundTotal },
                lockedBalance: { decrement: order.total }, // Unlock the specific lock amount
            },
        });

        const transaction = await tx.transaction.create({
            data: {
                walletId: buyerWallet.id,
                type: "REFUND",
                amount: refundTotal,
                status: "COMPLETED",
                reference: `CREATOR-ESCROW-REFUND-${orderId}`,
                description: reason || `Refund for creator order ${orderId}`,
            },
        });

        return {
            success: true,
            transactionId: transaction.id,
            refundedAmount: refundTotal,
        };
    });
}
