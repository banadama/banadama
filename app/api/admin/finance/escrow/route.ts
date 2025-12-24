// app/api/admin/finance/escrow/route.ts - Escrow Management API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    try {
        const where: Record<string, unknown> = {};
        if (status) {
            where.status = status;
        }

        const [escrows, total] = await Promise.all([
            db.escrow.findMany({
                where,
                include: {
                    order: {
                        select: {
                            productName: true,
                            buyer: { select: { user: { select: { email: true } } } },
                            supplier: { select: { businessName: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.escrow.count({ where }),
        ]);

        const formatted = escrows.map((e) => ({
            ...e,
            order: {
                productName: e.order?.productName,
                buyerEmail: e.order?.buyer?.user?.email,
                supplierName: e.order?.supplier?.businessName,
            },
        }));

        return NextResponse.json({
            escrows: formatted,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('Error fetching escrows:', err);
        // Return empty if models don't exist
        return NextResponse.json({
            escrows: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        });
    }
}
