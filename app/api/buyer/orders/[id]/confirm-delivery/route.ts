// app/api/buyer/orders/[id]/confirm-delivery/route.ts - Buyer Confirm Delivery

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user, error } = await requireApiRole('BUYER');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        // Verify buyer owns this order
        const order = await db.order.findUnique({
            where: { id },
            select: {
                id: true,
                buyer: { select: { userId: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.buyer?.userId !== user!.id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        // Get shipment
        const shipment = await db.shipment.findUnique({
            where: { orderId: id },
        });

        if (!shipment) {
            return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
        }

        if (shipment.status !== 'DELIVERED') {
            return NextResponse.json({
                error: 'Cannot confirm - package not marked as delivered yet'
            }, { status: 400 });
        }

        if (shipment.confirmedByBuyer) {
            return NextResponse.json({
                error: 'Already confirmed'
            }, { status: 400 });
        }

        const before = createSnapshot(shipment);

        // Update confirmation
        const updated = await db.shipment.update({
            where: { orderId: id },
            data: {
                confirmedByBuyer: true,
                deliveryConfirmed: true,
                confirmedAt: shipment.confirmedAt || new Date(),
            },
        });

        // Add event
        await db.shipmentEvent.create({
            data: {
                shipmentId: shipment.id,
                status: 'DELIVERED',
                note: 'Delivery confirmed by buyer',
                createdByUserId: user!.id,
                createdByRole: 'BUYER',
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'BUYER_DELIVERY_CONFIRM',
            targetType: 'SHIPMENT',
            targetId: shipment.id,
            before,
            after: createSnapshot(updated),
        });

        // ⚠️ IMPORTANT: This does NOT release payment
        // Finance must still approve payout separately

        return NextResponse.json({
            success: true,
            message: 'Thank you for confirming delivery!',
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
    }
}
