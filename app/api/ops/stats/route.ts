// app/api/ops/stats/route.ts - OPS Dashboard Stats

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

    try {
        const [
            pendingRfqs,
            pendingQuotes,
            activeOrders,
            openDisputes,
            pendingVerifications,
        ] = await Promise.all([
            db.request.count({ where: { status: 'PENDING' } }),
            db.request.count({ where: { status: 'QUOTED' } }),
            db.order.count({ where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED'] } } }),
            db.dispute.count({ where: { status: { in: ['OPEN', 'INVESTIGATING'] } } }),
            db.verificationRequest.count({ where: { status: 'PENDING' } }),
        ]);

        return NextResponse.json({
            pendingRfqs,
            pendingQuotes,
            activeOrders,
            openDisputes,
            pendingVerifications,
            unreadMessages: 0, // TODO: Implement message counting
        });
    } catch (err) {
        console.error('Error fetching ops stats:', err);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
