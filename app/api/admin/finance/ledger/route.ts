// app/api/admin/finance/ledger/route.ts - Ledger List API

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
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        const where: Record<string, unknown> = {};
        if (type) {
            where.type = type;
        }

        const [entries, total] = await Promise.all([
            db.ledgerEntry.findMany({
                where,
                include: {
                    wallet: {
                        include: {
                            account: { select: { name: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.ledgerEntry.count({ where }),
        ]);

        return NextResponse.json({
            entries,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching ledger:', err);
        return NextResponse.json({
            entries: [],
            pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        });
    }
}
