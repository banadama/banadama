// app/api/admin/disputes/route.ts - Dispute & Resolution Control API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// GET /api/admin/disputes - List all disputes
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: Record<string, unknown> = {};

    if (status) {
        where.status = status;
    }

    if (type) {
        where.type = type;
    }

    const [disputes, total] = await Promise.all([
        db.dispute.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        db.dispute.count({ where }),
    ]);

    return NextResponse.json({
        disputes,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// POST /api/admin/disputes - Create a dispute (admin can create on behalf of user)
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { orderId, buyerId, supplierId, type, description, evidence } = body;

        if (!orderId || !buyerId || !supplierId || !type || !description) {
            return NextResponse.json(
                { error: 'Required: orderId, buyerId, supplierId, type, description' },
                { status: 400 }
            );
        }

        const dispute = await db.dispute.create({
            data: {
                orderId,
                buyerId,
                supplierId,
                type,
                description,
                evidence,
                status: 'OPEN',
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: 'CREATE_DISPUTE',
            targetType: 'DISPUTE',
            targetId: dispute.id,
            after: createSnapshot(dispute),
        });

        return NextResponse.json({ dispute }, { status: 201 });
    } catch (err) {
        console.error('Error creating dispute:', err);
        return NextResponse.json(
            { error: 'Failed to create dispute' },
            { status: 500 }
        );
    }
}
