// app/api/ops/logistics/[orderId]/confirm/route.ts - OPS Confirm Delivery
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const { user, error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const shipment = await db.shipment.findUnique({
            where: { orderId },
            include: { proofOfDelivery: true },
        });

        if (!shipment) {
            return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
        }

        // Validate requirements
        if (shipment.status !== 'DELIVERED') {
            return NextResponse.json({
                error: 'Cannot confirm - shipment status must be DELIVERED first'
            }, { status: 400 });
        }

        // Check for POD - REQUIRED
        const settings = await db.logisticsSettings.findFirst();
        if (settings?.requireProofOfDelivery && shipment.proofOfDelivery.length === 0) {
            return NextResponse.json({
                error: 'Cannot confirm - Proof of Delivery required'
            }, { status: 400 });
        }

        const before = createSnapshot(shipment);

        // Update confirmation
        const updated = await db.shipment.update({
            where: { orderId },
            data: {
                confirmedByOps: true,
                deliveryConfirmed: true,
                confirmedAt: new Date(),
            },
        });

        // Add event
        await db.shipmentEvent.create({
            data: {
                shipmentId: shipment.id,
                status: 'DELIVERED',
                note: 'Delivery confirmed by OPS',
                createdByUserId: user!.id,
                createdByRole: 'OPS',
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'SHIPMENT_DELIVERY_CONFIRM',
            targetType: 'SHIPMENT',
            targetId: shipment.id,
            before,
            after: createSnapshot(updated),
        });

        // ⚠️ IMPORTANT: This does NOT release payment
        // Finance must still approve payout separately

        return NextResponse.json({
            success: true,
            shipment: updated,
            message: 'Delivery confirmed. Finance must approve payout separately.',
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to confirm delivery' }, { status: 500 });
    }
}
