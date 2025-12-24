// app/api/admin/affiliates/[id]/route.ts - Admin Affiliate Actions

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
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
        const { action, reason, customCommissionRate } = await request.json();

        const affiliate = await db.affiliateProfile.findUnique({
            where: { id },
        });

        if (!affiliate) {
            return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        }

        const before = createSnapshot(affiliate);
        let updatedAffiliate;

        switch (action) {
            case 'approve':
                updatedAffiliate = await db.affiliateProfile.update({
                    where: { id },
                    data: {
                        status: 'ACTIVE',
                        approvedAt: new Date(),
                        approvedByAdminId: user!.id,
                    },
                });
                break;

            case 'suspend':
                if (!reason) {
                    return NextResponse.json({ error: 'Reason required for suspension' }, { status: 400 });
                }
                updatedAffiliate = await db.affiliateProfile.update({
                    where: { id },
                    data: {
                        status: 'SUSPENDED',
                        suspendedAt: new Date(),
                        suspendReason: reason,
                        suspendedByAdminId: user!.id,
                    },
                });
                break;

            case 'activate':
                updatedAffiliate = await db.affiliateProfile.update({
                    where: { id },
                    data: {
                        status: 'ACTIVE',
                        suspendedAt: null,
                        suspendReason: null,
                        suspendedByAdminId: null,
                    },
                });
                break;

            case 'ban':
                if (!reason) {
                    return NextResponse.json({ error: 'Reason required for ban' }, { status: 400 });
                }
                updatedAffiliate = await db.affiliateProfile.update({
                    where: { id },
                    data: {
                        status: 'BANNED',
                        suspendedAt: new Date(),
                        suspendReason: reason,
                        suspendedByAdminId: user!.id,
                    },
                });
                break;

            case 'set_commission':
                if (typeof customCommissionRate !== 'number') {
                    return NextResponse.json({ error: 'Valid commission rate required' }, { status: 400 });
                }
                updatedAffiliate = await db.affiliateProfile.update({
                    where: { id },
                    data: {
                        customCommissionRate: customCommissionRate,
                    },
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Log audit
        await logAdminAction({
            adminId: user!.id,
            action: `AFFILIATE_${action.toUpperCase()}`,
            targetType: 'AFFILIATE',
            targetId: id,
            targetUserId: affiliate.userId,
            before,
            after: createSnapshot(updatedAffiliate),
            metadata: { reason, customCommissionRate },
        });

        return NextResponse.json({ success: true, affiliate: updatedAffiliate });
    } catch (err) {
        console.error('Error updating affiliate:', err);
        return NextResponse.json({ error: 'Failed to update affiliate' }, { status: 500 });
    }
}
