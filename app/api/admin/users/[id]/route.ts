// app/api/admin/users/[id]/route.ts - Single User Admin API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// GET /api/admin/users/[id] - Get single user with accounts
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { id } = await params;

    const user = await db.user.findUnique({
        where: { id },
        include: {
            accounts: {
                include: {
                    account: true,
                },
            },
            buyerProfile: true,
            supplierProfile: true,
            creatorProfile: true,
            affiliateProfile: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
}

// PATCH /api/admin/users/[id] - Update user
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
        const existingUser = await db.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { email, phone, role, country, status, isActive } = body;

        const updatedUser = await db.user.update({
            where: { id },
            data: {
                ...(email && { email }),
                ...(phone !== undefined && { phone }),
                ...(role && { role }),
                ...(country !== undefined && { country }),
                ...(status && { status }),
                ...(isActive !== undefined && { isActive }),
            },
            include: {
                accounts: {
                    include: {
                        account: true,
                    },
                },
            },
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: 'UPDATE_USER',
            targetType: 'USER',
            targetId: id,
            targetUserId: id,
            before: createSnapshot(existingUser),
            after: createSnapshot(updatedUser),
        });

        return NextResponse.json({ user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE /api/admin/users/[id] - Delete user (soft delete by suspending)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { id } = await params;

    try {
        const existingUser = await db.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Soft delete - set status to SUSPENDED
        const updatedUser = await db.user.update({
            where: { id },
            data: {
                status: 'SUSPENDED',
                isActive: false,
            },
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: 'SUSPEND_USER',
            targetType: 'USER',
            targetId: id,
            targetUserId: id,
            before: createSnapshot(existingUser),
            after: createSnapshot(updatedUser),
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error('Error deleting user:', err);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
