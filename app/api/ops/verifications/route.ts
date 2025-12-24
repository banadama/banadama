// app/api/ops/verifications/route.ts - OPS Verification Review (NOT Assignment)

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const { error } = await requireApiRole(['OPS', 'ADMIN']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status) {
        where.status = status;
    }

    try {
        const [requests, total] = await Promise.all([
            db.verificationRequest.findMany({
                where,
                include: {
                    user: {
                        select: { email: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.verificationRequest.count({ where }),
        ]);

        const formatted = requests.map((r) => ({
            id: r.id,
            type: r.type,
            status: r.status,
            userId: r.userId,
            userEmail: r.user?.email,
            documentUrls: r.documentUrl ? [r.documentUrl] : [],
            data: r.data,
            createdAt: r.createdAt,
        }));

        return NextResponse.json({
            requests: formatted,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching verifications:', err);
        return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
    }
}
