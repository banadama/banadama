// app/api/affiliate/withdraw/route.ts - Affiliate Withdrawal

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


// GET - Withdrawal info
export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('AFFILIATE');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const affiliate = await db.affiliateProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!affiliate) {
            return NextResponse.json({
                availableBalance: 0,
                minimumPayout: 500000,
                pendingPayouts: [],
            });
        }

        const settings = await db.affiliateSettings.findFirst();
        const minimumPayout = settings?.minimumPayout || 500000;

        // Calculate available balance
        const deliveredEarnings = await db.affiliateSale.aggregate({
            _sum: { commissionAmount: true },
            where: { affiliateId: affiliate.id, status: 'DELIVERED' },
        });

        const pendingPayoutsTotal = await db.affiliatePayout.aggregate({
            _sum: { amount: true },
            where: {
                affiliateId: affiliate.id,
                status: { in: ['PENDING', 'PENDING_FINANCE', 'APPROVED', 'PROCESSING'] },
            },
        });

        const availableBalance = (deliveredEarnings._sum.commissionAmount || 0) - (pendingPayoutsTotal._sum.amount || 0);

        // Get pending payouts
        const pendingPayouts = await db.affiliatePayout.findMany({
            where: {
                affiliateId: affiliate.id,
                status: { notIn: ['COMPLETED', 'REJECTED'] },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            availableBalance: Math.max(0, availableBalance),
            minimumPayout,
            pendingPayouts: pendingPayouts.map((p) => ({
                id: p.id,
                amount: p.amount,
                status: p.status,
                submittedAt: p.submittedAt.toISOString(),
            })),
        });
    } catch (err) {
        console.error('Error fetching withdrawal info:', err);
        return NextResponse.json({ error: 'Failed to fetch info' }, { status: 500 });
    }
}

// POST - Request withdrawal
export async function POST(request: NextRequest) {
    const { user, error } = await requireApiRole('AFFILIATE');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { amount } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Valid amount required' }, { status: 400 });
        }

        const affiliate = await db.affiliateProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!affiliate) {
            return NextResponse.json({ error: 'Affiliate profile not found' }, { status: 404 });
        }

        if (affiliate.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Account must be active to withdraw' }, { status: 403 });
        }

        const settings = await db.affiliateSettings.findFirst();
        const minimumPayout = settings?.minimumPayout || 500000;

        if (amount < minimumPayout) {
            return NextResponse.json({
                error: `Minimum withdrawal is ₦${(minimumPayout / 100).toLocaleString()}`
            }, { status: 400 });
        }

        // Verify available balance
        const deliveredEarnings = await db.affiliateSale.aggregate({
            _sum: { commissionAmount: true },
            where: { affiliateId: affiliate.id, status: 'DELIVERED' },
        });

        const pendingPayoutsTotal = await db.affiliatePayout.aggregate({
            _sum: { amount: true },
            where: {
                affiliateId: affiliate.id,
                status: { in: ['PENDING', 'PENDING_FINANCE', 'APPROVED', 'PROCESSING'] },
            },
        });

        const availableBalance = (deliveredEarnings._sum.commissionAmount || 0) - (pendingPayoutsTotal._sum.amount || 0);

        if (amount > availableBalance) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Create payout request - requires Finance approval
        const payout = await db.affiliatePayout.create({
            data: {
                affiliateId: affiliate.id,
                amount,
                status: 'PENDING_FINANCE',
            },
        });

        return NextResponse.json({
            success: true,
            payout: { id: payout.id, amount: payout.amount, status: payout.status },
            message: 'Withdrawal request submitted for Finance approval',
        });
    } catch (err) {
        console.error('Error creating withdrawal:', err);
        return NextResponse.json({ error: 'Failed to create withdrawal' }, { status: 500 });
    }
}
