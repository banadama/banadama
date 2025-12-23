// lib/growth-commission.ts - Growth Commission Logic
import { db } from './db';

/**
 * GROWTH COMMISSION SYSTEM
 * 
 * CORE RULES:
 * 1. Commission ONLY after real activity (completed orders)
 * 2. No MLM / no referral chains
 * 3. Earnings start as PENDING, unlock after activity threshold
 * 4. Finance must approve all payouts
 */

interface CommissionUnlockResult {
    unlocked: boolean;
    earningId: string;
    amount: number;
    agentId: string;
}

/**
 * Called when a supplier completes an order.
 * Checks if any pending earnings should be unlocked.
 */
export async function processSupplierOrderCompletion(
    supplierId: string,
    orderId: string,
    orderAmount: number
): Promise<CommissionUnlockResult[]> {
    const results: CommissionUnlockResult[] = [];

    try {
        // Get settings
        const settings = await db.growthSettings.findFirst();
        const ordersRequired = settings?.ordersRequiredToUnlock || 1;
        const orderCommissionRate = settings?.orderCommissionRate || 0.005;

        // Find growth supplier record
        const growthSupplier = await db.growthSupplier.findUnique({
            where: { supplierId },
        });

        if (!growthSupplier) {
            // Supplier was not onboarded by a growth agent
            return results;
        }

        // Update completed orders count
        const updatedGrowthSupplier = await db.growthSupplier.update({
            where: { supplierId },
            data: {
                completedOrders: { increment: 1 },
                firstCompletedOrderAt: growthSupplier.firstCompletedOrderAt || new Date(),
            },
        });

        // Award order commission
        if (orderCommissionRate > 0) {
            const commission = Math.floor(orderAmount * orderCommissionRate);

            if (commission > 0) {
                const earning = await db.growthEarning.create({
                    data: {
                        agentId: growthSupplier.agentId,
                        type: 'ORDER_COMMISSION',
                        amount: commission,
                        status: 'UNLOCKED', // Order commission is immediately unlocked
                        refType: 'ORDER',
                        refId: orderId,
                        description: `Order commission (${(orderCommissionRate * 100).toFixed(1)}%)`,
                    },
                });

                // Update agent stats
                await db.growthAgentProfile.update({
                    where: { id: growthSupplier.agentId },
                    data: {
                        totalOrdersGenerated: { increment: 1 },
                        totalEarnings: { increment: commission },
                    },
                });

                results.push({
                    unlocked: true,
                    earningId: earning.id,
                    amount: commission,
                    agentId: growthSupplier.agentId,
                });
            }
        }

        // Check if this is first completed order (bonus)
        if (!growthSupplier.firstCompletedOrderAt && settings?.firstOrderCommission) {
            const earning = await db.growthEarning.create({
                data: {
                    agentId: growthSupplier.agentId,
                    type: 'SUPPLIER_FIRST_ORDER',
                    amount: settings.firstOrderCommission,
                    status: 'UNLOCKED',
                    refType: 'SUPPLIER',
                    refId: supplierId,
                    description: `First order bonus for supplier`,
                },
            });

            await db.growthAgentProfile.update({
                where: { id: growthSupplier.agentId },
                data: {
                    activeSuppliersCount: { increment: 1 },
                    totalEarnings: { increment: settings.firstOrderCommission },
                },
            });

            results.push({
                unlocked: true,
                earningId: earning.id,
                amount: settings.firstOrderCommission,
                agentId: growthSupplier.agentId,
            });
        }

        // Check pending onboard commission
        if (updatedGrowthSupplier.completedOrders >= ordersRequired) {
            // Find pending SUPPLIER_ONBOARD earning for this supplier
            const pendingEarning = await db.growthEarning.findFirst({
                where: {
                    agentId: growthSupplier.agentId,
                    type: 'SUPPLIER_ONBOARD',
                    refType: 'SUPPLIER',
                    refId: supplierId,
                    status: 'PENDING',
                },
            });

            if (pendingEarning) {
                await db.growthEarning.update({
                    where: { id: pendingEarning.id },
                    data: {
                        status: 'UNLOCKED',
                        unlockedAt: new Date(),
                        unlockProgress: updatedGrowthSupplier.completedOrders,
                    },
                });

                // Move from pending to unlocked in agent stats
                await db.growthAgentProfile.update({
                    where: { id: growthSupplier.agentId },
                    data: {
                        pendingEarnings: { decrement: pendingEarning.amount },
                    },
                });

                results.push({
                    unlocked: true,
                    earningId: pendingEarning.id,
                    amount: pendingEarning.amount,
                    agentId: growthSupplier.agentId,
                });
            }
        } else {
            // Update progress on pending earning
            await db.growthEarning.updateMany({
                where: {
                    agentId: growthSupplier.agentId,
                    type: 'SUPPLIER_ONBOARD',
                    refId: supplierId,
                    status: 'PENDING',
                },
                data: {
                    unlockProgress: updatedGrowthSupplier.completedOrders,
                },
            });
        }

        return results;
    } catch (err) {
        console.error('Error processing growth commission:', err);
        return results;
    }
}

/**
 * Reverse earnings (for admin use on fraud detection)
 */
export async function reverseEarning(
    earningId: string,
    adminId: string,
    reason: string
): Promise<boolean> {
    try {
        const earning = await db.growthEarning.findUnique({
            where: { id: earningId },
        });

        if (!earning) return false;
        if (earning.status === 'PAID') {
            throw new Error('Cannot reverse paid earnings');
        }
        if (earning.status === 'REVERSED') {
            return true; // Already reversed
        }

        await db.growthEarning.update({
            where: { id: earningId },
            data: {
                status: 'REVERSED',
                reversedAt: new Date(),
                reversedByAdminId: adminId,
                reversalReason: reason,
            },
        });

        // Update agent totals
        const deductFrom = earning.status === 'PENDING' ? 'pendingEarnings' : 'totalEarnings';
        await db.growthAgentProfile.update({
            where: { id: earning.agentId },
            data: {
                totalEarnings: { decrement: earning.amount },
                [deductFrom]: { decrement: earning.amount },
            },
        });

        return true;
    } catch (err) {
        console.error('Error reversing earning:', err);
        return false;
    }
}
