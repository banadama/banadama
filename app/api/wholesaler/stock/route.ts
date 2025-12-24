// app/api/wholesaler/stock/route.ts - Wholesaler Stock List

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole(['SUPPLIER', 'WHOLESALER']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    try {
        // Get wholesaler profile
        const supplier = await db.supplier.findFirst({
            where: { userId: user!.id },
        });

        if (!supplier) {
            return NextResponse.json({ items: [] });
        }

        const wholesaler = await db.wholesalerProfile.findUnique({
            where: { supplierId: supplier.id },
        });

        if (!wholesaler) {
            return NextResponse.json({ items: [] });
        }

        const where: Record<string, unknown> = { wholesalerId: wholesaler.id };
        if (status) {
            where.status = status;
        }

        const stockItems = await db.wholesalerStock.findMany({
            where,
            include: {
                product: {
                    select: { name: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json({
            items: stockItems.map((s) => ({
                id: s.id,
                productId: s.productId,
                productName: s.product?.name || 'Unknown',
                status: s.status,
                quantityAvailable: s.quantityAvailable,
                minOrderQuantity: s.minOrderQuantity,
                pricePerUnit: s.pricePerUnit,
                deliverySpeed: s.deliverySpeed,
                lastStockUpdate: s.lastStockUpdate?.toISOString(),
                isActive: s.isActive,
            })),
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ items: [] });
    }
}
