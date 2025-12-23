// app/api/admin/finance/wallets/[id]/adjust/route.ts - Wallet Balance Adjustment (FINANCE_ADMIN only)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    // Check FINANCE_ADMIN role - adjustments are critical
    const adminRole = await db.adminRole.findUnique({
        where: { userId: user!.id },
    });

    if (!adminRole || !['SUPER_ADMIN', 'FINANCE_ADMIN'].includes(adminRole.roleType)) {
        return NextResponse.json(
            { error: 'Only FINANCE_ADMIN can adjust wallet balances' },
            { status: 403 }
        );
    }

    try {
        const { amount, reason } = await request.json();

        if (!reason || reason.trim().length < 10) {
            return NextResponse.json(
                { error: 'Detailed reason (min 10 chars) required for adjustments' },
                { status: 400 }
            );
        }

        if (typeof amount !== 'number' || amount === 0) {
            return NextResponse.json({ error: 'Valid non-zero amount required' }, { status: 400 });
        }

        const wallet = await db.accountWallet.findUnique({
            where: { id },
        });

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        const before = createSnapshot(wallet);
        const balanceBefore = wallet.availableBalance;
        const balanceAfter = balanceBefore + amount;

        if (balanceAfter < 0) {
            return NextResponse.json(
                { error: 'Adjustment would result in negative balance' },
                { status: 400 }
            );
        }

        // Update wallet balance
        const updatedWallet = await db.accountWallet.update({
            where: { id },
            data: {
                availableBalance: balanceAfter,
            },
        });

        // Create ledger entry
        await db.ledgerEntry.create({
            data: {
                walletId: id,
                type: 'ADJUSTMENT',
                amount,
                balanceBefore,
                balanceAfter,
                description: `ADJUSTMENT: ${reason}`,
                createdByAdminId: user!.id,
                createdByReason: reason,
            },
        });

        // Log audit
        await logAdminAction({
            adminId: user!.id,
            action: 'WALLET_ADJUSTMENT',
            targetType: 'WALLET',
            targetId: id,
            before,
            after: createSnapshot(updatedWallet),
            metadata: { amount, reason, balanceBefore, balanceAfter },
        });

        return NextResponse.json({
            success: true,
            wallet: updatedWallet,
            adjustment: { amount, balanceBefore, balanceAfter },
        });
    } catch (err) {
        console.error('Error adjusting wallet:', err);
        return NextResponse.json({ error: 'Failed to adjust wallet' }, { status: 500 });
    }
}
