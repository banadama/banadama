// app/api/wallet/route.ts
import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const { user, error } = await requireApiRole([
            "BUYER",
            "SUPPLIER",
            "CREATOR",
            "AFFILIATE",
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const wallet = await db.wallet.findUnique({
            where: { userId: user!.id },
            include: {
                transactions: {
                    take: 10,
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!wallet) {
            // Create wallet if doesn't exist
            const newWallet = await db.wallet.create({
                data: {
                    userId: user!.id,
                    balance: 0,
                    lockedBalance: 0,
                    currency: "NGN",
                    status: "ACTIVE",
                },
            });

            return NextResponse.json({
                wallet: {
                    balance: 0,
                    lockedBalance: 0,
                    availableBalance: 0,
                    currency: "NGN",
                    status: "ACTIVE",
                },
                recentTransactions: [],
            });
        }

        return NextResponse.json({
            wallet: {
                balance: wallet.balance,
                lockedBalance: wallet.lockedBalance,
                availableBalance: wallet.balance,
                currency: wallet.currency,
                status: wallet.status,
            },
            recentTransactions: wallet.transactions.map((t) => ({
                id: t.id,
                amount: t.amount,
                type: t.type,
                status: t.status,
                description: t.description,
                createdAt: t.createdAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching wallet:", error);
        return NextResponse.json(
            { error: "Failed to fetch wallet" },
            { status: 500 }
        );
    }
}
