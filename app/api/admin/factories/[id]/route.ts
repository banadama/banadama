// app/api/admin/factories/[id]/route.ts - Admin Factory Actions

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
        const factory = await db.factoryProfile.findUnique({
            where: { id },
            include: {
                capabilities: true,
                complianceDocs: true,
            },
        });

        if (!factory) {
            return NextResponse.json({ error: 'Factory not found' }, { status: 404 });
        }

        return NextResponse.json(factory);
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch factory' }, { status: 500 });
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
        const factory = await db.factoryProfile.findUnique({
            where: { id },
        });

        if (!factory) {
            return NextResponse.json({ error: 'Factory not found' }, { status: 404 });
        }

        const { action, ...updates } = await request.json();
        const before = createSnapshot(factory);

        let updateData: Record<string, unknown> = {};

        switch (action) {
            case 'grant_green_tick':
                updateData = {
                    hasGreenTick: true,
                    verificationStatus: 'VERIFIED',
                    verifiedAt: new Date(),
                    verifiedByAdminId: user!.id,
                };
                break;

            case 'revoke_green_tick':
                updateData = {
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
                    verificationStatus: factory.hasGreenTick ? 'VERIFIED' : 'PENDING',
                };
                break;

            case 'update':
                // Direct field updates
                if (updates.enabledForInternational !== undefined) {
                    updateData.enabledForInternational = updates.enabledForInternational;
                }
                if (updates.enabledForBuyNow !== undefined) {
                    updateData.enabledForBuyNow = updates.enabledForBuyNow;
                }
                if (updates.adminNotes !== undefined) {
                    updateData.adminNotes = updates.adminNotes;
                }
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        const updated = await db.factoryProfile.update({
            where: { id },
            data: updateData,
        });

        await logAdminAction({
            adminId: user!.id,
            action: `FACTORY_${action.toUpperCase()}`,
            targetType: 'FACTORY',
            targetId: id,
            before,
            after: createSnapshot(updated),
        });

        return NextResponse.json({ success: true, factory: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update factory' }, { status: 500 });
    }
}
