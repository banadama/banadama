// app/api/admin/growth/settings/route.ts - Growth Settings API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const settings = await db.growthSettings.findFirst();
        return NextResponse.json(settings || {
            growthModeEnabled: true,
            supplierOnboardCommission: 50000,
            firstOrderCommission: 100000,
            orderCommissionRate: 0.005,
            ordersRequiredToUnlock: 1,
            minimumPayout: 500000,
            blockSelfOnboard: true,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const data = await request.json();

        const existing = await db.growthSettings.findFirst();
        const before = existing ? createSnapshot(existing) : null;

        const settings = await db.growthSettings.upsert({
            where: { id: existing?.id || 'default' },
            create: {
                ...data,
                updatedByAdminId: user!.id,
            },
            update: {
                ...data,
                updatedByAdminId: user!.id,
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'GROWTH_SETTINGS_UPDATE',
            targetType: 'SETTINGS',
            targetId: settings.id,
            before,
            after: createSnapshot(settings),
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
