// app/api/admin/users/[id]/accounts/route.ts - Add accounts to user
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// POST /api/admin/users/[id]/accounts - Add an account to a user
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { id: userId } = await params;

    try {
        // Check if user exists
        const user = await db.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { accountId, type, name, country, role } = body;

        let account;

        // If accountId is provided, link to existing account
        if (accountId) {
            account = await db.account.findUnique({
                where: { id: accountId },
            });

            if (!account) {
                return NextResponse.json({ error: 'Account not found' }, { status: 404 });
            }
        } else {
            // Create a new account
            if (!type || !name || !country) {
                return NextResponse.json(
                    { error: 'Account type, name, and country are required' },
                    { status: 400 }
                );
            }

            account = await db.account.create({
                data: {
                    type,
                    name,
                    country,
                    verificationLevel: 'NONE',
                    isActive: true,
                },
            });
        }

        // Check if membership already exists
        const existingMembership = await db.accountMembership.findUnique({
            where: {
                userId_accountId: {
                    userId,
                    accountId: account.id,
                },
            },
        });

        if (existingMembership) {
            return NextResponse.json(
                { error: 'User is already a member of this account' },
                { status: 409 }
            );
        }

        // Create membership
        const membership = await db.accountMembership.create({
            data: {
                userId,
                accountId: account.id,
                role: role || 'OWNER',
            },
            include: {
                account: true,
            },
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: 'CREATE_USER',
            targetType: 'ACCOUNT_MEMBERSHIP',
            targetId: membership.id,
            targetUserId: userId,
            after: createSnapshot(membership),
            metadata: { accountId: account.id },
        });

        return NextResponse.json({ membership }, { status: 201 });
    } catch (err) {
        console.error('Error adding account to user:', err);
        return NextResponse.json(
            { error: 'Failed to add account to user' },
            { status: 500 }
        );
    }
}

// GET /api/admin/users/[id]/accounts - Get all accounts for a user
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { id: userId } = await params;

    const memberships = await db.accountMembership.findMany({
        where: { userId },
        include: {
            account: true,
        },
    });

    return NextResponse.json({ accounts: memberships });
}
