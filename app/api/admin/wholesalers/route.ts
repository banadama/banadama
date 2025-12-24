// app/api/admin/wholesalers/route.ts - Admin List Wholesalers

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
    const status = searchParams.get('status');

    try {
        const where: Record<string, unknown> = {};
        if (status) {
            where.verificationStatus = status;
        }

        const wholesalers = await db.wholesalerProfile.findMany({
            where,
            include: {
                supplier: {
                    select: { businessName: true },
                },
                stockItems: {
                    select: { id: true, status: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            wholesalers: wholesalers.map((w) => ({
                id: w.id,
                businessName: w.businessName,
                businessType: w.businessType,
                country: w.country,
                city: w.city,
                marketName: w.marketName,
                verificationStatus: w.verificationStatus,
                hasBlueTick: w.hasBlueTick,
                hasGreenTick: w.hasGreenTick,
                enabledForInternational: w.enabledForInternational,
                fulfillmentRate: w.fulfillmentRate,
                productsCount: w.stockItems.length,
                createdAt: w.createdAt.toISOString(),
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ wholesalers: [] });
    }
}
