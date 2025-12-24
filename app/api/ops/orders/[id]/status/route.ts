// app/api/ops/orders/[id]/status/route.ts - OPS Order Status Update (LIMITED)

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


// OPS can only update to certain statuses (execution, not payment)
const ALLOWED_OPS_STATUS_UPDATES: Record<string, string[]> = {
    CONFIRMED: ['PROCESSING'],
    PROCESSING: ['SHIPPED'],
    SHIPPED: ['DELIVERED'],
};

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user, error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { status } = await request.json();

        const order = await db.order.findUnique({
            where: { id },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if OPS is allowed to make this status change
        const allowedNextStatuses = ALLOWED_OPS_STATUS_UPDATES[order.status] || [];

        if (!allowedNextStatuses.includes(status) && user?.role !== 'ADMIN') {
            return NextResponse.json(
                {
                    error: `Ops cannot change status from ${order.status} to ${status}. Allowed: ${allowedNextStatuses.join(', ') || 'none'}`,
                    note: 'Payment-related status changes require Admin approval.'
                },
                { status: 403 }
            );
        }

        const updatedOrder = await db.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({
            success: true,
            order: updatedOrder,
        });
    } catch (err) {
        console.error('Error updating order status:', err);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
