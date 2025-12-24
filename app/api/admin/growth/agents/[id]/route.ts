// app/api/admin/growth/agents/[id]/route.ts - Agent Actions

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
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { action, reason, ...updates } = await request.json();

        const agent = await db.growthAgentProfile.findUnique({
            where: { id },
        });

        if (!agent) {
            return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }

        const before = createSnapshot(agent);

        let updateData: Record<string, unknown> = {};

        switch (action) {
            case 'approve':
                updateData = {
                    status: 'ACTIVE',
                    approvedAt: new Date(),
                    approvedByAdminId: user!.id,
                };
                break;
            case 'activate':
                updateData = {
                    status: 'ACTIVE',
                    suspendedAt: null,
                    suspendReason: null,
                };
                break;
            case 'suspend':
                updateData = {
                    status: 'SUSPENDED',
                    suspendedAt: new Date(),
                    suspendedByAdminId: user!.id,
                    suspendReason: reason,
                };
                break;
            case 'terminate':
                updateData = {
                    status: 'TERMINATED',
                    suspendedAt: new Date(),
                    suspendedByAdminId: user!.id,
                    suspendReason: reason,
                };
                break;
            case 'update':
                updateData = updates;
                break;
            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        const updated = await db.growthAgentProfile.update({
            where: { id },
            data: updateData,
        });

        await logAdminAction({
            adminId: user!.id,
            action: `GROWTH_AGENT_${action.toUpperCase()}`,
            targetType: 'GROWTH_AGENT',
            targetId: id,
            before,
            after: createSnapshot(updated),
            metadata: { reason },
        });

        return NextResponse.json({ success: true, agent: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
    }
}
