// app/api/admin/trade/countries/[id]/route.ts - Country Actions
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

    try {
        const { status, reason, ...otherUpdates } = await request.json();

        const country = await db.tradeCountry.findUnique({
            where: { id },
        });

        if (!country) {
            return NextResponse.json({ error: 'Country not found' }, { status: 404 });
        }

        const before = createSnapshot(country);

        // Build update data
        const updateData: Record<string, unknown> = {};

        if (status) {
            updateData.status = status;

            if (status === 'ENABLED') {
                updateData.enabledAt = new Date();
                updateData.enabledByAdminId = user!.id;
                updateData.disabledAt = null;
                updateData.disableReason = null;
            } else if (status === 'DISABLED') {
                updateData.disabledAt = new Date();
                updateData.disabledByAdminId = user!.id;
                updateData.disableReason = reason;
            }
        }

        // Other allowed updates
        if (otherUpdates.allowBuyNow !== undefined) updateData.allowBuyNow = otherUpdates.allowBuyNow;
        if (otherUpdates.allowRfq !== undefined) updateData.allowRfq = otherUpdates.allowRfq;
        if (otherUpdates.requireDocsReview !== undefined) updateData.requireDocsReview = otherUpdates.requireDocsReview;
        if (otherUpdates.requireBlueTick !== undefined) updateData.requireBlueTick = otherUpdates.requireBlueTick;
        if (otherUpdates.highValueThreshold !== undefined) updateData.highValueThreshold = otherUpdates.highValueThreshold;
        if (otherUpdates.shippingMethods !== undefined) updateData.shippingMethods = otherUpdates.shippingMethods;

        const updated = await db.tradeCountry.update({
            where: { id },
            data: updateData,
        });

        await logAdminAction({
            adminId: user!.id,
            action: status === 'ENABLED' ? 'TRADE_COUNTRY_ENABLE' :
                status === 'DISABLED' ? 'TRADE_COUNTRY_DISABLE' : 'TRADE_COUNTRY_UPDATE',
            targetType: 'COUNTRY',
            targetId: id,
            before,
            after: createSnapshot(updated),
            metadata: { reason },
        });

        return NextResponse.json({ success: true, country: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update country' }, { status: 500 });
    }
}
