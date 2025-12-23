// app/api/admin/finance/escrow/[id]/route.ts - Escrow Actions (FINANCE_ADMIN only)
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

    // Check if user has FINANCE_ADMIN role
    const adminRole = await db.adminRole.findUnique({
        where: { userId: user!.id },
    });

    if (!adminRole || !['SUPER_ADMIN', 'FINANCE_ADMIN'].includes(adminRole.roleType)) {
        return NextResponse.json(
            { error: 'Only FINANCE_ADMIN can perform escrow actions' },
            { status: 403 }
        );
    }

    try {
        const { action, amount, reason } = await request.json();

        if (!reason) {
            return NextResponse.json({ error: 'Reason is required for all escrow actions' }, { status: 400 });
        }

        const escrow = await db.escrow.findUnique({
            where: { id },
        });

        if (!escrow) {
            return NextResponse.json({ error: 'Escrow not found' }, { status: 404 });
        }

        const before = createSnapshot(escrow);
        let updatedEscrow;

        switch (action) {
            case 'release':
                // Full release
                updatedEscrow = await db.escrow.update({
                    where: { id },
                    data: {
                        status: 'RELEASED',
                        releasedAmount: escrow.totalAmount,
                        releasedAt: new Date(),
                        releaseApprovedByAdminId: user!.id,
                        releaseApprovedAt: new Date(),
                        releaseNotes: reason,
                    },
                });
                break;

            case 'partial_release':
                if (!amount || amount <= 0 || amount >= escrow.totalAmount) {
                    return NextResponse.json({ error: 'Invalid partial release amount' }, { status: 400 });
                }
                updatedEscrow = await db.escrow.update({
                    where: { id },
                    data: {
                        status: 'PARTIAL_RELEASE',
                        releasedAmount: amount,
                        releasedAt: new Date(),
                        releaseApprovedByAdminId: user!.id,
                        releaseApprovedAt: new Date(),
                        releaseNotes: reason,
                    },
                });
                break;

            case 'refund':
                // Full refund to buyer
                updatedEscrow = await db.escrow.update({
                    where: { id },
                    data: {
                        status: 'REFUNDED',
                        refundedAmount: escrow.totalAmount,
                        refundedAt: new Date(),
                        releaseApprovedByAdminId: user!.id,
                        releaseApprovedAt: new Date(),
                        releaseNotes: reason,
                    },
                });
                break;

            case 'hold':
                updatedEscrow = await db.escrow.update({
                    where: { id },
                    data: {
                        status: 'DISPUTED',
                        holdReason: reason,
                        holdByAdminId: user!.id,
                        holdAt: new Date(),
                    },
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Log audit
        await logAdminAction({
            adminId: user!.id,
            action: `ESCROW_${action.toUpperCase()}`,
            targetType: 'ESCROW',
            targetId: id,
            before,
            after: createSnapshot(updatedEscrow),
            metadata: { reason, amount },
        });

        return NextResponse.json({ success: true, escrow: updatedEscrow });
    } catch (err) {
        console.error('Error updating escrow:', err);
        return NextResponse.json({ error: 'Failed to update escrow' }, { status: 500 });
    }
}
