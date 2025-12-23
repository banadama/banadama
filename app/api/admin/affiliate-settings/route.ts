// app/api/admin/affiliate-settings/route.ts - Affiliate Program Settings
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// GET - Get settings
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        let settings = await db.affiliateSettings.findFirst();

        // Return defaults if no settings exist
        if (!settings) {
            return NextResponse.json({
                defaultCommissionRate: 0.05,
                categoryRates: {},
                minimumPayout: 500000,
                blockSelfReferral: true,
                cookieDuration: 30,
                isEnabled: true,
                requireApproval: true,
            });
        }

        return NextResponse.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const data = await request.json();

        // Get existing settings for audit
        const existingSettings = await db.affiliateSettings.findFirst();
        const before = existingSettings ? createSnapshot(existingSettings) : null;

        // Upsert settings
        const settings = await db.affiliateSettings.upsert({
            where: { id: existingSettings?.id || 'default' },
            create: {
                defaultCommissionRate: data.defaultCommissionRate || 0.05,
                categoryRates: data.categoryRates || {},
                minimumPayout: data.minimumPayout || 500000,
                blockSelfReferral: data.blockSelfReferral ?? true,
                cookieDuration: data.cookieDuration || 30,
                isEnabled: data.isEnabled ?? true,
                requireApproval: data.requireApproval ?? true,
                updatedByAdminId: user!.id,
            },
            update: {
                defaultCommissionRate: data.defaultCommissionRate,
                categoryRates: data.categoryRates,
                minimumPayout: data.minimumPayout,
                blockSelfReferral: data.blockSelfReferral,
                cookieDuration: data.cookieDuration,
                isEnabled: data.isEnabled,
                requireApproval: data.requireApproval,
                updatedByAdminId: user!.id,
            },
        });

        // Log audit
        await logAdminAction({
            adminId: user!.id,
            action: 'AFFILIATE_SETTINGS_UPDATE',
            targetType: 'SETTINGS',
            targetId: settings.id,
            before,
            after: createSnapshot(settings),
        });

        return NextResponse.json({ success: true, settings });
    } catch (err) {
        console.error('Error updating settings:', err);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
