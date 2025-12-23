// app/api/admin/disputes/[id]/route.ts - Single Dispute Resolution API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// GET /api/admin/disputes/[id] - Get dispute details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const dispute = await db.dispute.findUnique({
        where: { id },
    });

    if (!dispute) {
        return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    return NextResponse.json({ dispute });
}

// PATCH /api/admin/disputes/[id] - Resolve dispute
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const {
            action, // 'investigate', 'resolve', 'close'
            resolutionType,
            resolutionNotes,
            refundAmount,
            supplierPenalty,
            buyerCredit,
            internalNotes,
        } = body;

        const currentDispute = await db.dispute.findUnique({
            where: { id },
        });

        if (!currentDispute) {
            return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
        }

        const beforeSnapshot = createSnapshot(currentDispute);

        let updateData: Record<string, unknown> = {};

        switch (action) {
            case 'investigate':
                updateData = {
                    status: 'INVESTIGATING',
                    internalNotes: internalNotes || currentDispute.internalNotes,
                };
                break;

            case 'resolve':
                if (!resolutionType) {
                    return NextResponse.json(
                        { error: 'Resolution type required' },
                        { status: 400 }
                    );
                }

                // Determine final status based on resolution
                let finalStatus = 'CLOSED';
                if (resolutionType === 'FULL_REFUND' || refundAmount) {
                    finalStatus = 'RESOLVED_BUYER_FAVOR';
                } else if (resolutionType === 'NO_ACTION') {
                    finalStatus = 'RESOLVED_SUPPLIER_FAVOR';
                } else if (resolutionType === 'PARTIAL_REFUND') {
                    finalStatus = 'RESOLVED_PARTIAL';
                }

                updateData = {
                    status: finalStatus,
                    resolutionType,
                    resolutionNotes,
                    resolvedAt: new Date(),
                    resolvedByAdminId: admin!.id,
                    refundAmount,
                    supplierPenalty,
                    buyerCredit,
                    internalNotes: internalNotes || currentDispute.internalNotes,
                };
                break;

            case 'close':
                updateData = {
                    status: 'CLOSED',
                    resolvedAt: new Date(),
                    resolvedByAdminId: admin!.id,
                    internalNotes: internalNotes || currentDispute.internalNotes,
                };
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: investigate, resolve, close' },
                    { status: 400 }
                );
        }

        const updatedDispute = await db.dispute.update({
            where: { id },
            data: updateData,
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: 'RESOLVE_DISPUTE',
            targetType: 'DISPUTE',
            targetId: id,
            before: beforeSnapshot,
            after: createSnapshot(updatedDispute),
            metadata: {
                action,
                resolutionType,
                refundAmount,
                supplierPenalty,
                buyerCredit,
            },
        });

        return NextResponse.json({
            success: true,
            dispute: updatedDispute,
            message: `Dispute ${action} successful`,
        });
    } catch (err) {
        console.error('Error updating dispute:', err);
        return NextResponse.json(
            { error: 'Failed to update dispute' },
            { status: 500 }
        );
    }
}
