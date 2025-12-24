// app/api/admin/finance/refunds/route.ts - Refund List API

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
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    try {
        const where: Record<string, unknown> = {};
        if (status) {
            where.status = status;
        }

        const [refunds, total] = await Promise.all([
            db.financeRefund.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.financeRefund.count({ where }),
        ]);

        return NextResponse.json({
            refunds,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching refunds:', err);
        return NextResponse.json({
            refunds: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        });
    }
}
