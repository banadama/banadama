// app/api/wallet/transactions/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";


export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const status = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const wallet = await db.wallet.findUnique({
            where: { userId: user!.id },
        });

        if (!wallet) {
            return NextResponse.json({ transactions: [], total: 0 });
        }

        const where: any = { walletId: wallet.id };
        if (type) where.type = type;
        if (status) where.status = status;

        const [transactions, total] = await Promise.all([
            db.transaction.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
            }),
            db.transaction.count({ where }),
        ]);

        return NextResponse.json({
            transactions: transactions.map((t) => ({
                id: t.id,
                amount: t.amount,
                type: t.type,
                status: t.status,
                reference: t.reference,
                description: t.description,
                createdAt: t.createdAt,
            })),
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}
