// app/api/admin/finance/payouts/[id]/route.ts - Payout Actions (FINANCE_ADMIN only)
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
            { error: 'Only FINANCE_ADMIN can approve/reject payouts' },
            { status: 403 }
        );
    }

    try {
        const { action, notes } = await request.json();

        const payout = await db.financePayout.findUnique({
            where: { id },
        });

        if (!payout) {
            return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
        }

        const before = createSnapshot(payout);
        let updatedPayout;

        switch (action) {
            case 'approve':
                updatedPayout = await db.financePayout.update({
                    where: { id },
                    data: {
                        status: 'APPROVED',
                        approvedByAdminId: user!.id,
                        approvedAt: new Date(),
                        approvalNotes: notes,
                    },
                });
                break;

            case 'reject':
                updatedPayout = await db.financePayout.update({
                    where: { id },
                    data: {
                        status: 'REJECTED',
                        rejectedByAdminId: user!.id,
                        rejectedAt: new Date(),
                        rejectionReason: notes,
                    },
                });
                break;

            case 'hold':
                updatedPayout = await db.financePayout.update({
                    where: { id },
                    data: {
                        status: 'ON_HOLD',
                        approvalNotes: `HELD: ${notes}`,
                    },
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Log audit
        await logAdminAction({
            adminId: user!.id,
            action: `PAYOUT_${action.toUpperCase()}`,
            targetType: 'PAYOUT',
            targetId: id,
            before,
            after: createSnapshot(updatedPayout),
            metadata: { notes },
        });

        return NextResponse.json({ success: true, payout: updatedPayout });
    } catch (err) {
        console.error('Error updating payout:', err);
        return NextResponse.json({ error: 'Failed to update payout' }, { status: 500 });
    }
}
