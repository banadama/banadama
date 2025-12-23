// app/api/mobile/ops/stats/route.ts - OPS Mobile Stats
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('OPS');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const [pendingRfqs, activeOrders, pendingDeliveries, unreadMessages] = await Promise.all([
            db.rfq.count({ where: { status: 'PENDING' } }),
            db.order.count({ where: { status: { in: ['CONFIRMED', 'IN_PRODUCTION', 'READY'] } } }),
            db.shipment.count({ where: { status: { in: ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] } } }),
            0, // Would come from messaging system
        ]);

        return NextResponse.json({
            pendingRfqs,
            activeOrders,
            pendingDeliveries,
            unreadMessages,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({
            pendingRfqs: 0,
            activeOrders: 0,
            pendingDeliveries: 0,
            unreadMessages: 0,
        });
    }
}
