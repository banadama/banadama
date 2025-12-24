// app/api/admin/trade/settings/route.ts - Trade Settings

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
        const settings = await db.tradeSettings.findFirst();
        return NextResponse.json(settings || {
            internationalEnabled: false,
            requireGreenTickSupplier: true,
            defaultHighValueThreshold: 50000000,
            sourceCountries: ['NG', 'BD'],
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const data = await request.json();

        const existing = await db.tradeSettings.findFirst();
        const before = existing ? createSnapshot(existing) : null;

        const settings = await db.tradeSettings.upsert({
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
            action: 'TRADE_SETTINGS_UPDATE',
            targetType: 'SETTINGS',
            targetId: settings.id,
            before,
            after: createSnapshot(settings),
        });

        return NextResponse.json({ success: true, settings });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
