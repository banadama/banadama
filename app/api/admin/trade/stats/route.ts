// app/api/admin/trade/stats/route.ts - Trade Stats
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        let internationalEnabled = false;
        let enabledCountries = 0;
        let pendingOrders = 0;
        let inTransitOrders = 0;
        let totalInternationalRevenue = 0;

        try {
            const settings = await db.tradeSettings.findFirst();
            internationalEnabled = settings?.internationalEnabled || false;

            enabledCountries = await db.tradeCountry.count({
                where: { status: 'ENABLED' },
            });

            pendingOrders = await db.internationalOrder.count({
                where: { status: { in: ['PENDING_REVIEW', 'DOCS_REQUIRED', 'DOCS_SUBMITTED'] } },
            });

            inTransitOrders = await db.internationalOrder.count({
                where: { status: { in: ['IN_TRANSIT', 'CUSTOMS_CLEARANCE'] } },
            });

            const revenue = await db.internationalOrder.aggregate({
                _sum: { convertedAmount: true },
                where: { status: 'COMPLETED' },
            });
            totalInternationalRevenue = revenue._sum.convertedAmount || 0;
        } catch {
            // Models might not exist yet
        }

        return NextResponse.json({
            internationalEnabled,
            enabledCountries,
            pendingOrders,
            inTransitOrders,
            totalInternationalRevenue,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
