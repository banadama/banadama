// app/api/admin/market-control/route.ts - Market Mode Control API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


// GET /api/admin/market-control - List all market controls
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const controlType = searchParams.get('controlType');

    const where: Record<string, unknown> = {};

    if (controlType) {
        where.controlType = controlType;
    }

    const controls = await db.marketControl.findMany({
        where,
        orderBy: [{ controlType: 'asc' }, { targetValue: 'asc' }],
    });

    return NextResponse.json({ controls });
}

// POST /api/admin/market-control - Create market control
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const {
            controlType,
            targetValue,
            isEnabled,
            restrictions,
            notes,
            scheduledEnableAt,
            scheduledDisableAt,
        } = body;

        if (!controlType || !targetValue) {
            return NextResponse.json(
                { error: 'controlType and targetValue required' },
                { status: 400 }
            );
        }

        const control = await db.marketControl.create({
            data: {
                controlType,
                targetValue,
                isEnabled: isEnabled ?? true,
                restrictions,
                notes,
                scheduledEnableAt: scheduledEnableAt ? new Date(scheduledEnableAt) : null,
                scheduledDisableAt: scheduledDisableAt ? new Date(scheduledDisableAt) : null,
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: 'UPDATE_CONFIG',
            targetType: 'MARKET_CONTROL',
            targetId: control.id,
            after: createSnapshot(control),
            metadata: { controlType, targetValue },
        });

        return NextResponse.json({ control }, { status: 201 });
    } catch (err) {
        console.error('Error creating market control:', err);
        return NextResponse.json(
            { error: 'Failed to create market control' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/market-control - Update or pause market control
export async function PATCH(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const {
            controlType,
            targetValue,
            action, // 'enable', 'disable', 'pause', 'unpause'
            pauseReason,
            restrictions,
            notes,
            scheduledEnableAt,
            scheduledDisableAt,
        } = body;

        if (!controlType || !targetValue) {
            return NextResponse.json(
                { error: 'controlType and targetValue required' },
                { status: 400 }
            );
        }

        // Find or create the control
        let control = await db.marketControl.findUnique({
            where: {
                controlType_targetValue: {
                    controlType,
                    targetValue,
                },
            },
        });

        const beforeSnapshot = control ? createSnapshot(control) : null;

        let updateData: Record<string, unknown> = {};

        switch (action) {
            case 'enable':
                updateData = {
                    isEnabled: true,
                    isPaused: false,
                    pauseReason: null,
                    pausedAt: null,
                    pausedByAdminId: null,
                };
                break;

            case 'disable':
                updateData = {
                    isEnabled: false,
                };
                break;

            case 'pause':
                updateData = {
                    isPaused: true,
                    pauseReason: pauseReason || 'Paused by admin',
                    pausedAt: new Date(),
                    pausedByAdminId: admin!.id,
                };
                break;

            case 'unpause':
                updateData = {
                    isPaused: false,
                    pauseReason: null,
                    pausedAt: null,
                    pausedByAdminId: null,
                };
                break;

            default:
                // Just update fields
                updateData = {
                    ...(restrictions !== undefined && { restrictions }),
                    ...(notes !== undefined && { notes }),
                    ...(scheduledEnableAt !== undefined && {
                        scheduledEnableAt: scheduledEnableAt ? new Date(scheduledEnableAt) : null,
                    }),
                    ...(scheduledDisableAt !== undefined && {
                        scheduledDisableAt: scheduledDisableAt ? new Date(scheduledDisableAt) : null,
                    }),
                };
        }

        if (control) {
            control = await db.marketControl.update({
                where: {
                    controlType_targetValue: {
                        controlType,
                        targetValue,
                    },
                },
                data: updateData,
            });
        } else {
            control = await db.marketControl.create({
                data: {
                    controlType,
                    targetValue,
                    ...updateData,
                },
            });
        }

        await logAdminAction({
            adminId: admin!.id,
            action: 'UPDATE_CONFIG',
            targetType: 'MARKET_CONTROL',
            targetId: control.id,
            before: beforeSnapshot,
            after: createSnapshot(control),
            metadata: { action, controlType, targetValue, pauseReason },
        });

        return NextResponse.json({
            success: true,
            control,
            message: action ? `Market ${action} successful` : 'Market control updated',
        });
    } catch (err) {
        console.error('Error updating market control:', err);
        return NextResponse.json(
            { error: 'Failed to update market control' },
            { status: 500 }
        );
    }
}
