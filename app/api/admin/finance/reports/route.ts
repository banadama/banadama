// app/api/admin/finance/reports/route.ts - Financial Reports API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Build report based on period
        const report = {
            daily: {
                date: today.toISOString(),
                escrowLocked: 0,
                payoutsReleased: 0,
                refundsIssued: 0,
                platformFees: 0,
            },
            weekly: {
                platformRevenue: 0,
                supplierEarnings: 0,
                totalTransactions: 0,
            },
            monthly: {
                byCountry: [] as Array<{ country: string; revenue: number; fees: number }>,
                byCategory: [] as Array<{ category: string; revenue: number; fees: number }>,
            },
        };

        try {
            // Daily stats
            const [todayEscrow, todayReleased, todayRefunds, todayFees] = await Promise.all([
                db.escrow.aggregate({
                    _sum: { totalAmount: true },
                    where: { lockedAt: { gte: today, lt: tomorrow } },
                }),
                db.escrow.aggregate({
                    _sum: { releasedAmount: true },
                    where: { releasedAt: { gte: today, lt: tomorrow } },
                }),
                db.financeRefund.aggregate({
                    _sum: { approvedAmount: true },
                    where: { status: 'COMPLETED', processedAt: { gte: today, lt: tomorrow } },
                }),
                db.escrow.aggregate({
                    _sum: { platformFeeAmount: true },
                    where: { releasedAt: { gte: today, lt: tomorrow } },
                }),
            ]);

            report.daily.escrowLocked = todayEscrow._sum.totalAmount || 0;
            report.daily.payoutsReleased = todayReleased._sum.releasedAmount || 0;
            report.daily.refundsIssued = todayRefunds._sum.approvedAmount || 0;
            report.daily.platformFees = todayFees._sum.platformFeeAmount || 0;

            // Weekly stats
            const [weeklyFees, weeklyPayouts, weeklyTx] = await Promise.all([
                db.escrow.aggregate({
                    _sum: { platformFeeAmount: true },
                    where: { releasedAt: { gte: startOfWeek } },
                }),
                db.escrow.aggregate({
                    _sum: { releasedAmount: true },
                    where: { releasedAt: { gte: startOfWeek } },
                }),
                db.ledgerEntry.count({
                    where: { createdAt: { gte: startOfWeek } },
                }),
            ]);

            report.weekly.platformRevenue = weeklyFees._sum.platformFeeAmount || 0;
            report.weekly.supplierEarnings = weeklyPayouts._sum.releasedAmount || 0;
            report.weekly.totalTransactions = weeklyTx;

            // Monthly by country (placeholder - would need order country data)
            report.monthly.byCountry = [
                { country: 'NG', revenue: 0, fees: 0 },
                { country: 'BD', revenue: 0, fees: 0 },
            ];

            // Monthly by category (placeholder)
            report.monthly.byCategory = [];

        } catch {
            console.log('Finance models not migrated, returning placeholder report');
        }

        return NextResponse.json(report);
    } catch (err) {
        console.error('Error generating report:', err);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
