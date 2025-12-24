// app/api/admin/site-settings/route.ts - Site Settings Admin API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


// GET /api/admin/site-settings - List all site settings
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};
    if (category) {
        where.category = category;
    }

    const settings = await db.siteSetting.findMany({
        where,
        include: {
            updatedByAdmin: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
        orderBy: [{ category: 'asc' }, { key: 'asc' }],
    });

    return NextResponse.json({ settings });
}

// PATCH /api/admin/site-settings - Update a site setting
export async function PATCH(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { key, value, description, category } = body;

        if (!key) {
            return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });
        }

        // Find or create the setting
        let existingSetting = await db.siteSetting.findUnique({
            where: { key },
        });

        let setting;
        if (existingSetting) {
            // Update existing setting
            setting = await db.siteSetting.update({
                where: { key },
                data: {
                    value,
                    ...(description !== undefined && { description }),
                    ...(category !== undefined && { category }),
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
            // Create new setting
            setting = await db.siteSetting.create({
                data: {
                    key,
                    value,
                    description,
                    category,
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
            action: 'UPDATE_CONFIG',
            targetType: 'CONFIG',
            targetId: key,
            before: existingSetting ? createSnapshot(existingSetting) : null,
            after: createSnapshot(setting),
        });

        return NextResponse.json({ setting });
    } catch (err) {
        console.error('Error updating site setting:', err);
        return NextResponse.json({ error: 'Failed to update site setting' }, { status: 500 });
    }
}

// POST /api/admin/site-settings - Create a new site setting
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { key, value, description, category } = body;

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const setting = await db.siteSetting.create({
            data: {
                key,
                value,
                description,
                category,
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

        return NextResponse.json({ setting }, { status: 201 });
    } catch (err) {
        console.error('Error creating site setting:', err);
        return NextResponse.json({ error: 'Failed to create site setting' }, { status: 500 });
    }
}
