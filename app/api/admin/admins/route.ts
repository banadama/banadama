// app/api/admin/admins/route.ts - Admin Role & Permission Manager API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


// GET /api/admin/admins - List all admin users with roles
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    // Get all users with ADMIN role
    const adminUsers = await db.user.findMany({
        where: { role: 'ADMIN' },
        select: {
            id: true,
            email: true,
            phone: true,
            status: true,
            isActive: true,
            createdAt: true,
        },
    });

    // Get admin roles
    const adminRoles = await db.adminRole.findMany();

    // Merge data
    const admins = adminUsers.map((user) => {
        const roleData = adminRoles.find((r) => r.userId === user.id);
        return {
            ...user,
            adminRole: roleData || null,
        };
    });

    return NextResponse.json({ admins });
}

// POST /api/admin/admins - Assign admin role to user
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { userId, roleType, permissions, restrictedTo, notes } = body;

        if (!userId || !roleType) {
            return NextResponse.json(
                { error: 'userId and roleType required' },
                { status: 400 }
            );
        }

        // Check if user exists and is an admin
        const targetUser = await db.user.findUnique({
            where: { id: userId },
        });

        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If user is not ADMIN role, update them
        if (targetUser.role !== 'ADMIN') {
            await db.user.update({
                where: { id: userId },
                data: { role: 'ADMIN' },
            });
        }

        // Create or update admin role
        const adminRole = await db.adminRole.upsert({
            where: { userId },
            update: {
                roleType,
                permissions,
                restrictedTo,
                notes,
                assignedByAdminId: admin!.id,
                assignedAt: new Date(),
            },
            create: {
                userId,
                roleType,
                permissions,
                restrictedTo,
                notes,
                assignedByAdminId: admin!.id,
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: 'CHANGE_ROLE',
            targetType: 'ADMIN_ROLE',
            targetId: adminRole.id,
            targetUserId: userId,
            after: createSnapshot(adminRole),
            metadata: { roleType, permissions },
        });

        return NextResponse.json({ adminRole }, { status: 201 });
    } catch (err) {
        console.error('Error assigning admin role:', err);
        return NextResponse.json(
            { error: 'Failed to assign admin role' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/admins - Update admin role
export async function PATCH(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { userId, roleType, permissions, restrictedTo, notes } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const currentRole = await db.adminRole.findUnique({
            where: { userId },
        });

        if (!currentRole) {
            return NextResponse.json({ error: 'Admin role not found' }, { status: 404 });
        }

        const beforeSnapshot = createSnapshot(currentRole);

        const updatedRole = await db.adminRole.update({
            where: { userId },
            data: {
                ...(roleType && { roleType }),
                ...(permissions !== undefined && { permissions }),
                ...(restrictedTo !== undefined && { restrictedTo }),
                ...(notes !== undefined && { notes }),
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: 'CHANGE_ROLE',
            targetType: 'ADMIN_ROLE',
            targetId: updatedRole.id,
            targetUserId: userId,
            before: beforeSnapshot,
            after: createSnapshot(updatedRole),
        });

        return NextResponse.json({ adminRole: updatedRole });
    } catch (err) {
        console.error('Error updating admin role:', err);
        return NextResponse.json(
            { error: 'Failed to update admin role' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/admins - Remove admin role
export async function DELETE(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const adminRole = await db.adminRole.findUnique({
            where: { userId },
        });

        if (!adminRole) {
            return NextResponse.json({ error: 'Admin role not found' }, { status: 404 });
        }

        await db.adminRole.delete({
            where: { userId },
        });

        // Optionally downgrade user role
        await db.user.update({
            where: { id: userId },
            data: { role: 'BUYER' }, // Or keep as ADMIN with no special role
        });

        await logAdminAction({
            adminId: admin!.id,
            action: 'CHANGE_ROLE',
            targetType: 'ADMIN_ROLE',
            targetId: adminRole.id,
            targetUserId: userId,
            before: createSnapshot(adminRole),
            metadata: { action: 'remove' },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error removing admin role:', err);
        return NextResponse.json(
            { error: 'Failed to remove admin role' },
            { status: 500 }
        );
    }
}
