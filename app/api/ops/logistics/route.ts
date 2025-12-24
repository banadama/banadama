// app/api/ops/logistics/route.ts - Ops Logistics List

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

        const [shipments, total, pending, inTransit, delivered, failed] = await Promise.all([
            db.shipment.findMany({
                where,
                include: {
                    order: {
                        select: {
                            productName: true,
                            buyer: { select: { user: { select: { name: true } } } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.shipment.count({ where }),
            db.shipment.count({ where: { status: 'PENDING' } }),
            db.shipment.count({ where: { status: { in: ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] } } }),
            db.shipment.count({ where: { status: 'DELIVERED' } }),
            db.shipment.count({ where: { status: 'FAILED' } }),
        ]);

        const formatted = shipments.map((s) => ({
            ...s,
            order: {
                productName: s.order?.productName,
                buyerName: s.order?.buyer?.user?.name,
            },
        }));

        return NextResponse.json({
            shipments: formatted,
            stats: { pending, inTransit, delivered, failed },
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({
            shipments: [],
            stats: { pending: 0, inTransit: 0, delivered: 0, failed: 0 },
            pagination: { page, limit, total: 0, totalPages: 0 },
        });
    }
}
