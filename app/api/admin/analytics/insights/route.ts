// app/api/admin/analytics/insights/route.ts - AI Insights List
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole(['ADMIN', 'OPS', 'FINANCE_ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ACTIVE';

    try {
        const where: Record<string, unknown> = {
            visibleToRoles: { has: user!.role },
        };

        if (status !== 'ALL') {
            where.status = status;
        }

        const insights = await db.aIInsight.findMany({
            where,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' },
            ],
            take: 50,
        });

        return NextResponse.json({
            insights: insights.map((i) => ({
                id: i.id,
                agentType: i.agentType,
                title: i.title,
                description: i.description,
                priority: i.priority,
                status: i.status,
                suggestedAction: i.suggestedAction,
                targetType: i.targetType,
                createdAt: i.createdAt.toISOString(),
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ insights: [] });
    }
}
