// app/api/ops/logistics/[orderId]/status/route.ts - Update Shipment Status

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
    const { user, error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { status, note, location } = await request.json();

        if (!status) {
            return NextResponse.json({ error: 'Status required' }, { status: 400 });
        }

        const shipment = await db.shipment.findUnique({
            where: { orderId },
        });

        if (!shipment) {
            return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
        }

        const before = createSnapshot(shipment);

        // Update shipment status and add event
        const updateData: Record<string, unknown> = { status };

        // Set timestamps based on status
        if (status === 'PICKED_UP') updateData.actualPickup = new Date();
        if (status === 'DELIVERED') updateData.actualDelivery = new Date();

        const updated = await db.shipment.update({
            where: { orderId },
            data: updateData,
        });

        // Create event
        await db.shipmentEvent.create({
            data: {
                shipmentId: shipment.id,
                status,
                location,
                note,
                createdByUserId: user!.id,
                createdByRole: 'OPS',
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'SHIPMENT_STATUS_UPDATE',
            targetType: 'SHIPMENT',
            targetId: shipment.id,
            before,
            after: createSnapshot(updated),
            metadata: { status, note, location },
        });

        return NextResponse.json({ success: true, shipment: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
