// app/api/factory/production/[orderId]/route.ts - Get Production Detail

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const { user, error } = await requireApiRole(['SUPPLIER', 'FACTORY']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        // Get factory profile
        const supplier = await db.supplier.findFirst({
            where: { userId: user!.id },
        });

        if (!supplier) {
            return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
        }

        const factory = await db.factoryProfile.findUnique({
            where: { supplierId: supplier.id },
        });

        if (!factory) {
            return NextResponse.json({ error: 'Factory not found' }, { status: 404 });
        }

        // Get production with order
        const production = await db.factoryProduction.findFirst({
            where: { orderId, factoryId: factory.id },
            include: {
                order: {
                    select: {
                        productName: true,
                        quantity: true,
                        totalAmount: true,
                    },
                },
            },
        });

        if (!production) {
            return NextResponse.json({ error: 'Production not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: production.id,
            orderId: production.orderId,
            productName: production.order?.productName || 'Unknown',
            quantity: production.orderedQuantity,
            status: production.status,
            expectedStartDate: production.expectedStartDate?.toISOString(),
            actualStartDate: production.actualStartDate?.toISOString(),
            expectedEndDate: production.expectedEndDate?.toISOString(),
            actualEndDate: production.actualEndDate?.toISOString(),
            producedQuantity: production.producedQuantity,
            defectQuantity: production.defectQuantity,
            progressPhotos: production.progressPhotos || [],
            updates: production.updates || [],
            qcPassed: production.qcPassed,
            qcNotes: production.qcNotes,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch production' }, { status: 500 });
    }
}
