// app/api/creator/products/route.ts - Creator Products

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
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
            return NextResponse.json({ products: [] });
        }

        const where: Record<string, unknown> = { creatorId: creator.id };
        if (status) {
            where.status = status;
        }

        const products = await db.creatorProduct.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            products: products.map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                category: p.category,
                price: p.price,
                status: p.status,
                totalSales: p.totalSales,
                totalRevenue: p.totalRevenue,
                previewUrls: p.previewUrls,
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ products: [] });
    }
}

export async function POST(request: NextRequest) {
    const { user, error } = await requireApiRole('CREATOR');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const creator = await db.creatorProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!creator) {
            return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 });
        }

        const { name, description, category, price, tags, status, previewUrls, fileUrls } = await request.json();

        if (!name || !description || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await db.creatorProduct.create({
            data: {
                creatorId: creator.id,
                name,
                description,
                category: category || 'graphic',
                price,
                tags: tags || [],
                status: status || 'DRAFT',
                previewUrls: previewUrls || [],
                fileUrls: fileUrls || [],
            },
        });

        return NextResponse.json({ success: true, product });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
