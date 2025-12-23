// app/api/ops/analytics/route.ts - Ops Personal Analytics (Limited)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('OPS');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        // Get ops-specific insights
        const recentInsights = await db.aIInsight.findMany({
            where: {
                visibleToRoles: { has: 'OPS' },
                status: 'ACTIVE',
                agentType: 'OPS_AI',
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        // Note: Personal metrics would come from a real OpsMetric lookup
        // This is simplified for MVP
        return NextResponse.json({
            personalMetrics: {
                rfqsHandled: 25,
                avgResponseTimeHours: 8,
                ordersProcessed: 15,
                onTimeRate: 0.93,
            },
            teamAverages: {
                avgResponseTimeHours: 12,
                avgOnTimeRate: 0.88,
            },
            myRanking: {
                position: 3,
                total: 10,
            },
            recentInsights: recentInsights.map((i) => ({
                id: i.id,
                title: i.title,
                description: i.description,
                priority: i.priority,
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch ops analytics' }, { status: 500 });
    }
}
