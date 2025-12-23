// app/api/affiliate/record-sale/route.ts - Record Affiliate Sale (Internal use)
// This should be called when an order is placed
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { orderId, orderAmount, buyerId } = await request.json();

        if (!orderId || !orderAmount || !buyerId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get affiliate ref from cookie
        const cookieStore = await cookies();
        const affiliateRef = cookieStore.get('affiliate_ref')?.value;

        if (!affiliateRef) {
            return NextResponse.json({ recorded: false, reason: 'No affiliate cookie' });
        }

        // Find affiliate link
        const link = await db.affiliateLink.findUnique({
            where: { trackingCode: affiliateRef },
            include: {
                affiliate: { select: { id: true, userId: true, status: true, customCommissionRate: true } },
            },
        });

        if (!link || !link.isActive || link.affiliate.status !== 'ACTIVE') {
            return NextResponse.json({ recorded: false, reason: 'Invalid or inactive affiliate' });
        }

        // Check self-referral
        const settings = await db.affiliateSettings.findFirst();
        if (settings?.blockSelfReferral) {
            if (link.affiliate.userId === buyerId) {
                return NextResponse.json({ recorded: false, reason: 'Self-referral blocked' });
            }
        }

        // Get commission rate
        const commissionRate = link.affiliate.customCommissionRate || settings?.defaultCommissionRate || 0.05;
        const commissionAmount = Math.floor(orderAmount * commissionRate);

        // Check if sale already recorded for this order
        const existingSale = await db.affiliateSale.findFirst({
            where: { orderId },
        });

        if (existingSale) {
            return NextResponse.json({ recorded: false, reason: 'Sale already recorded' });
        }

        // Record the sale
        const sale = await db.affiliateSale.create({
            data: {
                affiliateId: link.affiliate.id,
                linkId: link.id,
                orderId,
                orderAmount,
                buyerId,
                commissionRate,
                commissionAmount,
                status: 'PENDING',
                orderCreatedAt: new Date(),
            },
        });

        // Update link stats
        await db.affiliateLink.update({
            where: { id: link.id },
            data: {
                sales: { increment: 1 },
            },
        });

        // Update affiliate pending earnings
        await db.affiliateProfile.update({
            where: { id: link.affiliate.id },
            data: {
                totalSales: { increment: 1 },
                pendingEarnings: { increment: commissionAmount },
            },
        });

        return NextResponse.json({
            recorded: true,
            saleId: sale.id,
            commissionAmount,
        });
    } catch (err) {
        console.error('Error recording affiliate sale:', err);
        return NextResponse.json({ error: 'Failed to record sale' }, { status: 500 });
    }
}
