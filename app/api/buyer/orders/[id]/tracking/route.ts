// app/api/buyer/orders/[id]/tracking/route.ts - Buyer Tracking Info

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(
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
                productName: true,
                deliveryAddress: true,
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
            include: {
                events: { orderBy: { timestamp: 'desc' } },
            },
        });

        if (!shipment) {
            return NextResponse.json({ tracking: null });
        }

        return NextResponse.json({
            tracking: {
                orderId: order.id,
                productName: order.productName,
                status: shipment.status,
                carrier: shipment.carrierName,
                trackingNumber: shipment.trackingNumber,
                trackingUrl: shipment.trackingUrl,
                estimatedDelivery: shipment.estimatedDelivery?.toISOString(),
                actualDelivery: shipment.actualDelivery?.toISOString(),
                deliveryAddress: order.deliveryAddress || shipment.deliveryAddress,
                deliveryConfirmed: shipment.deliveryConfirmed,
                confirmedByBuyer: shipment.confirmedByBuyer,
                events: shipment.events.map((e) => ({
                    id: e.id,
                    status: e.status,
                    location: e.location,
                    note: e.note,
                    timestamp: e.timestamp.toISOString(),
                })),
            },
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch tracking' }, { status: 500 });
    }
}
