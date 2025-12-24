// app/api/ops/reports/daily/route.ts - OPS Daily Reports & KPIs

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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Today's stats
        const [
            newRfqs,
            processedRfqs,
            newOrders,
            deliveredOrders,
            openDisputes,
            resolvedDisputes,
            verificationsPending,
            verificationsReviewed,
        ] = await Promise.all([
            db.request.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
            db.request.count({ where: { status: { not: 'PENDING' }, updatedAt: { gte: today, lt: tomorrow } } }),
            db.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
            db.order.count({ where: { status: 'DELIVERED', updatedAt: { gte: today, lt: tomorrow } } }),
            db.dispute.count({ where: { status: { in: ['OPEN', 'INVESTIGATING'] } } }),
            db.dispute.count({ where: { status: { in: ['RESOLVED_BUYER_FAVOR', 'RESOLVED_SUPPLIER_FAVOR', 'RESOLVED_PARTIAL', 'CLOSED'] }, updatedAt: { gte: today, lt: tomorrow } } }),
            db.verificationRequest.count({ where: { status: 'PENDING' } }),
            db.verificationRequest.count({ where: { status: { not: 'PENDING' }, updatedAt: { gte: today, lt: tomorrow } } }),
        ]);

        const todayStats = {
            date: today.toISOString(),
            newRfqs,
            processedRfqs,
            newOrders,
            deliveredOrders,
            openDisputes,
            resolvedDisputes,
            verificationsPending,
            verificationsReviewed,
            messagesReceived: 0, // TODO
            messagesReplied: 0, // TODO
        };

        // Weekly stats (simplified - just return today for now)
        const weekly = [todayStats];

        return NextResponse.json({
            today: todayStats,
            weekly,
        });
    } catch (err) {
        console.error('Error fetching daily reports:', err);
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}
