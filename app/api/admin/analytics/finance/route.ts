// app/api/admin/analytics/finance/route.ts - Finance Analytics
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole(['ADMIN', 'FINANCE_ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'MONTHLY';

    try {
        const metric = await db.financeMetric.findFirst({
            where: { period: period as 'DAILY' | 'WEEKLY' | 'MONTHLY' },
            orderBy: { periodStart: 'desc' },
        });

        if (metric) {
            return NextResponse.json({
                period,
                escrowLocked: metric.escrowLocked,
                escrowReleased: metric.escrowReleased,
                escrowBalance: metric.escrowBalance,
                platformFees: metric.platformFees,
                supplierPayouts: metric.supplierPayouts,
                affiliatePayouts: metric.affiliatePayouts,
                growthPayouts: metric.growthPayouts,
                refundsIssued: metric.refundsIssued,
                refundCount: metric.refundCount,
                disputesOpened: metric.disputesOpened,
                disputesResolved: metric.disputesResolved,
                revenueByCategory: metric.revenueByCategory || [],
                revenueByCountry: metric.revenueByCountry || { nigeria: 0, bangladesh: 0, international: 0 },
            });
        }

        // Calculate live if no snapshot
        const [escrowBalance, disputes] = await Promise.all([
            db.escrowTransaction.aggregate({
                _sum: { amount: true },
                where: { status: 'HELD' },
            }),
            db.dispute.count(),
        ]);

        return NextResponse.json({
            period,
            escrowLocked: 0,
            escrowReleased: 0,
            escrowBalance: escrowBalance._sum.amount || 0,
            platformFees: 0,
            supplierPayouts: 0,
            affiliatePayouts: 0,
            growthPayouts: 0,
            refundsIssued: 0,
            refundCount: 0,
            disputesOpened: disputes,
            disputesResolved: 0,
            revenueByCategory: [],
            revenueByCountry: { nigeria: 0, bangladesh: 0, international: 0 },
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch finance analytics' }, { status: 500 });
    }
}
