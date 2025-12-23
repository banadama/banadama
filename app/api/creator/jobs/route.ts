// app/api/creator/jobs/route.ts - Creator Jobs
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('CREATOR');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    try {
        const creator = await db.creatorProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!creator) {
            return NextResponse.json({ jobs: [] });
        }

        const where: Record<string, unknown> = { creatorId: creator.id };

        if (status === 'ACTIVE') {
            where.status = { in: ['ASSIGNED', 'IN_PROGRESS'] };
        } else if (status) {
            where.status = status;
        }

        const jobs = await db.creatorJob.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            jobs: jobs.map((j) => ({
                id: j.id,
                title: j.title,
                jobType: j.jobType,
                companyName: j.companyName,
                budgetAmount: j.budgetAmount,
                status: j.status,
                deadline: j.deadline?.toISOString(),
                createdAt: j.createdAt.toISOString(),
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ jobs: [] });
    }
}
