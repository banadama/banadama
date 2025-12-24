// app/api/growth/my-suppliers/route.ts - My Suppliers

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('GROWTH_AGENT');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const agent = await db.growthAgentProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!agent) {
            return NextResponse.json({ suppliers: [] });
        }

        const suppliers = await db.growthSupplier.findMany({
            where: { agentId: agent.id },
            include: {
                supplier: {
                    select: {
                        businessName: true,
                        category: true,
                        verificationLevel: true,
                    },
                },
            },
            orderBy: { onboardedAt: 'desc' },
        });

        return NextResponse.json({
            suppliers: suppliers.map((s) => ({
                ...s,
                supplier: s.supplier,
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ suppliers: [] });
    }
}
