// app/api/affiliate/sales/route.ts - Affiliate Sales List
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('AFFILIATE');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    try {
        const affiliate = await db.affiliateProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!affiliate) {
            return NextResponse.json({ sales: [], pagination: { page, limit, total: 0, totalPages: 0 } });
        }

        const where: Record<string, unknown> = { affiliateId: affiliate.id };
        if (status) {
            where.status = status;
        }

        const [sales, total] = await Promise.all([
            db.affiliateSale.findMany({
                where,
                include: {
                    link: { select: { name: true, trackingCode: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.affiliateSale.count({ where }),
        ]);

        return NextResponse.json({
            sales,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching sales:', err);
        return NextResponse.json({ sales: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    }
}
