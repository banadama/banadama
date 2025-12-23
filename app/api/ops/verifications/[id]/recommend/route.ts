// app/api/ops/verifications/[id]/recommend/route.ts - OPS Verification Recommendation (NOT Assignment)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

// OPS can only RECOMMEND verification, NOT assign
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
        const { recommendation, notes } = await request.json();

        const verificationRequest = await db.verificationRequest.findUnique({
            where: { id },
        });

        if (!verificationRequest) {
            return NextResponse.json({ error: 'Verification request not found' }, { status: 404 });
        }

        // OPS cannot approve - only recommend
        // Store in data field
        const existingData = verificationRequest.data as Record<string, unknown> || {};
        const updatedData = {
            ...existingData,
            opsRecommendation: recommendation,
            opsNotes: notes,
            opsReviewedBy: user?.email,
            opsReviewedAt: new Date().toISOString(),
        };

        const updated = await db.verificationRequest.update({
            where: { id },
            data: {
                data: updatedData,
                // Mark as reviewed but not approved
                status: 'PENDING', // Still pending Admin decision
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Recommendation submitted. Admin will make final decision.',
            request: {
                ...updated,
                opsRecommendation: recommendation,
                opsNotes: notes,
            },
        });
    } catch (err) {
        console.error('Error saving recommendation:', err);
        return NextResponse.json({ error: 'Failed to save recommendation' }, { status: 500 });
    }
}
