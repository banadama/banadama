// app/api/creator/stats/route.ts - Creator Stats
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('CREATOR');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const creator = await db.creatorProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!creator) {
            return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 });
        }

        // Get job stats
        const [activeJobs, completedJobs, wallet] = await Promise.all([
            db.creatorJob.count({
                where: { creatorId: creator.id, status: { in: ['ASSIGNED', 'IN_PROGRESS'] } },
            }),
            db.creatorJob.count({
                where: { creatorId: creator.id, status: 'COMPLETED' },
            }),
            db.wallet.findUnique({ where: { userId: user!.id } }),
        ]);

        // Get product stats
        const productStats = await db.creatorProduct.aggregate({
            _count: true,
            _sum: { totalSales: true, totalRevenue: true },
            where: { creatorId: creator.id, status: 'APPROVED' },
        });

        return NextResponse.json({
            activeJobs,
            completedJobs,
            productsListed: productStats._count || 0,
            productsSold: productStats._sum.totalSales || 0,
            totalEarnings: creator.totalEarnings,
            walletBalance: wallet?.balance || 0,
            hasBlueTick: creator.hasBlueTick,
            hasGreenTick: creator.hasGreenTick,
            creatorTypes: creator.creatorTypes,
            country: creator.country,
            isAvailableForJobs: creator.isAvailableForJobs,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({
            activeJobs: 0,
            completedJobs: 0,
            productsListed: 0,
            productsSold: 0,
            totalEarnings: 0,
            walletBalance: 0,
            hasBlueTick: false,
            hasGreenTick: false,
            creatorTypes: [],
            country: 'NG',
            isAvailableForJobs: false,
        });
    }
}
