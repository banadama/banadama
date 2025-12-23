// app/api/affiliate/track/route.ts - Track Affiliate Click (Public)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');
    const redirect = searchParams.get('redirect') || '/';

    if (!ref) {
        // No affiliate code, redirect normally
        return NextResponse.redirect(new URL(redirect, request.url));
    }

    try {
        // Find affiliate link
        const link = await db.affiliateLink.findUnique({
            where: { trackingCode: ref },
            include: {
                affiliate: { select: { status: true } },
            },
        });

        if (link && link.isActive && link.affiliate.status === 'ACTIVE') {
            // Increment click count
            await db.affiliateLink.update({
                where: { id: link.id },
                data: {
                    clicks: { increment: 1 },
                },
            });

            // Update affiliate total clicks
            await db.affiliateProfile.update({
                where: { id: link.affiliateId },
                data: {
                    totalClicks: { increment: 1 },
                },
            });
        }

        // Set affiliate cookie and redirect
        const response = NextResponse.redirect(new URL(redirect, request.url));

        // Get cookie duration from settings
        const settings = await db.affiliateSettings.findFirst();
        const cookieDays = settings?.cookieDuration || 30;

        response.cookies.set('affiliate_ref', ref, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: cookieDays * 24 * 60 * 60, // days to seconds
            path: '/',
        });

        return response;
    } catch (err) {
        console.error('Error tracking affiliate click:', err);
        return NextResponse.redirect(new URL(redirect, request.url));
    }
}
