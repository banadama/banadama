// app/api/admin/accounts/[id]/controls/route.ts - Account Freeze & Limit Controls
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// GET /api/admin/accounts/[id]/controls - Get account control status
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const account = await db.account.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            isFrozen: true,
            frozenAt: true,
            frozenByAdminId: true,
            freezeReason: true,
            canCreateOrders: true,
            canRespondToRfq: true,
            canWithdraw: true,
            canListProducts: true,
            limitNotes: true,
            limitExpiresAt: true,
            isActive: true,
        },
    });

    if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ controls: account });
}

// PATCH /api/admin/accounts/[id]/controls - Update account controls
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const {
            action, // 'freeze', 'unfreeze', 'limit', 'unlimit'
            freezeReason,
            canCreateOrders,
            canRespondToRfq,
            canWithdraw,
            canListProducts,
            limitNotes,
            limitExpiresAt,
        } = body;

        // Get current state for audit
        const currentAccount = await db.account.findUnique({
            where: { id },
        });

        if (!currentAccount) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        const beforeSnapshot = createSnapshot(currentAccount);

        let updateData: Record<string, unknown> = {};

        switch (action) {
            case 'freeze':
                updateData = {
                    isFrozen: true,
                    frozenAt: new Date(),
                    frozenByAdminId: admin!.id,
                    freezeReason: freezeReason || 'Account frozen by admin',
                    // When frozen, disable all actions
                    canCreateOrders: false,
                    canRespondToRfq: false,
                    canWithdraw: false,
                    canListProducts: false,
                };
                break;

            case 'unfreeze':
                updateData = {
                    isFrozen: false,
                    frozenAt: null,
                    frozenByAdminId: null,
                    freezeReason: null,
                    // Restore all actions
                    canCreateOrders: true,
                    canRespondToRfq: true,
                    canWithdraw: true,
                    canListProducts: true,
                    limitNotes: null,
                    limitExpiresAt: null,
                };
                break;

            case 'limit':
                // Granular limits without full freeze
                updateData = {
                    canCreateOrders: canCreateOrders ?? currentAccount.canCreateOrders,
                    canRespondToRfq: canRespondToRfq ?? currentAccount.canRespondToRfq,
                    canWithdraw: canWithdraw ?? currentAccount.canWithdraw,
                    canListProducts: canListProducts ?? currentAccount.canListProducts,
                    limitNotes: limitNotes,
                    limitExpiresAt: limitExpiresAt ? new Date(limitExpiresAt) : null,
                };
                break;

            case 'unlimit':
                // Remove all limits
                updateData = {
                    canCreateOrders: true,
                    canRespondToRfq: true,
                    canWithdraw: true,
                    canListProducts: true,
                    limitNotes: null,
                    limitExpiresAt: null,
                };
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: freeze, unfreeze, limit, unlimit' },
                    { status: 400 }
                );
        }

        const updatedAccount = await db.account.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                isFrozen: true,
                frozenAt: true,
                freezeReason: true,
                canCreateOrders: true,
                canRespondToRfq: true,
                canWithdraw: true,
                canListProducts: true,
                limitNotes: true,
                limitExpiresAt: true,
            },
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: action === 'freeze' ? 'SUSPEND_USER' : 'UPDATE_USER',
            targetType: 'ACCOUNT',
            targetId: id,
            before: beforeSnapshot,
            after: createSnapshot(updatedAccount),
            metadata: { action, freezeReason, limitNotes },
        });

        return NextResponse.json({
            success: true,
            controls: updatedAccount,
            message: `Account ${action} successful`,
        });
    } catch (err) {
        console.error('Error updating account controls:', err);
        return NextResponse.json(
            { error: 'Failed to update account controls' },
            { status: 500 }
        );
    }
}
