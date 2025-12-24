// app/api/ops/disputes/[id]/route.ts - OPS Single Dispute View

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const dispute = await db.dispute.findUnique({
            where: { id },
        });

        if (!dispute) {
            return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
        }

        return NextResponse.json({ dispute });
    } catch (err) {
        console.error('Error fetching dispute:', err);
        return NextResponse.json({ error: 'Failed to fetch dispute' }, { status: 500 });
    }
}
