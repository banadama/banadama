// app/api/ops/creator-jobs/route.ts - Ops Manage Creator Jobs

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('OPS');
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

        const jobs = await db.creatorJob.findMany({
            where,
            include: {
                creator: {
                    select: { displayName: true, hasBlueTick: true, hasGreenTick: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            jobs: jobs.map((j) => ({
                id: j.id,
                title: j.title,
                jobType: j.jobType,
                companyName: j.companyName,
                companyCountry: j.companyCountry,
                status: j.status,
                budgetAmount: j.budgetAmount,
                creatorName: j.creator?.displayName,
                creatorHasBlueTick: j.creator?.hasBlueTick,
                deadline: j.deadline?.toISOString(),
                createdAt: j.createdAt.toISOString(),
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ jobs: [] });
    }
}

// Assign creator to job
export async function POST(request: NextRequest) {
    const { user, error } = await requireApiRole('OPS');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { jobId, creatorId, platformFee } = await request.json();

        if (!jobId || !creatorId) {
            return NextResponse.json({ error: 'Missing jobId or creatorId' }, { status: 400 });
        }

        const job = await db.creatorJob.findUnique({ where: { id: jobId } });
        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const creator = await db.creatorProfile.findUnique({ where: { id: creatorId } });
        if (!creator) {
            return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
        }

        // For local jobs, verify same country
        const localJobTypes = ['CREATOR_MODEL', 'CREATOR_PHOTOGRAPHER', 'CREATOR_VIDEOGRAPHER'];
        if (localJobTypes.includes(job.jobType) && creator.country !== job.companyCountry) {
            return NextResponse.json({
                error: 'Local jobs require creator and company to be in the same country'
            }, { status: 400 });
        }

        const before = createSnapshot(job);

        const fee = platformFee || Math.round(job.budgetAmount * 0.10); // 10% default
        const creatorPayout = job.budgetAmount - fee;

        const updated = await db.creatorJob.update({
            where: { id: jobId },
            data: {
                creatorId,
                assignedByOpsId: user!.id,
                assignedAt: new Date(),
                status: 'ASSIGNED',
                platformFee: fee,
                creatorPayout,
            },
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'CREATOR_JOB_ASSIGNED',
            targetType: 'CREATOR_JOB',
            targetId: jobId,
            before,
            after: createSnapshot(updated),
            metadata: { creatorId },
        });

        return NextResponse.json({ success: true, job: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to assign creator' }, { status: 500 });
    }
}
