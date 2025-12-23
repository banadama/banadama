// app/api/ops/disputes/[id]/status/route.ts - OPS Dispute Status Update (LIMITED)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

// OPS can only change to INVESTIGATING, not resolve
const ALLOWED_OPS_STATUS = ['INVESTIGATING'];

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

        // OPS can only mark as INVESTIGATING
        if (!ALLOWED_OPS_STATUS.includes(status) && user?.role !== 'ADMIN') {
            return NextResponse.json(
                {
                    error: `Ops can only change status to: ${ALLOWED_OPS_STATUS.join(', ')}`,
                    note: 'Resolution status changes require Admin approval.'
                },
                { status: 403 }
            );
        }

        const dispute = await db.dispute.findUnique({
            where: { id },
        });

        if (!dispute) {
            return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
        }

        const updatedDispute = await db.dispute.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({
            success: true,
            dispute: updatedDispute,
        });
    } catch (err) {
        console.error('Error updating dispute status:', err);
        return NextResponse.json({ error: 'Failed to update dispute' }, { status: 500 });
    }
}
