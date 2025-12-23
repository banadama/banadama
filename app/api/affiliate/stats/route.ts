// app/api/affiliate/stats/route.ts - Affiliate Dashboard Stats
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('AFFILIATE');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        // Get affiliate profile
        const affiliate = await db.affiliateProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!affiliate) {
            return NextResponse.json({ status: 'NOT_FOUND' }, { status: 200 });
        }

        // Get settings for commission rate
        const settings = await db.affiliateSettings.findFirst();
        const commissionRate = affiliate.customCommissionRate || settings?.defaultCommissionRate || 0.05;

        return NextResponse.json({
            status: affiliate.status,
            totalClicks: affiliate.totalClicks,
            totalSales: affiliate.totalSales,
            totalEarnings: affiliate.totalEarnings,
            pendingEarnings: affiliate.pendingEarnings,
            paidEarnings: affiliate.paidEarnings,
            commissionRate,
        });
    } catch (err) {
        console.error('Error fetching affiliate stats:', err);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
