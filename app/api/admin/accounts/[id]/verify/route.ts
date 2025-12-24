// app/api/admin/accounts/[id]/verify/route.ts - Verification Control API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


// PATCH /api/admin/accounts/[id]/verify - Assign or change verification level
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
        const { verificationLevel, verificationNotes } = body;

        if (!verificationLevel) {
            return NextResponse.json(
                { error: 'Verification level is required' },
                { status: 400 }
            );
        }

        // Validate verification level
        const validLevels = ['NONE', 'BLUE', 'GREEN', 'GOLD'];
        if (!validLevels.includes(verificationLevel)) {
            return NextResponse.json(
                { error: 'Invalid verification level' },
                { status: 400 }
            );
        }

        const updatedAccount = await db.account.update({
            where: { id },
            data: {
                verificationLevel,
                verificationNotes,
                verifiedAt: verificationLevel !== 'NONE' ? new Date() : null,
                verifiedByAdminId: verificationLevel !== 'NONE' ? admin!.id : null,
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
                verifiedByAdmin: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: 'APPROVE_SUPPLIER',
            targetType: 'ACCOUNT',
            targetId: id,
            before: createSnapshot(existingAccount),
            after: createSnapshot(updatedAccount),
            metadata: {
                previousLevel: existingAccount.verificationLevel,
                newLevel: verificationLevel,
            },
        });

        return NextResponse.json({ account: updatedAccount });
    } catch (err) {
        console.error('Error updating verification:', err);
        return NextResponse.json(
            { error: 'Failed to update verification' },
            { status: 500 }
        );
    }
}
