// app/api/admin/finance/wallets/route.ts - Wallet List API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    try {
        const where: Record<string, unknown> = {};
        if (search) {
            where.account = {
                name: { contains: search, mode: 'insensitive' },
            };
        }

        const [wallets, total, platformWallets] = await Promise.all([
            db.accountWallet.findMany({
                where,
                include: {
                    account: {
                        select: { name: true, accountType: true },
                    },
                },
                orderBy: { availableBalance: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.accountWallet.count({ where }),
            db.platformWallet.findMany(),
        ]);

        return NextResponse.json({
            wallets,
            platformWallets,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching wallets:', err);
        return NextResponse.json({
            wallets: [],
            platformWallets: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        });
    }
}
