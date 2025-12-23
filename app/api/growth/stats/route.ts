// app/api/growth/stats/route.ts - Growth Agent Stats
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('GROWTH_AGENT');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const profile = await db.growthAgentProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!profile) {
            return NextResponse.json(null);
        }

        return NextResponse.json({
            status: profile.status,
            totalSuppliersOnboarded: profile.totalSuppliersOnboarded,
            activeSuppliersCount: profile.activeSuppliersCount,
            totalOrdersGenerated: profile.totalOrdersGenerated,
            totalEarnings: profile.totalEarnings,
            pendingEarnings: profile.pendingEarnings,
            paidEarnings: profile.paidEarnings,
            region: profile.region,
            territory: profile.territory,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
