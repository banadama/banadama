// app/api/admin/users/route.ts - Admin Users API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// GET /api/admin/users - List all users with accounts
export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (status) {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [users, total] = await Promise.all([
        db.user.findMany({
            where,
            include: {
                accounts: {
                    include: {
                        account: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        db.user.count({ where }),
    ]);

    return NextResponse.json({
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { email, phone, role, country, status } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email },
                    ...(phone ? [{ phone }] : []),
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const newUser = await db.user.create({
            data: {
                email,
                phone,
                role: role || 'BUYER',
                country,
                status: status || 'ACTIVE',
                isActive: status !== 'SUSPENDED',
            },
            include: {
                accounts: {
                    include: {
                        account: true,
                    },
                },
            },
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: 'CREATE_USER',
            targetType: 'USER',
            targetId: newUser.id,
            targetUserId: newUser.id,
            after: createSnapshot(newUser),
        });

        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (err) {
        console.error('Error creating user:', err);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
