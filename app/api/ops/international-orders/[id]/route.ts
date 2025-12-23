// app/api/ops/international-orders/[id]/route.ts - Single International Order
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

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
                order: {
                    select: {
                        productName: true,
                        quantity: true,
                        deliveryAddress: true,
                        buyer: {
                            select: {
                                user: { select: { email: true, name: true } },
                            }
                        },
                        supplier: { select: { businessName: true } },
                    },
                },
                documents: true,
                shipment: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({
            order: {
                ...order,
                order: {
                    productName: order.order?.productName,
                    quantity: order.order?.quantity,
                    deliveryAddress: order.order?.deliveryAddress,
                    buyer: {
                        email: order.order?.buyer?.user?.email,
                        name: order.order?.buyer?.user?.name,
                    },
                    supplier: { businessName: order.order?.supplier?.businessName },
                },
            },
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}
