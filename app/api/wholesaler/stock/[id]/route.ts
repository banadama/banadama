// app/api/wholesaler/stock/[id]/route.ts - Update Stock

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';


export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user, error } = await requireApiRole(['SUPPLIER', 'WHOLESALER']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        // Get wholesaler profile
        const supplier = await db.supplier.findFirst({
            where: { userId: user!.id },
        });

        if (!supplier) {
            return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
        }

        const wholesaler = await db.wholesalerProfile.findUnique({
            where: { supplierId: supplier.id },
        });

        if (!wholesaler) {
            return NextResponse.json({ error: 'Wholesaler not found' }, { status: 404 });
        }

        // Verify stock belongs to this wholesaler
        const stock = await db.wholesalerStock.findFirst({
            where: { id, wholesalerId: wholesaler.id },
        });

        if (!stock) {
            return NextResponse.json({ error: 'Stock item not found' }, { status: 404 });
        }

        const { quantityAvailable, status, pricePerUnit, minOrderQuantity, deliverySpeed } = await request.json();

        const updateData: Record<string, unknown> = {
            lastStockUpdate: new Date(),
        };

        if (quantityAvailable !== undefined) {
            updateData.quantityAvailable = quantityAvailable;

            // Auto-update status based on quantity
            if (quantityAvailable === 0) {
                updateData.status = 'OUT_OF_STOCK';
            } else if (quantityAvailable < 10) {
                updateData.status = 'LOW_STOCK';
            } else if (status === 'OUT_OF_STOCK' || status === 'LOW_STOCK') {
                updateData.status = 'IN_STOCK';
            }
        }

        if (status) {
            updateData.status = status;
        }
        if (pricePerUnit !== undefined) {
            updateData.pricePerUnit = pricePerUnit;
        }
        if (minOrderQuantity !== undefined) {
            updateData.minOrderQuantity = minOrderQuantity;
        }
        if (deliverySpeed) {
            updateData.deliverySpeed = deliverySpeed;
        }

        const updated = await db.wholesalerStock.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, stock: updated });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    }
}
