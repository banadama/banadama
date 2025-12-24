// app/api/admin/analytics/market/route.ts - Market Analytics

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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'WEEKLY';

    try {
        // Get snapshot or calculate live
        const snapshot = await db.analyticsSnapshot.findFirst({
            where: { period: period as 'DAILY' | 'WEEKLY' | 'MONTHLY' },
            orderBy: { periodStart: 'desc' },
        });

        if (snapshot) {
            return NextResponse.json({
                totalRfqs: snapshot.totalRfqs,
                totalOrders: snapshot.totalOrders,
                totalGmv: snapshot.totalGmv,
                platformRevenue: snapshot.totalPlatformRevenue,
                rfqToOrderRate: snapshot.rfqToOrderRate || 0,
                avgOrderValue: snapshot.avgOrderValue || 0,
                buyNowPercentage: snapshot.totalOrders > 0 ? snapshot.buyNowOrders / snapshot.totalOrders : 0,
                rfqPercentage: snapshot.totalOrders > 0 ? snapshot.rfqOrders / snapshot.totalOrders : 0,
                topCategories: snapshot.categoryMetrics || [],
                countryBreakdown: {
                    nigeria: snapshot.nigeriaGmv,
                    bangladesh: snapshot.bangladeshGmv,
                    international: snapshot.internationalGmv,
                },
                demandGaps: [], // Calculated separately
            });
        }

        // Calculate live if no snapshot
        const [rfqs, orders] = await Promise.all([
            db.rfq.count(),
            db.order.count(),
        ]);

        return NextResponse.json({
            totalRfqs: rfqs,
            totalOrders: orders,
            totalGmv: 0,
            platformRevenue: 0,
            rfqToOrderRate: rfqs > 0 ? orders / rfqs : 0,
            avgOrderValue: 0,
            buyNowPercentage: 0.5,
            rfqPercentage: 0.5,
            topCategories: [],
            countryBreakdown: { nigeria: 0, bangladesh: 0, international: 0 },
            demandGaps: [],
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch market analytics' }, { status: 500 });
    }
}
