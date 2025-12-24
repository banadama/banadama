// app/api/affiliate/track-supplier-verified/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';


/**
 * POST /api/affiliate/track-supplier-verified
 * 
 * Track when a supplier referred by an affiliate gets verified.
 * Awards ₦100 commission to the affiliate.
 * 
 * 🔐 OPS/ADMIN only
 * 
 * Expected body:
 * {
 *   "supplierId": "supplier_id",
 *   "affiliateId": "affiliate_id" (optional if supplier has referral link)
 * }
 */
export async function POST(req: NextRequest) {
    try {
        // 🔐 Only OPS/ADMIN can call this
        const user = await getCurrentUser();

        if (!user || (user.role !== 'OPS' && user.role !== 'ADMIN')) {
            return NextResponse.json(
                { ok: false, error: 'Unauthorized - OPS or ADMIN role required' },
                { status: 403 }
            );
        }

        const body = await req.json().catch(() => ({}));

        const supplierId = body.supplierId as string | undefined;
        const affiliateId = body.affiliateId as string | undefined;
        const referralCode = body.referralCode as string | undefined;

        if (!supplierId) {
            return NextResponse.json(
                { ok: false, error: 'Missing supplierId' },
                { status: 400 }
            );
        }

        // Resolve affiliate
        let affiliate = null;
        let linkId = null;

        if (affiliateId) {
            // Direct affiliate ID provided
            affiliate = await prisma.affiliateProfile.findUnique({
                where: { id: affiliateId },
                select: { id: true },
            });

            // Get any active link for this affiliate
            const link = await prisma.affiliateLink.findFirst({
                where: { affiliateId, active: true },
                select: { id: true },
            });
            linkId = link?.id;
        } else if (referralCode) {
            // Referral code (link slug) provided
            const link = await prisma.affiliateLink.findUnique({
                where: { slug: referralCode },
                select: { id: true, affiliateId: true, active: true },
            });

            if (link && link.active) {
                linkId = link.id;
                affiliate = await prisma.affiliateProfile.findUnique({
                    where: { id: link.affiliateId },
                    select: { id: true },
                });
            }
        } else {
            return NextResponse.json(
                { ok: false, error: 'Either affiliateId or referralCode is required' },
                { status: 400 }
            );
        }

        if (!affiliate) {
            return NextResponse.json(
                { ok: false, error: 'Affiliate not found' },
                { status: 404 }
            );
        }

        // Check for duplicate tracking
        const existing = await prisma.affiliateConversion.findFirst({
            where: {
                affiliateId: affiliate.id,
                type: 'VERIFIED_SUPPLIER',
                supplierId,
            },
        });

        if (existing) {
            // Already paid for this supplier
            return NextResponse.json({
                ok: true,
                tracked: false,
                alreadyTracked: true
            });
        }

        // Create conversion with ₦100 bonus (10000 kobo)
        const conversion = await prisma.affiliateConversion.create({
            data: {
                affiliateId: affiliate.id,
                linkId: linkId!,
                type: 'VERIFIED_SUPPLIER',
                supplierId,
                commissionAmount: 10000, // ₦100 in kobo
                currency: 'NGN',
                paid: false,
            },
        });

        // Update affiliate earnings
        await prisma.affiliateProfile.update({
            where: { id: affiliate.id },
            data: {
                totalEarnings: { increment: 10000 } // Add ₦100
            }
        });

        // 🎯 ₦100 per verified supplier awarded
        return NextResponse.json({
            ok: true,
            tracked: true,
            conversion,
            bonus: 100 // ₦100
        });
    } catch (err) {
        console.error('POST /api/affiliate/track-supplier-verified error:', err);
        return NextResponse.json(
            { ok: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
