// app/api/affiliate/track-signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/affiliate/track-signup
 * 
 * Logs a signup conversion when a new user registers via an affiliate link.
 * Call this from your auth/register flow immediately after user creation.
 * 
 * Expected body:
 * {
 *   "referralCode": "ABC123",  // affiliate link slug
 *   "referredUserId": "newly_created_user_id"
 * }
 * 
 * Creates:
 * - AffiliateConversion record with type SIGNUP
 * - Commission of ₦50 (5000 kobo)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));

        const referralCode = body.referralCode as string | undefined;
        const referredUserId = body.referredUserId as string | undefined;

        if (!referralCode) {
            return NextResponse.json(
                { ok: false, error: 'Missing referralCode' },
                { status: 400 },
            );
        }

        if (!referredUserId) {
            return NextResponse.json(
                { ok: false, error: 'Missing referredUserId' },
                { status: 400 },
            );
        }

        // Find affiliate link by slug (referralCode)
        const link = await prisma.affiliateLink.findUnique({
            where: { slug: referralCode },
            select: { id: true, affiliateId: true, active: true },
        });

        if (!link || !link.active) {
            // Invalid or inactive code
            return NextResponse.json({ ok: true, tracked: false });
        }

        // Check for duplicate signup tracking
        const existing = await prisma.affiliateConversion.findFirst({
            where: {
                affiliateId: link.affiliateId,
                type: 'SIGNUP',
                userId: referredUserId,
            },
        });

        if (existing) {
            return NextResponse.json({ ok: true, tracked: false, alreadyTracked: true });
        }

        // Create conversion record with ₦50 commission (5000 kobo)
        await prisma.affiliateConversion.create({
            data: {
                affiliateId: link.affiliateId,
                linkId: link.id,
                type: 'SIGNUP',
                userId: referredUserId,
                commissionAmount: 5000, // ₦50 in kobo
                currency: 'NGN',
                paid: false,
            },
        });

        // Update link and profile stats
        await Promise.all([
            prisma.affiliateLink.update({
                where: { id: link.id },
                data: { signups: { increment: 1 } }
            }),
            prisma.affiliateProfile.update({
                where: { id: link.affiliateId },
                data: {
                    totalSignups: { increment: 1 },
                    totalEarnings: { increment: 5000 } // Add ₦50
                }
            })
        ]);

        return NextResponse.json({ ok: true, tracked: true });
    } catch (err) {
        console.error('POST /api/affiliate/track-signup error:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
