// app/api/ops/international-orders/[id]/status/route.ts - Update Status

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


// Status transitions OPS is allowed to make
const ALLOWED_OPS_TRANSITIONS: Record<string, string[]> = {
    PENDING_REVIEW: ['DOCS_REQUIRED', 'DOCS_APPROVED'],
    DOCS_REQUIRED: ['DOCS_SUBMITTED'],  // Set by system when docs uploaded
    DOCS_SUBMITTED: ['DOCS_APPROVED', 'DOCS_REQUIRED'],  // Approve or request more
    DOCS_APPROVED: ['SHIPPING_ARRANGED'],
    SHIPPING_ARRANGED: ['IN_TRANSIT'],
    IN_TRANSIT: ['CUSTOMS_CLEARANCE', 'DELIVERED'],
    CUSTOMS_CLEARANCE: ['DELIVERED'],
    DELIVERED: [],  // COMPLETED is set by Finance only
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
        const { status: newStatus, notes } = await request.json();

        const order = await db.internationalOrder.findUnique({
            where: { id },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if transition is allowed for OPS
        const allowedNextStatuses = ALLOWED_OPS_TRANSITIONS[order.status] || [];
        if (!allowedNextStatuses.includes(newStatus)) {
            return NextResponse.json({
                error: `Cannot transition from ${order.status} to ${newStatus}. OPS not authorized.`
            }, { status: 403 });
        }

        // Special check: COMPLETED can only be set by Finance
        if (newStatus === 'COMPLETED') {
            return NextResponse.json({
                error: 'COMPLETED status can only be set by FINANCE_ADMIN after payout release.'
            }, { status: 403 });
        }

        const before = createSnapshot(order);

        // Build update data with timestamp
        const updateData: Record<string, unknown> = {
            status: newStatus,
            opsNotes: notes ? `${order.opsNotes || ''}\n[${new Date().toISOString()}] ${notes}` : order.opsNotes,
        };

        // Set relevant timestamps
        if (newStatus === 'DOCS_APPROVED') updateData.docsApprovedAt = new Date();
        if (newStatus === 'SHIPPING_ARRANGED') updateData.shippingArrangedAt = new Date();
        if (newStatus === 'IN_TRANSIT') updateData.shippedAt = new Date();
        if (newStatus === 'CUSTOMS_CLEARANCE') updateData.customsClearanceAt = new Date();
        if (newStatus === 'DELIVERED') updateData.deliveredAt = new Date();

        const updated = await db.internationalOrder.update({
            where: { id },
            data: updateData,
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'INTERNATIONAL_ORDER_STATUS_UPDATE',
            targetType: 'INTERNATIONAL_ORDER',
            targetId: id,
            before,
            after: createSnapshot(updated),
            metadata: { newStatus, notes },
        });

        return NextResponse.json({ success: true, order: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
