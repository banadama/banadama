// app/api/ops/orders/route.ts - OPS Order Tracking
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
        const [orders, total] = await Promise.all([
            db.order.findMany({
                where,
                include: {
                    buyer: {
                        select: {
                            user: { select: { email: true } },
                        },
                    },
                    supplier: {
                        select: { businessName: true },
                    },
                    product: {
                        select: { name: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.order.count({ where }),
        ]);

        const formatted = orders.map((o) => ({
            id: o.id,
            productName: o.product?.name || 'Unknown',
            quantity: o.quantity,
            totalAmount: o.totalAmount,
            status: o.status,
            buyerEmail: o.buyer?.user?.email || 'Unknown',
            supplierName: o.supplier?.businessName,
            createdAt: o.createdAt,
        }));

        return NextResponse.json({
            orders: formatted,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
