// app/api/wallet/withdraw/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";


export async function POST(request: NextRequest) {
    try {
        const { user, error } = await requireApiRole([
            "SUPPLIER",
            "CREATOR",
            "AFFILIATE",
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const body = await request.json();
        const { amount, accountDetails } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            );
        }

        if (!accountDetails) {
            return NextResponse.json(
                { error: "Account details required" },
                { status: 400 }
            );
        }

        // Get wallet
        const wallet = await db.wallet.findUnique({
            where: { userId: user!.id },
        });

        if (!wallet) {
            return NextResponse.json(
                { error: "Wallet not found" },
                { status: 404 }
            );
        }

        // Check balance
        if (wallet.balance < amount) {
            return NextResponse.json(
                { error: "Insufficient balance" },
                { status: 400 }
            );
        }

        // Create withdrawal transaction
        const transaction = await db.transaction.create({
            data: {
                walletId: wallet.id,
                amount: -amount, // Negative for withdrawal
                type: "WITHDRAWAL",
                status: "PENDING",
                reference: `WD-${Date.now()}`,
                description: "Withdrawal request",
                metadata: accountDetails,
            },
        });

        // Deduct from balance (will be refunded if rejected)
        await db.wallet.update({
            where: { id: wallet.id },
            data: {
                balance: { decrement: amount },
            },
        });

        return NextResponse.json({
            success: true,
            transaction: {
                id: transaction.id,
                amount: Math.abs(transaction.amount),
                status: transaction.status,
                reference: transaction.reference,
            },
            message: "Withdrawal request submitted. Processing within 1-3 business days.",
        });
    } catch (error) {
        console.error("Error processing withdrawal:", error);
        return NextResponse.json(
            { error: "Failed to process withdrawal" },
            { status: 500 }
        );
    }
}
