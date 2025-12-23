// app/api/admin/analytics/ops/route.ts - Ops Performance Analytics
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'WEEKLY';

    try {
        const metric = await db.opsMetric.findFirst({
            where: { period: period as 'DAILY' | 'WEEKLY' | 'MONTHLY' },
            orderBy: { periodStart: 'desc' },
        });

        if (metric) {
            return NextResponse.json({
                period,
                avgRfqResponseTimeHours: metric.avgRfqResponseTimeHours || 12,
                avgOrderProcessingHours: metric.avgOrderProcessingHours || 24,
                avgDeliveryTimeHours: metric.avgDeliveryTimeHours || 48,
                avgChatResponseTimeMinutes: metric.avgChatResponseTimeMinutes || 15,
                rfqsCompleted: metric.rfqsCompleted,
                ordersProcessed: metric.ordersProcessed,
                deliveriesOnTime: metric.deliveriesOnTime,
                deliveriesLate: metric.deliveriesLate,
                onTimeRate: metric.deliveriesOnTime + metric.deliveriesLate > 0
                    ? metric.deliveriesOnTime / (metric.deliveriesOnTime + metric.deliveriesLate)
                    : 1,
                opsUserMetrics: metric.opsUserMetrics || [],
            });
        }

        // Default values if no snapshot
        return NextResponse.json({
            period,
            avgRfqResponseTimeHours: 12,
            avgOrderProcessingHours: 24,
            avgDeliveryTimeHours: 48,
            avgChatResponseTimeMinutes: 15,
            rfqsCompleted: 0,
            ordersProcessed: 0,
            deliveriesOnTime: 0,
            deliveriesLate: 0,
            onTimeRate: 1,
            opsUserMetrics: [],
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch ops analytics' }, { status: 500 });
    }
}
