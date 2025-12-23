// app/api/admin/products/route.ts - Product & Listing Control API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

// GET /api/admin/products - List products with admin controls
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const approvalStatus = searchParams.get('approvalStatus');
    const isHidden = searchParams.get('isHidden');
    const isFlagged = searchParams.get('isFlagged');
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (approvalStatus) {
        where.approvalStatus = approvalStatus;
    }

    if (isHidden === 'true') {
        where.isHiddenByAdmin = true;
    } else if (isHidden === 'false') {
        where.isHiddenByAdmin = false;
    }

    if (isFlagged === 'true') {
        where.isFlagged = true;
    }

    if (categorySlug) {
        where.categorySlug = categorySlug;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [products, total] = await Promise.all([
        db.product.findMany({
            where,
            include: {
                supplier: {
                    select: {
                        id: true,
                        businessName: true,
                        user: {
                            select: { email: true },
                        },
                    },
                },
                creator: {
                    select: {
                        id: true,
                        displayName: true,
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        db.product.count({ where }),
    ]);

    return NextResponse.json({
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// GET stats for products
export async function HEAD(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return new NextResponse(null, { status: error.status });
    }

    const [pending, flagged, hidden, total] = await Promise.all([
        db.product.count({ where: { approvalStatus: 'PENDING' } }),
        db.product.count({ where: { isFlagged: true } }),
        db.product.count({ where: { isHiddenByAdmin: true } }),
        db.product.count(),
    ]);

    return new NextResponse(null, {
        headers: {
            'X-Pending-Count': String(pending),
            'X-Flagged-Count': String(flagged),
            'X-Hidden-Count': String(hidden),
            'X-Total-Count': String(total),
        },
    });
}
