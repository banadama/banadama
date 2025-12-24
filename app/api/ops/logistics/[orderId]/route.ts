// app/api/ops/logistics/[orderId]/route.ts - Single Shipment

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


// GET - Get shipment details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const { error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const shipment = await db.shipment.findUnique({
            where: { orderId },
            include: {
                events: { orderBy: { timestamp: 'desc' } },
                proofOfDelivery: true,
                order: {
                    select: {
                        productName: true,
                        quantity: true,
                        buyer: { select: { user: { select: { name: true, email: true } } } },
                        supplier: { select: { businessName: true } },
                    },
                },
            },
        });

        if (!shipment) {
            return NextResponse.json({ shipment: null });
        }

        return NextResponse.json({
            shipment: {
                ...shipment,
                order: {
                    productName: shipment.order?.productName,
                    quantity: shipment.order?.quantity,
                    buyer: {
                        name: shipment.order?.buyer?.user?.name,
                        email: shipment.order?.buyer?.user?.email,
                    },
                    supplier: { businessName: shipment.order?.supplier?.businessName },
                },
            },
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch shipment' }, { status: 500 });
    }
}

// POST - Create shipment
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
        // Check if order exists
        const order = await db.order.findUnique({
            where: { id: orderId },
            select: { deliveryAddress: true },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if shipment already exists
        const existing = await db.shipment.findUnique({
            where: { orderId },
        });

        if (existing) {
            return NextResponse.json({ error: 'Shipment already exists' }, { status: 409 });
        }

        // Create shipment
        const shipment = await db.shipment.create({
            data: {
                orderId,
                deliveryAddress: order.deliveryAddress || '',
                createdByOpsId: user!.id,
                events: {
                    create: {
                        status: 'PENDING',
                        note: 'Shipment created',
                        createdByUserId: user!.id,
                        createdByRole: 'OPS',
                    },
                },
            },
            include: { events: true },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'SHIPMENT_CREATE',
            targetType: 'SHIPMENT',
            targetId: shipment.id,
            after: createSnapshot(shipment),
            metadata: { orderId },
        });

        return NextResponse.json({ shipment });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
    }
}

// PATCH - Update shipment details
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
        const data = await request.json();

        const shipment = await db.shipment.findUnique({
            where: { orderId },
        });

        if (!shipment) {
            return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
        }

        const before = createSnapshot(shipment);

        const updated = await db.shipment.update({
            where: { orderId },
            data: {
                carrierName: data.carrierName,
                trackingNumber: data.trackingNumber,
                trackingUrl: data.trackingUrl,
                estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined,
                specialInstructions: data.specialInstructions,
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'SHIPMENT_UPDATE',
            targetType: 'SHIPMENT',
            targetId: shipment.id,
            before,
            after: createSnapshot(updated),
        });

        return NextResponse.json({ success: true, shipment: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
    }
}
