// app/api/affiliate/links/route.ts - Affiliate Links CRUD
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { randomBytes } from 'crypto';

// GET - List affiliate's links
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
            return NextResponse.json({ links: [] });
        }

        const links = await db.affiliateLink.findMany({
            where: { affiliateId: affiliate.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ links });
    } catch (err) {
        console.error('Error fetching links:', err);
        return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
    }
}

// POST - Create new link
export async function POST(request: NextRequest) {
    const { user, error } = await requireApiRole('AFFILIATE');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const affiliate = await db.affiliateProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!affiliate) {
            return NextResponse.json({ error: 'Affiliate profile not found' }, { status: 404 });
        }

        if (affiliate.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Your affiliate account must be active to create links' }, { status: 403 });
        }

        const { name, targetType, targetId } = await request.json();

        // Generate unique tracking code
        const trackingCode = randomBytes(6).toString('hex').toUpperCase();

        const link = await db.affiliateLink.create({
            data: {
                affiliateId: affiliate.id,
                trackingCode,
                name: name || null,
                targetType: targetType || 'MARKETPLACE',
                targetId: targetId || null,
            },
        });

        return NextResponse.json({ link });
    } catch (err) {
        console.error('Error creating link:', err);
        return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
    }
}
