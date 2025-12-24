// app/api/ops/international-orders/route.ts - Ops International Orders List

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
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

    try {
        const where: Record<string, unknown> = {};
        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            db.internationalOrder.findMany({
                where,
                include: {
                    order: {
                        select: {
                            productName: true,
                            buyer: { select: { user: { select: { email: true } } } },
                            supplier: { select: { businessName: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.internationalOrder.count({ where }),
        ]);

        const formatted = orders.map((o) => ({
            ...o,
            order: {
                productName: o.order?.productName,
                buyerEmail: o.order?.buyer?.user?.email,
                supplierName: o.order?.supplier?.businessName,
            },
        }));

        return NextResponse.json({
            orders: formatted,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({
            orders: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
        });
    }
}
