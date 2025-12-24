// app/api/admin/analytics/buyers/route.ts - Buyer Intelligence

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [totalBuyers, activeBuyers, highValueScores, atRiskScores] = await Promise.all([
            db.buyer.count(),
            db.order.groupBy({
                by: ['buyerId'],
                where: { createdAt: { gte: thirtyDaysAgo } },
                _count: true,
            }).then(r => r.length),
            db.buyerScore.findMany({
                where: { isHighValue: true },
                orderBy: { totalSpent: 'desc' },
                take: 10,
            }),
            db.buyerScore.findMany({
                where: { isAtRisk: true },
                take: 10,
            }),
        ]);

        // Enrich high value buyers
        const highValueBuyers = await Promise.all(
            highValueScores.map(async (s) => {
                const buyer = await db.buyer.findUnique({
                    where: { id: s.buyerId },
                    select: { user: { select: { name: true, email: true } } },
                });
                return {
                    id: s.buyerId,
                    name: buyer?.user?.name || 'Unknown',
                    email: buyer?.user?.email || '',
                    totalSpent: s.totalSpent,
                    totalOrders: s.totalOrders,
                    avgOrderValue: s.avgOrderValue || 0,
                    conversionRate: s.totalRfqs > 0 ? s.convertedRfqs / s.totalRfqs : 0,
                };
            })
        );

        // Enrich at-risk buyers
        const atRiskBuyers = await Promise.all(
            atRiskScores.map(async (s) => {
                const buyer = await db.buyer.findUnique({
                    where: { id: s.buyerId },
                    select: { user: { select: { name: true } } },
                });
                // Get last order date
                const lastOrder = await db.order.findFirst({
                    where: { buyerId: s.buyerId },
                    orderBy: { createdAt: 'desc' },
                    select: { createdAt: true },
                });
                const daysSince = lastOrder
                    ? Math.floor((Date.now() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
                    : 999;
                return {
                    id: s.buyerId,
                    name: buyer?.user?.name || 'Unknown',
                    lastOrderDays: daysSince,
                    abandonedRfqs: s.abandonedRfqs,
                };
            })
        );

        // Abandoned RFQs
        const abandonedRfqs = await db.rfq.findMany({
            where: { status: { in: ['PENDING', 'EXPIRED'] } },
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                id: true,
                productCategory: true,
                createdAt: true,
                budget: true,
            },
        });

        // Averages
        const avgScores = await db.buyerScore.aggregate({
            _avg: {
                totalRfqs: true,
                avgOrderValue: true,
            },
        });

        return NextResponse.json({
            totalBuyers,
            activeBuyers,
            highValueBuyers,
            atRiskBuyers,
            abandonedRfqs: abandonedRfqs.map(r => ({
                id: r.id,
                category: r.productCategory || 'Unknown',
                createdAt: r.createdAt.toISOString(),
                estimatedValue: r.budget || 0,
            })),
            avgMetrics: {
                rfqFrequency: avgScores._avg.totalRfqs || 2,
                conversionRate: 0.35,
                avgOrderValue: avgScores._avg.avgOrderValue || 50000,
            },
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch buyer analytics' }, { status: 500 });
    }
}
