// app/api/mobile/supplier/stats/route.ts - Supplier Mobile Stats
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole('SUPPLIER');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        // Get supplier profile
        const supplier = await db.supplier.findFirst({
            where: { userId: user!.id },
        });

        if (!supplier) {
            return NextResponse.json({
                pendingOrders: 0,
                inProductionOrders: 0,
                readyToShip: 0,
                walletBalance: 0,
                unreadMessages: 0,
            });
        }

        const [pendingOrders, inProductionOrders, readyToShip, wallet] = await Promise.all([
            db.order.count({ where: { supplierId: supplier.id, status: 'PENDING' } }),
            db.order.count({ where: { supplierId: supplier.id, status: 'IN_PRODUCTION' } }),
            db.order.count({ where: { supplierId: supplier.id, status: 'READY' } }),
            db.wallet.findUnique({ where: { userId: user!.id } }),
        ]);

        return NextResponse.json({
            pendingOrders,
            inProductionOrders,
            readyToShip,
            walletBalance: wallet?.balance || 0,
            unreadMessages: 0,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({
            pendingOrders: 0,
            inProductionOrders: 0,
            readyToShip: 0,
            walletBalance: 0,
            unreadMessages: 0,
        });
    }
}
