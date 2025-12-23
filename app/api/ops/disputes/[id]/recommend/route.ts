// app/api/ops/disputes/[id]/recommend/route.ts - OPS Dispute Recommendation (NOT Resolution)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

// OPS can only RECOMMEND, not RESOLVE
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
        const { recommendation, opsNotes } = await request.json();

        const dispute = await db.dispute.findUnique({
            where: { id },
        });

        if (!dispute) {
            return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
        }

        // OPS cannot resolve - only recommend
        // Store recommendation in internalNotes as JSON (since we don't have a dedicated field)
        const existingNotes = dispute.internalNotes ? JSON.parse(dispute.internalNotes) : {};
        const updatedNotes = {
            ...existingNotes,
            opsRecommendation: recommendation,
            opsNotes: opsNotes,
            opsRecommendedBy: user?.email,
            opsRecommendedAt: new Date().toISOString(),
        };

        const updatedDispute = await db.dispute.update({
            where: { id },
            data: {
                internalNotes: JSON.stringify(updatedNotes),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Recommendation saved. Admin will review for final decision.',
            dispute: {
                ...updatedDispute,
                opsRecommendation: recommendation,
                opsNotes: opsNotes,
            },
        });
    } catch (err) {
        console.error('Error saving recommendation:', err);
        return NextResponse.json({ error: 'Failed to save recommendation' }, { status: 500 });
    }
}
