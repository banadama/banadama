// app/api/ops/international-orders/[id]/shipping/route.ts - Shipping Management

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const order = await db.internationalOrder.findUnique({
            where: { id },
            include: {
                shipment: true,
                order: { select: { deliveryAddress: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({
            shipment: order.shipment,
            deliveryAddress: order.order?.deliveryAddress,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ shipment: null });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user, error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const data = await request.json();

        const order = await db.internationalOrder.findUnique({
            where: { id },
            include: { shipment: true },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const before = order.shipment ? createSnapshot(order.shipment) : null;

        // Upsert shipment
        const shipment = await db.tradeShipment.upsert({
            where: { internationalOrderId: id },
            create: {
                internationalOrderId: id,
                method: data.method || 'AIR',
                carrier: data.carrier,
                trackingNumber: data.trackingNumber,
                estimatedDeparture: data.estimatedDeparture ? new Date(data.estimatedDeparture) : undefined,
                estimatedArrival: data.estimatedArrival ? new Date(data.estimatedArrival) : undefined,
                originPort: data.originPort,
                destinationPort: data.destinationPort,
                deliveryAddress: data.deliveryAddress,
                shippingCost: data.shippingCost,
                specialInstructions: data.specialInstructions,
                currentLocation: data.currentLocation,
                arrangedByOpsId: user!.id,
                arrangedAt: new Date(),
            },
            update: {
                method: data.method,
                carrier: data.carrier,
                trackingNumber: data.trackingNumber,
                estimatedDeparture: data.estimatedDeparture ? new Date(data.estimatedDeparture) : undefined,
                estimatedArrival: data.estimatedArrival ? new Date(data.estimatedArrival) : undefined,
                originPort: data.originPort,
                destinationPort: data.destinationPort,
                deliveryAddress: data.deliveryAddress,
                shippingCost: data.shippingCost,
                specialInstructions: data.specialInstructions,
                currentLocation: data.currentLocation,
                lastUpdateAt: new Date(),
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: before ? 'TRADE_SHIPMENT_UPDATE' : 'TRADE_SHIPMENT_CREATE',
            targetType: 'TRADE_SHIPMENT',
            targetId: shipment.id,
            before,
            after: createSnapshot(shipment),
            metadata: { internationalOrderId: id },
        });

        return NextResponse.json({ success: true, shipment });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to save shipping' }, { status: 500 });
    }
}
