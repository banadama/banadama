// app/api/ops/logistics/[orderId]/pod/route.ts - Proof of Delivery Upload

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


// POST - Upload POD
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const { user, error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { type, fileUrl, fileName, description, geoLocation } = await request.json();

        if (!type || !fileUrl) {
            return NextResponse.json({ error: 'Type and fileUrl required' }, { status: 400 });
        }

        const shipment = await db.shipment.findUnique({
            where: { orderId },
        });

        if (!shipment) {
            return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
        }

        const pod = await db.proofOfDelivery.create({
            data: {
                shipmentId: shipment.id,
                type,
                fileUrl,
                fileName,
                description,
                geoLocation,
                uploadedByUserId: user!.id,
                uploadedByRole: 'OPS',
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'POD_UPLOAD',
            targetType: 'PROOF_OF_DELIVERY',
            targetId: pod.id,
            after: createSnapshot(pod),
            metadata: { orderId, type },
        });

        return NextResponse.json({ success: true, proofOfDelivery: pod });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to upload POD' }, { status: 500 });
    }
}

// PATCH - Verify POD
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const { user, error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { podId, isValid, rejectionReason } = await request.json();

        if (!podId || isValid === undefined) {
            return NextResponse.json({ error: 'podId and isValid required' }, { status: 400 });
        }

        const pod = await db.proofOfDelivery.findUnique({
            where: { id: podId },
            include: { shipment: true },
        });

        if (!pod || pod.shipment.orderId !== orderId) {
            return NextResponse.json({ error: 'POD not found' }, { status: 404 });
        }

        const before = createSnapshot(pod);

        const updated = await db.proofOfDelivery.update({
            where: { id: podId },
            data: {
                isValid,
                verifiedByOpsId: user!.id,
                verifiedAt: new Date(),
                rejectionReason: !isValid ? rejectionReason : null,
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: isValid ? 'POD_VERIFY' : 'POD_REJECT',
            targetType: 'PROOF_OF_DELIVERY',
            targetId: podId,
            before,
            after: createSnapshot(updated),
        });

        return NextResponse.json({ success: true, proofOfDelivery: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to verify POD' }, { status: 500 });
    }
}
