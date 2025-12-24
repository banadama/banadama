// app/api/admin/feature-flags/route.ts - Feature Flags Admin API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';


// GET /api/admin/feature-flags - List all feature flags
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const flags = await db.featureFlag.findMany({
        include: {
            updatedByAdmin: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
        orderBy: { key: 'asc' },
    });

    return NextResponse.json({ flags });
}

// PATCH /api/admin/feature-flags - Toggle a feature flag
export async function PATCH(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { key, enabled, rolloutPercentage, allowedRoles } = body;

        if (!key) {
            return NextResponse.json({ error: 'Flag key is required' }, { status: 400 });
        }

        // Find or create the flag
        let flag = await db.featureFlag.findUnique({
            where: { key },
        });

        const previousEnabled = flag?.enabled;

        if (flag) {
            // Update existing flag
            flag = await db.featureFlag.update({
                where: { key },
                data: {
                    ...(enabled !== undefined && { enabled }),
                    ...(rolloutPercentage !== undefined && { rolloutPercentage }),
                    ...(allowedRoles !== undefined && { allowedRoles }),
                    updatedByAdminId: admin!.id,
                },
                include: {
                    updatedByAdmin: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });
        } else {
            // Create new flag
            flag = await db.featureFlag.create({
                data: {
                    key,
                    name: key.replace(/_/g, ' ').toLowerCase(),
                    enabled: enabled ?? false,
                    rolloutPercentage: rolloutPercentage ?? 0,
                    allowedRoles: allowedRoles ?? [],
                    updatedByAdminId: admin!.id,
                },
                include: {
                    updatedByAdmin: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });
        }

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: 'TOGGLE_FEATURE_FLAG',
            targetType: 'FEATURE_FLAG',
            targetId: key,
            before: { enabled: previousEnabled },
            after: { enabled: flag.enabled },
        });

        return NextResponse.json({ flag });
    } catch (err) {
        console.error('Error updating feature flag:', err);
        return NextResponse.json({ error: 'Failed to update feature flag' }, { status: 500 });
    }
}

// POST /api/admin/feature-flags - Create a new feature flag
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { key, name, description, category, enabled, rolloutPercentage, allowedRoles } = body;

        if (!key || !name) {
            return NextResponse.json(
                { error: 'Key and name are required' },
                { status: 400 }
            );
        }

        const flag = await db.featureFlag.create({
            data: {
                key,
                name,
                description,
                category,
                enabled: enabled ?? false,
                rolloutPercentage: rolloutPercentage ?? 0,
                allowedRoles: allowedRoles ?? [],
                updatedByAdminId: admin!.id,
            },
            include: {
                updatedByAdmin: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json({ flag }, { status: 201 });
    } catch (err) {
        console.error('Error creating feature flag:', err);
        return NextResponse.json({ error: 'Failed to create feature flag' }, { status: 500 });
    }
}
