// app/api/admin/growth/agents/route.ts - List Growth Agents

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

    try {
        const where: Record<string, unknown> = {};
        if (status) {
            where.status = status;
        }

        const agents = await db.growthAgentProfile.findMany({
            where,
            include: {
                user: {
                    select: { email: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            agents: agents.map((a) => ({
                ...a,
                user: { email: a.user?.email, name: a.user?.name },
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ agents: [] });
    }
}
