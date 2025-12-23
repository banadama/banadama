// app/api/admin/finance/refunds/[id]/route.ts - Refund Actions (FINANCE_ADMIN only)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    // Check FINANCE_ADMIN role
    const adminRole = await db.adminRole.findUnique({
        where: { userId: user!.id },
    });

    if (!adminRole || !['SUPER_ADMIN', 'FINANCE_ADMIN'].includes(adminRole.roleType)) {
        return NextResponse.json(
            { error: 'Only FINANCE_ADMIN can approve/reject refunds' },
            { status: 403 }
        );
    }

    try {
        const { action, approvedAmount, notes } = await request.json();

        const refund = await db.financeRefund.findUnique({
            where: { id },
        });

        if (!refund) {
            return NextResponse.json({ error: 'Refund not found' }, { status: 404 });
        }

        const before = createSnapshot(refund);
        let updatedRefund;

        switch (action) {
            case 'approve':
                updatedRefund = await db.financeRefund.update({
                    where: { id },
                    data: {
                        status: 'APPROVED',
                        approvedAmount: approvedAmount || refund.requestedAmount,
                        approvedByAdminId: user!.id,
                        approvedAt: new Date(),
                        approvalNotes: notes,
                    },
                });
                break;

            case 'reject':
                updatedRefund = await db.financeRefund.update({
                    where: { id },
                    data: {
                        status: 'REJECTED',
                        rejectedByAdminId: user!.id,
                        rejectedAt: new Date(),
                        rejectionReason: notes,
                    },
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Log audit
        await logAdminAction({
            adminId: user!.id,
            action: `REFUND_${action.toUpperCase()}`,
            targetType: 'REFUND',
            targetId: id,
            before,
            after: createSnapshot(updatedRefund),
            metadata: { notes, approvedAmount },
        });

        return NextResponse.json({ success: true, refund: updatedRefund });
    } catch (err) {
        console.error('Error updating refund:', err);
        return NextResponse.json({ error: 'Failed to update refund' }, { status: 500 });
    }
}
