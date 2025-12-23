// app/api/admin/analytics/suppliers/route.ts - Supplier Intelligence
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const [
            totalSuppliers,
            activeSuppliers,
            topPerformers,
            highRisk,
        ] = await Promise.all([
            db.supplier.count(),
            db.supplier.count({ where: { status: 'ACTIVE' } }),
            db.supplierScore.findMany({
                where: { isTopPerformer: true },
                orderBy: { overallScore: 'desc' },
                take: 10,
            }),
            db.supplierScore.findMany({
                where: { isHighRisk: true },
                orderBy: { overallScore: 'asc' },
                take: 10,
            }),
        ]);

        // Get supplier details for scores
        const enrichedTopPerformers = await Promise.all(
            topPerformers.map(async (s) => {
                const supplier = await db.supplier.findUnique({
                    where: { id: s.supplierId },
                    select: { businessName: true },
                });
                return {
                    id: s.supplierId,
                    businessName: supplier?.businessName || 'Unknown',
                    overallScore: s.overallScore,
                    completedOrders: s.completedOrders,
                    revenue: s.totalRevenue,
                };
            })
        );

        const enrichedHighRisk = await Promise.all(
            highRisk.map(async (s) => {
                const supplier = await db.supplier.findUnique({
                    where: { id: s.supplierId },
                    select: { businessName: true },
                });
                return {
                    id: s.supplierId,
                    businessName: supplier?.businessName || 'Unknown',
                    overallScore: s.overallScore,
                    riskReasons: s.riskReasons || [],
                    disputeRate: s.disputeRate || 0,
                };
            })
        );

        // Calculate averages
        const allScores = await db.supplierScore.aggregate({
            _avg: {
                overallScore: true,
                avgResponseTimeHours: true,
                disputeRate: true,
            },
        });

        return NextResponse.json({
            totalSuppliers,
            activeSuppliers,
            topPerformers: enrichedTopPerformers,
            highRisk: enrichedHighRisk,
            avgMetrics: {
                responseTimeHours: allScores._avg.avgResponseTimeHours || 24,
                fulfillmentRate: 0.85,
                disputeRate: allScores._avg.disputeRate || 0.02,
            },
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch supplier analytics' }, { status: 500 });
    }
}
