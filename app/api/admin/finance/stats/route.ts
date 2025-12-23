// app/api/admin/finance/stats/route.ts - Finance Dashboard Stats
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get aggregate stats
        // Note: These queries assume Escrow, FinancePayout, FinanceRefund models exist
        // If not, return placeholder data

        const stats = {
            totalEscrowLocked: 0,
            totalPendingPayouts: 0,
            totalPendingRefunds: 0,
            todayReleased: 0,
            todayRefunded: 0,
            platformBalance: 0,
            platformFees: 0,
        };

        try {
            // Try to get escrow data
            const escrowStats = await db.escrow.aggregate({
                _sum: { totalAmount: true },
                where: { status: 'LOCKED' },
            });
            stats.totalEscrowLocked = escrowStats._sum.totalAmount || 0;

            // Today's released
            const todayReleased = await db.escrow.aggregate({
                _sum: { releasedAmount: true },
                where: { releasedAt: { gte: today, lt: tomorrow } },
            });
            stats.todayReleased = todayReleased._sum.releasedAmount || 0;

            // Pending payouts
            const pendingPayouts = await db.financePayout.aggregate({
                _sum: { netAmount: true },
                where: { status: { in: ['PENDING_APPROVAL', 'APPROVED'] } },
            });
            stats.totalPendingPayouts = pendingPayouts._sum.netAmount || 0;

            // Pending refunds
            const pendingRefunds = await db.financeRefund.aggregate({
                _sum: { requestedAmount: true },
                where: { status: { in: ['PENDING_REVIEW', 'APPROVED'] } },
            });
            stats.totalPendingRefunds = pendingRefunds._sum.requestedAmount || 0;

            // Platform fees (this month)
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const platformFees = await db.escrow.aggregate({
                _sum: { platformFeeAmount: true },
                where: { releasedAt: { gte: startOfMonth } },
            });
            stats.platformFees = platformFees._sum.platformFeeAmount || 0;

        } catch {
            // Models might not exist yet, return placeholder
            console.log('Finance models not yet migrated, returning placeholder stats');
        }

        return NextResponse.json(stats);
    } catch (err) {
        console.error('Error fetching finance stats:', err);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
