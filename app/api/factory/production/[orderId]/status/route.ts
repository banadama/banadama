// app/api/factory/production/[orderId]/status/route.ts - Update Production Status

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function PATCH(
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

        // Get production record
        const production = await db.factoryProduction.findFirst({
            where: { orderId, factoryId: factory.id },
        });

        if (!production) {
            return NextResponse.json({ error: 'Production record not found' }, { status: 404 });
        }

        const { status, note, producedQuantity } = await request.json();

        // Validate status flow
        const STATUS_FLOW = ['NOT_STARTED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY_TO_SHIP', 'SHIPPED'];
        const currentIdx = STATUS_FLOW.indexOf(production.status);
        const newIdx = STATUS_FLOW.indexOf(status);

        if (newIdx !== currentIdx + 1 && newIdx !== currentIdx) {
            return NextResponse.json({
                error: 'Invalid status transition. Must follow the production flow.'
            }, { status: 400 });
        }

        const before = createSnapshot(production);

        // Build updates array
        const updates = Array.isArray(production.updates) ? production.updates : [];
        updates.unshift({
            status,
            note: note || '',
            timestamp: new Date().toISOString(),
            updatedBy: user!.id,
        });

        // Update data
        const updateData: Record<string, unknown> = {
            status,
            updates,
        };

        if (producedQuantity !== undefined) {
            updateData.producedQuantity = producedQuantity;
        }

        // Set timestamps based on status
        if (status === 'IN_PRODUCTION' && !production.actualStartDate) {
            updateData.actualStartDate = new Date();
        }
        if (status === 'READY_TO_SHIP') {
            updateData.readyForPickupAt = new Date();
        }
        if (status === 'SHIPPED') {
            updateData.shippedAt = new Date();
            updateData.actualEndDate = new Date();
        }
        if (status === 'QUALITY_CHECK') {
            updateData.qcDate = new Date();
        }

        const updated = await db.factoryProduction.update({
            where: { id: production.id },
            data: updateData,
        });

        // Update order status to match
        const orderStatusMap: Record<string, string> = {
            IN_PRODUCTION: 'IN_PRODUCTION',
            QUALITY_CHECK: 'IN_PRODUCTION',
            READY_TO_SHIP: 'READY',
            SHIPPED: 'SHIPPED',
        };

        if (orderStatusMap[status]) {
            await db.order.update({
                where: { id: orderId },
                data: { status: orderStatusMap[status] },
            });
        }

        await logAdminAction({
            adminId: user!.id,
            action: 'FACTORY_PRODUCTION_UPDATE',
            targetType: 'FACTORY_PRODUCTION',
            targetId: production.id,
            before,
            after: createSnapshot(updated),
            metadata: { newStatus: status, note },
        });

        return NextResponse.json({ success: true, production: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
