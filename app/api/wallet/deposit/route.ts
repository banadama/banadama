// app/api/wallet/deposit/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";


export async function POST(request: NextRequest) {
    try {
        const { user, error } = await requireApiRole(["BUYER"]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const body = await request.json();
        const { amount, paymentReference } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
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

        // TODO: Integrate with payment gateway (Paystack/Flutterwave)
        // This is a placeholder - actual implementation should:
        // 1. Initialize payment with gateway
        // 2. Return payment URL
        // 3. Handle webhook to confirm payment
        // 4. Then create transaction

        const transaction = await db.transaction.create({
            data: {
                walletId: wallet.id,
                amount,
                type: "DEPOSIT",
                status: "PENDING",
                reference: paymentReference || `DEP-${Date.now()}`,
                description: "Wallet deposit",
            },
        });

        return NextResponse.json({
            success: true,
            transaction: {
                id: transaction.id,
                amount: transaction.amount,
                status: transaction.status,
                reference: transaction.reference,
            },
            // TODO: Return payment URL from gateway
            paymentUrl: `/payment/process/${transaction.id}`,
            message: "Deposit initiated. Complete payment to add funds.",
        });
    } catch (error) {
        console.error("Error processing deposit:", error);
        return NextResponse.json(
            { error: "Failed to process deposit" },
            { status: 500 }
        );
    }
}
