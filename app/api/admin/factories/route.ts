// app/api/admin/factories/route.ts - Admin List Factories

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

        const factories = await db.factoryProfile.findMany({
            where,
            include: {
                supplier: {
                    select: { businessName: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            factories: factories.map((f) => ({
                id: f.id,
                factoryName: f.factoryName,
                factoryType: f.factoryType,
                country: f.country,
                city: f.city,
                verificationStatus: f.verificationStatus,
                hasGreenTick: f.hasGreenTick,
                enabledForInternational: f.enabledForInternational,
                monthlyCapacityUnits: f.monthlyCapacityUnits,
                createdAt: f.createdAt.toISOString(),
                supplierName: f.supplier?.businessName,
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ factories: [] });
    }
}
