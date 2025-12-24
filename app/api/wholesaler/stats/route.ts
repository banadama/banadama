// app/api/wholesaler/stats/route.ts - Wholesaler Stats

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

    try {
        // Get supplier profile
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
            return NextResponse.json({ error: 'Wholesaler profile not found' }, { status: 404 });
        }

        // Get order stats
        const [pendingOrders, processingOrders, completedOrders, wallet] = await Promise.all([
            db.order.count({ where: { supplierId: supplier.id, status: 'PENDING' } }),
            db.order.count({ where: { supplierId: supplier.id, status: { in: ['CONFIRMED', 'PROCESSING'] } } }),
            db.order.count({ where: { supplierId: supplier.id, status: 'DELIVERED' } }),
            db.wallet.findUnique({ where: { userId: user!.id } }),
        ]);

        // Get stock stats
        const stockStats = await db.wholesalerStock.groupBy({
            by: ['status'],
            where: { wholesalerId: wholesaler.id },
            _count: true,
        });

        const stockMap = new Map(stockStats.map(s => [s.status, s._count]));

        return NextResponse.json({
            pendingOrders,
            processingOrders,
            completedOrders,
            walletBalance: wallet?.balance || 0,
            hasBlueTick: wholesaler.hasBlueTick,
            hasGreenTick: wholesaler.hasGreenTick,
            verificationStatus: wholesaler.verificationStatus,
            fulfillmentRate: wholesaler.fulfillmentRate,
            avgDeliveryDays: wholesaler.avgDeliveryDays,
            productsInStock: (stockMap.get('IN_STOCK') || 0) + (stockMap.get('LOW_STOCK') || 0),
            lowStockProducts: stockMap.get('LOW_STOCK') || 0,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({
            pendingOrders: 0,
            processingOrders: 0,
            completedOrders: 0,
            walletBalance: 0,
            hasBlueTick: false,
            hasGreenTick: false,
            verificationStatus: 'PENDING',
        });
    }
}
