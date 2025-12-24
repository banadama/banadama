// app/api/admin/accounts/route.ts - Admin Accounts API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


// GET /api/admin/accounts - List all accounts
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const country = searchParams.get('country');
    const verificationLevel = searchParams.get('verificationLevel');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (type) {
        where.type = type;
    }

    if (country) {
        where.country = country;
    }

    if (verificationLevel) {
        where.verificationLevel = verificationLevel;
    }

    if (isActive !== null && isActive !== undefined) {
        where.isActive = isActive === 'true';
    }

    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const [accounts, total] = await Promise.all([
        db.account.findMany({
            where,
            include: {
                memberships: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                verifiedByAdmin: {
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
        db.account.count({ where }),
    ]);

    return NextResponse.json({
        accounts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// POST /api/admin/accounts - Create a new account
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { type, name, country, profileData, ownerId } = body;

        if (!type || !name || !country) {
            return NextResponse.json(
                { error: 'Type, name, and country are required' },
                { status: 400 }
            );
        }

        const account = await db.account.create({
            data: {
                type,
                name,
                country,
                profileData,
                verificationLevel: 'NONE',
                isActive: true,
                // If ownerId is provided, create membership
                ...(ownerId && {
                    memberships: {
                        create: {
                            userId: ownerId,
                            role: 'OWNER',
                        },
                    },
                }),
            },
            include: {
                memberships: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ account }, { status: 201 });
    } catch (err) {
        console.error('Error creating account:', err);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}
