// app/api/affiliate/confirm-delivery/route.ts - Unlock Affiliate Commission (Internal)
// Called when delivery is confirmed to unlock commission

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function POST(request: NextRequest) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
        }

        // Find affiliate sale for this order
        const sale = await db.affiliateSale.findFirst({
            where: { orderId, status: { in: ['PENDING', 'ESCROW_LOCKED'] } },
        });

        if (!sale) {
            return NextResponse.json({ unlocked: false, reason: 'No pending affiliate sale for this order' });
        }

        // Update sale status to DELIVERED (commission unlocked)
        await db.affiliateSale.update({
            where: { id: sale.id },
            data: {
                status: 'DELIVERED',
                deliveryConfirmedAt: new Date(),
                earningUnlockedAt: new Date(),
            },
        });

        // Update affiliate earnings
        await db.affiliateProfile.update({
            where: { id: sale.affiliateId },
            data: {
                pendingEarnings: { decrement: sale.commissionAmount },
                totalEarnings: { increment: sale.commissionAmount },
            },
        });

        // Update link stats
        if (sale.linkId) {
            await db.affiliateLink.update({
                where: { id: sale.linkId },
                data: {
                    earnings: { increment: sale.commissionAmount },
                },
            });
        }

        return NextResponse.json({
            unlocked: true,
            saleId: sale.id,
            commissionAmount: sale.commissionAmount,
        });
    } catch (err) {
        console.error('Error confirming affiliate delivery:', err);
        return NextResponse.json({ error: 'Failed to confirm delivery' }, { status: 500 });
    }
}
