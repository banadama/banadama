// app/api/ops/rfqs/route.ts - OPS RFQ Queue
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status) {
        where.status = status;
    }

    try {
        const [requests, total] = await Promise.all([
            db.request.findMany({
                where,
                include: {
                    buyer: {
                        select: {
                            user: { select: { email: true } },
                        },
                    },
                    product: {
                        select: { name: true },
                    },
                    assignedSupplier: {
                        select: { businessName: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.request.count({ where }),
        ]);

        const formatted = requests.map((r) => ({
            id: r.id,
            productName: r.product?.name || r.productName || 'Unknown',
            quantity: r.quantity,
            status: r.status,
            buyerEmail: r.buyer?.user?.email || 'Unknown',
            createdAt: r.createdAt,
            assignedSupplier: r.assignedSupplier,
        }));

        return NextResponse.json({
            requests: formatted,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching RFQs:', err);
        return NextResponse.json({ error: 'Failed to fetch RFQs' }, { status: 500 });
    }
}
