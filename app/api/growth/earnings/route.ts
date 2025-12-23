// app/api/growth/earnings/route.ts - Growth Earnings
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('GROWTH_AGENT');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const agent = await db.growthAgentProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!agent) {
            return NextResponse.json({
                summary: {
                    totalEarnings: 0,
                    pendingEarnings: 0,
                    unlockedEarnings: 0,
                    paidEarnings: 0,
                },
                earnings: [],
            });
        }

        const earnings = await db.growthEarning.findMany({
            where: { agentId: agent.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        // Calculate unlocked (not pending, not paid)
        const unlockedEarnings = await db.growthEarning.aggregate({
            _sum: { amount: true },
            where: { agentId: agent.id, status: 'UNLOCKED' },
        });

        return NextResponse.json({
            summary: {
                totalEarnings: agent.totalEarnings,
                pendingEarnings: agent.pendingEarnings,
                unlockedEarnings: unlockedEarnings._sum.amount || 0,
                paidEarnings: agent.paidEarnings,
            },
            earnings: earnings.map((e) => ({
                id: e.id,
                type: e.type,
                amount: e.amount,
                status: e.status,
                description: e.description,
                unlockProgress: e.unlockProgress,
                unlockTarget: e.unlockTarget,
                createdAt: e.createdAt.toISOString(),
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({
            summary: { totalEarnings: 0, pendingEarnings: 0, unlockedEarnings: 0, paidEarnings: 0 },
            earnings: []
        });
    }
}
