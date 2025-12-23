// app/api/admin/trade/countries/route.ts - Country Management
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// Whitelisted countries that CAN be added (safety check)
const ALLOWED_COUNTRY_CODES = new Set([
    // Source countries
    'NG', 'BD',
    // Phase 1 target countries (carefully selected)
    'US', 'UK', 'GB', 'CA', 'DE', 'FR', 'NL', 'BE', 'IT', 'ES',
    'AE', 'SA', 'QA', 'KW', 'GH', 'KE', 'ZA', 'EG',
    'AU', 'SG', 'MY', 'IN',
]);

export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    try {
        const where: Record<string, unknown> = {};
        if (status) {
            where.status = status;
        }

        const countries = await db.tradeCountry.findMany({
            where,
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ countries });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ countries: [] });
    }
}

export async function POST(request: NextRequest) {
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { code, name, region } = await request.json();

        if (!code || !name) {
            return NextResponse.json({ error: 'Code and name required' }, { status: 400 });
        }

        const upperCode = code.toUpperCase();

        // SAFETY CHECK: Only allow whitelisted countries
        if (!ALLOWED_COUNTRY_CODES.has(upperCode)) {
            return NextResponse.json({
                error: `Country ${upperCode} is not in the approved list. Contact platform admin.`
            }, { status: 403 });
        }

        // Check if exists
        const existing = await db.tradeCountry.findUnique({
            where: { code: upperCode },
        });

        if (existing) {
            return NextResponse.json({ error: 'Country already exists' }, { status: 409 });
        }

        // Create as DISABLED (admin must explicitly enable)
        const country = await db.tradeCountry.create({
            data: {
                code: upperCode,
                name,
                region,
                status: 'DISABLED',
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'TRADE_COUNTRY_ADD',
            targetType: 'COUNTRY',
            targetId: country.id,
            after: createSnapshot(country),
        });

        return NextResponse.json({ country });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to add country' }, { status: 500 });
    }
}
