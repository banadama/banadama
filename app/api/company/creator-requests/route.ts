// app/api/company/creator-requests/route.ts - Company Creator Requests

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole(['SUPPLIER', 'FACTORY', 'WHOLESALER']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const supplier = await db.supplier.findFirst({
            where: { userId: user!.id },
        });

        if (!supplier) {
            return NextResponse.json({ requests: [] });
        }

        const jobs = await db.creatorJob.findMany({
            where: { companyId: supplier.id },
            include: {
                creator: {
                    select: { displayName: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            requests: jobs.map((j) => ({
                id: j.id,
                title: j.title,
                jobType: j.jobType,
                status: j.status,
                creatorName: j.creator?.displayName,
                budgetAmount: j.budgetAmount,
                deadline: j.deadline?.toISOString(),
                createdAt: j.createdAt.toISOString(),
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ requests: [] });
    }
}

export async function POST(request: NextRequest) {
    const { user, error } = await requireApiRole(['SUPPLIER', 'FACTORY', 'WHOLESALER']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const supplier = await db.supplier.findFirst({
            where: { userId: user!.id },
            select: { id: true, businessName: true, country: true },
        });

        if (!supplier) {
            return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
        }

        const { jobType, title, description, requirements, budgetAmount, deadline } = await request.json();

        if (!jobType || !title || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Local jobs must match country
        const localJobTypes = ['CREATOR_MODEL', 'CREATOR_PHOTOGRAPHER', 'CREATOR_VIDEOGRAPHER'];
        const isLocalJob = localJobTypes.includes(jobType);

        const job = await db.creatorJob.create({
            data: {
                companyId: supplier.id,
                companyName: supplier.businessName || 'Company',
                companyCountry: supplier.country || 'NG',
                jobType,
                title,
                description,
                requirements,
                budgetAmount: budgetAmount || 0,
                deadline: deadline ? new Date(deadline) : null,
                status: 'PENDING', // Waiting for Ops assignment
            },
        });

        return NextResponse.json({ success: true, job });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }
}
