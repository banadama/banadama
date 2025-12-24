// app/api/admin/accounts/[id]/route.ts - Single Account Admin API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


// GET /api/admin/accounts/[id] - Get single account
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { id } = await params;

    const account = await db.account.findUnique({
        where: { id },
        include: {
            memberships: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            phone: true,
                            status: true,
                        },
                    },
                },
            },
            verifiedByAdmin: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });

    if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ account });
}

// PATCH /api/admin/accounts/[id] - Update account
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { id } = await params;

    try {
        const existingAccount = await db.account.findUnique({
            where: { id },
        });

        if (!existingAccount) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        const body = await request.json();
        const { type, name, country, profileData, isActive } = body;

        const updatedAccount = await db.account.update({
            where: { id },
            data: {
                ...(type && { type }),
                ...(name && { name }),
                ...(country && { country }),
                ...(profileData !== undefined && { profileData }),
                ...(isActive !== undefined && { isActive }),
            },
            include: {
                memberships: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: 'UPDATE_USER',
            targetType: 'ACCOUNT',
            targetId: id,
            before: createSnapshot(existingAccount),
            after: createSnapshot(updatedAccount),
        });

        return NextResponse.json({ account: updatedAccount });
    } catch (err) {
        console.error('Error updating account:', err);
        return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
    }
}
