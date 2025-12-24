// app/api/affiliate/earnings/route.ts - Affiliate Earnings Summary

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('AFFILIATE');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const affiliate = await db.affiliateProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!affiliate) {
            return NextResponse.json({
                summary: { totalEarnings: 0, pendingEarnings: 0, availableToWithdraw: 0, paidEarnings: 0 },
                history: [],
            });
        }

        // Calculate available to withdraw (delivered sales not yet paid)
        const availableEarnings = await db.affiliateSale.aggregate({
            _sum: { commissionAmount: true },
            where: {
                affiliateId: affiliate.id,
                status: 'DELIVERED',
            },
        });

        // Get pending payouts amount
        const pendingPayoutsTotal = await db.affiliatePayout.aggregate({
            _sum: { amount: true },
            where: {
                affiliateId: affiliate.id,
                status: { in: ['PENDING', 'PENDING_FINANCE', 'APPROVED', 'PROCESSING'] },
            },
        });

        const availableToWithdraw = (availableEarnings._sum.commissionAmount || 0) - (pendingPayoutsTotal._sum.amount || 0);

        // Build earnings history from sales and payouts
        const [recentSales, recentPayouts] = await Promise.all([
            db.affiliateSale.findMany({
                where: { affiliateId: affiliate.id, status: { in: ['DELIVERED', 'PAID'] } },
                orderBy: { createdAt: 'desc' },
                take: 20,
            }),
            db.affiliatePayout.findMany({
                where: { affiliateId: affiliate.id },
                orderBy: { createdAt: 'desc' },
                take: 20,
            }),
        ]);

        const history = [
            ...recentSales.map((s) => ({
                id: s.id,
                type: 'COMMISSION',
                amount: s.commissionAmount,
                status: s.status === 'PAID' ? 'COMPLETED' : 'PENDING',
                description: `Order ${s.orderId.substring(0, 8)}...`,
                createdAt: s.createdAt.toISOString(),
            })),
            ...recentPayouts.map((p) => ({
                id: p.id,
                type: 'WITHDRAWAL',
                amount: -p.amount,
                status: p.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
                description: `Withdrawal request`,
                createdAt: p.createdAt.toISOString(),
            })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({
            summary: {
                totalEarnings: affiliate.totalEarnings,
                pendingEarnings: affiliate.pendingEarnings,
                availableToWithdraw: Math.max(0, availableToWithdraw),
                paidEarnings: affiliate.paidEarnings,
            },
            history,
        });
    } catch (err) {
        console.error('Error fetching earnings:', err);
        return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 });
    }
}
