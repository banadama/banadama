// app/api/admin/wholesalers/[id]/route.ts - Admin Wholesaler Actions

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const wholesaler = await db.wholesalerProfile.findUnique({
            where: { id },
            include: {
                stockItems: {
                    select: { id: true, status: true },
                },
            },
        });

        if (!wholesaler) {
            return NextResponse.json({ error: 'Wholesaler not found' }, { status: 404 });
        }

        const inStockCount = wholesaler.stockItems.filter(s => s.status === 'IN_STOCK').length;
        const lowStockCount = wholesaler.stockItems.filter(s => s.status === 'LOW_STOCK').length;

        return NextResponse.json({
            ...wholesaler,
            productsCount: wholesaler.stockItems.length,
            inStockCount,
            lowStockCount,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch wholesaler' }, { status: 500 });
    }
}

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
        const wholesaler = await db.wholesalerProfile.findUnique({
            where: { id },
        });

        if (!wholesaler) {
            return NextResponse.json({ error: 'Wholesaler not found' }, { status: 404 });
        }

        const { action, ...updates } = await request.json();
        const before = createSnapshot(wholesaler);

        let updateData: Record<string, unknown> = {};

        switch (action) {
            case 'grant_blue_tick':
                updateData = {
                    hasBlueTick: true,
                    verificationStatus: 'VERIFIED',
                    verifiedAt: new Date(),
                    verifiedByAdminId: user!.id,
                };
                break;

            case 'grant_green_tick':
                updateData = {
                    hasBlueTick: true,
                    hasGreenTick: true,
                    verificationStatus: 'VERIFIED',
                    verifiedAt: new Date(),
                    verifiedByAdminId: user!.id,
                };
                break;

            case 'revoke_ticks':
                updateData = {
                    hasBlueTick: false,
                    hasGreenTick: false,
                    verificationStatus: 'PENDING',
                };
                break;

            case 'suspend':
                updateData = {
                    verificationStatus: 'SUSPENDED',
                    enabledForInternational: false,
                };
                break;

            case 'activate':
                updateData = {
                    verificationStatus: wholesaler.hasGreenTick || wholesaler.hasBlueTick ? 'VERIFIED' : 'PENDING',
                };
                break;

            case 'update':
                // Direct field updates
                if (updates.enabledForInternational !== undefined) {
                    updateData.enabledForInternational = updates.enabledForInternational;
                }
                if (updates.rfqEnabled !== undefined) {
                    updateData.rfqEnabled = updates.rfqEnabled;
                }
                if (updates.maxOrderValue !== undefined) {
                    updateData.maxOrderValue = updates.maxOrderValue;
                }
                if (updates.adminNotes !== undefined) {
                    updateData.adminNotes = updates.adminNotes;
                }
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        const updated = await db.wholesalerProfile.update({
            where: { id },
            data: updateData,
        });

        await logAdminAction({
            adminId: user!.id,
            action: `WHOLESALER_${action.toUpperCase()}`,
            targetType: 'WHOLESALER',
            targetId: id,
            before,
            after: createSnapshot(updated),
        });

        return NextResponse.json({ success: true, wholesaler: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update wholesaler' }, { status: 500 });
    }
}
