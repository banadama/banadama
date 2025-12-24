// app/api/admin/finance/wallets/[id]/route.ts - Wallet Actions

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    // Check FINANCE_ADMIN role
    const adminRole = await db.adminRole.findUnique({
        where: { userId: user!.id },
    });

    if (!adminRole || !['SUPER_ADMIN', 'FINANCE_ADMIN'].includes(adminRole.roleType)) {
        return NextResponse.json(
            { error: 'Only FINANCE_ADMIN can freeze/unfreeze wallets' },
            { status: 403 }
        );
    }

    try {
        const { action, reason } = await request.json();

        const wallet = await db.accountWallet.findUnique({
            where: { id },
        });

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        const before = createSnapshot(wallet);
        let updatedWallet;

        switch (action) {
            case 'freeze':
                if (!reason) {
                    return NextResponse.json({ error: 'Reason required to freeze wallet' }, { status: 400 });
                }
                updatedWallet = await db.accountWallet.update({
                    where: { id },
                    data: {
                        status: 'FROZEN',
                        frozenAt: new Date(),
                        frozenReason: reason,
                        frozenByAdminId: user!.id,
                    },
                });
                break;

            case 'unfreeze':
                updatedWallet = await db.accountWallet.update({
                    where: { id },
                    data: {
                        status: 'ACTIVE',
                        frozenAt: null,
                        frozenReason: null,
                        frozenByAdminId: null,
                    },
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Log audit
        await logAdminAction({
            adminId: user!.id,
            action: `WALLET_${action.toUpperCase()}`,
            targetType: 'WALLET',
            targetId: id,
            before,
            after: createSnapshot(updatedWallet),
            metadata: { reason },
        });

        return NextResponse.json({ success: true, wallet: updatedWallet });
    } catch (err) {
        console.error('Error updating wallet:', err);
        return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 });
    }
}
