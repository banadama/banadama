// app/api/ops/international-orders/[id]/documents/route.ts - Documents Management

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
        const order = await db.internationalOrder.findUnique({
            where: { id },
            include: {
                documents: { orderBy: { createdAt: 'desc' } },
                buyerCountry: { select: { requiredDocuments: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({
            documents: order.documents,
            requiredDocuments: order.buyerCountry?.requiredDocuments || ['COMMERCIAL_INVOICE', 'PACKING_LIST'],
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ documents: [], requiredDocuments: [] });
    }
}
