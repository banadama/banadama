// app/api/growth/withdraw/route.ts - Withdrawal Request

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function POST(request: NextRequest) {
    const { user, error } = await requireApiRole('GROWTH_AGENT');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const agent = await db.growthAgentProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!agent) {
            return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }

        // Calculate unlocked earnings
        const unlocked = await db.growthEarning.aggregate({
            _sum: { amount: true },
            where: { agentId: agent.id, status: 'UNLOCKED' },
        });

        const unlockedAmount = unlocked._sum.amount || 0;

        // Check minimum
        const settings = await db.growthSettings.findFirst();
        const minimumPayout = settings?.minimumPayout || 500000;

        if (unlockedAmount < minimumPayout) {
            return NextResponse.json({
                error: `Minimum withdrawal is ₦${(minimumPayout / 100).toLocaleString()}`
            }, { status: 400 });
        }

        // Check for existing pending payout
        const existingPending = await db.growthPayout.findFirst({
            where: { agentId: agent.id, status: { in: ['PENDING', 'PENDING_FINANCE', 'PROCESSING'] } },
        });

        if (existingPending) {
            return NextResponse.json({
                error: 'You have a pending withdrawal request'
            }, { status: 400 });
        }

        // Create payout request
        const payout = await db.growthPayout.create({
            data: {
                agentId: agent.id,
                amount: unlockedAmount,
                status: 'PENDING_FINANCE',
            },
        });

        // Mark unlocked earnings as pending payout (don't change status yet)

        await logAdminAction({
            adminId: user!.id,
            action: 'GROWTH_PAYOUT_REQUEST',
            targetType: 'GROWTH_PAYOUT',
            targetId: payout.id,
            after: createSnapshot(payout),
        });

        return NextResponse.json({
            success: true,
            payout,
            message: 'Withdrawal request submitted. Finance will review.',
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to submit withdrawal' }, { status: 500 });
    }
}
