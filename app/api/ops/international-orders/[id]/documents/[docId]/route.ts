// app/api/ops/international-orders/[id]/documents/[docId]/route.ts - Document Review
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; docId: string }> }
) {
    const { id, docId } = await params;
    const { user, error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { status, notes } = await request.json();

        const doc = await db.tradeDocument.findUnique({
            where: { id: docId },
        });

        if (!doc || doc.internationalOrderId !== id) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        const before = createSnapshot(doc);

        const updated = await db.tradeDocument.update({
            where: { id: docId },
            data: {
                status,
                reviewedByOpsId: user!.id,
                reviewedAt: new Date(),
                reviewNotes: status === 'APPROVED' ? notes : undefined,
                rejectionReason: status === 'REJECTED' ? notes : undefined,
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: `TRADE_DOCUMENT_${status}`,
            targetType: 'TRADE_DOCUMENT',
            targetId: docId,
            before,
            after: createSnapshot(updated),
            metadata: { notes, internationalOrderId: id },
        });

        return NextResponse.json({ success: true, document: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }
}
