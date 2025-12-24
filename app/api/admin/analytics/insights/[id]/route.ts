// app/api/admin/analytics/insights/[id]/route.ts - Insight Actions

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user, error } = await requireApiRole(['ADMIN', 'OPS', 'FINANCE_ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { action } = await request.json();

        const insight = await db.aIInsight.findUnique({
            where: { id },
        });

        if (!insight) {
            return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
        }

        // Check role access
        if (!insight.visibleToRoles.includes(user!.role)) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const before = createSnapshot(insight);
        let updateData: Record<string, unknown> = {};

        switch (action) {
            case 'acknowledge':
                updateData = {
                    status: 'ACKNOWLEDGED',
                    acknowledgedByUserId: user!.id,
                    acknowledgedAt: new Date(),
                };
                break;
            case 'dismiss':
                updateData = {
                    status: 'DISMISSED',
                    dismissedByUserId: user!.id,
                    dismissedAt: new Date(),
                };
                break;
            case 'acted':
                updateData = {
                    status: 'ACTED_UPON',
                    actedUponByUserId: user!.id,
                    actedUponAt: new Date(),
                };
                break;
            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        const updated = await db.aIInsight.update({
            where: { id },
            data: updateData,
        });

        await logAdminAction({
            adminId: user!.id,
            action: `AI_INSIGHT_${action.toUpperCase()}`,
            targetType: 'AI_INSIGHT',
            targetId: id,
            before,
            after: createSnapshot(updated),
        });

        // NOTE: This only updates the insight status
        // AI NEVER auto-executes any action

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update insight' }, { status: 500 });
    }
}
