// app/api/admin/audit-log/route.ts - Audit Log Admin API (READ ONLY)

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


// GET /api/admin/audit-log - List audit logs
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const adminId = searchParams.get('adminId');
    const targetType = searchParams.get('targetType');
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: Record<string, unknown> = {};

    if (adminId) {
        where.adminId = adminId;
    }

    if (targetType) {
        where.targetType = targetType;
    }

    if (action) {
        where.action = action;
    }

    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
            (where.createdAt as Record<string, unknown>).gte = new Date(startDate);
        }
        if (endDate) {
            (where.createdAt as Record<string, unknown>).lte = new Date(endDate);
        }
    }

    const [logs, total] = await Promise.all([
        db.adminAuditLog.findMany({
            where,
            include: {
                admin: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                targetUser: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        db.adminAuditLog.count({ where }),
    ]);

    return NextResponse.json({
        logs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}
