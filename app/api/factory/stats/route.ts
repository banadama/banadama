// app/api/factory/stats/route.ts - Factory Stats
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, error } = await requireApiRole(['SUPPLIER', 'FACTORY']);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        // Get factory profile
        const supplier = await db.supplier.findFirst({
            where: { userId: user!.id },
        });

        if (!supplier) {
            return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
        }

        const factory = await db.factoryProfile.findUnique({
            where: { supplierId: supplier.id },
        });

        if (!factory) {
            return NextResponse.json({ error: 'Factory profile not found' }, { status: 404 });
        }

        // Get production stats
        const [pendingRfqs, inProduction, readyToShip, wallet] = await Promise.all([
            db.rfq.count({
                where: {
                    assignedSupplierId: supplier.id,
                    status: 'PENDING',
                },
            }),
            db.factoryProduction.count({
                where: { factoryId: factory.id, status: 'IN_PRODUCTION' },
            }),
            db.factoryProduction.count({
                where: { factoryId: factory.id, status: 'READY_TO_SHIP' },
            }),
            db.wallet.findUnique({ where: { userId: user!.id } }),
        ]);

        // Get active orders count
        const activeOrders = await db.factoryProduction.count({
            where: {
                factoryId: factory.id,
                status: { notIn: ['SHIPPED'] },
            },
        });

        // Calculate current utilization
        const currentMonthProductions = await db.factoryProduction.aggregate({
            _sum: { orderedQuantity: true },
            where: {
                factoryId: factory.id,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });

        return NextResponse.json({
            pendingRfqs,
            activeOrders,
            inProduction,
            readyToShip,
            walletBalance: wallet?.balance || 0,
            hasGreenTick: factory.hasGreenTick,
            verificationStatus: factory.verificationStatus,
            monthlyCapacity: factory.monthlyCapacityUnits || 0,
            currentUtilization: currentMonthProductions._sum.orderedQuantity || 0,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({
            pendingRfqs: 0,
            activeOrders: 0,
            inProduction: 0,
            readyToShip: 0,
            walletBalance: 0,
            hasGreenTick: false,
            verificationStatus: 'PENDING',
        });
    }
}
