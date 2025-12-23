// app/api/admin/finance/payouts/route.ts - Payout List API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    try {
        const where: Record<string, unknown> = {};
        if (status) {
            where.status = status;
        }

        const [payouts, total] = await Promise.all([
            db.financePayout.findMany({
                where,
                include: {
                    order: {
                        select: {
                            supplier: { select: { businessName: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.financePayout.count({ where }),
        ]);

        const formatted = payouts.map((p) => ({
            ...p,
            supplier: p.order?.supplier,
        }));

        return NextResponse.json({
            payouts: formatted,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching payouts:', err);
        return NextResponse.json({
            payouts: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        });
    }
}
