// app/api/growth/onboard-supplier/route.ts - Onboard Supplier

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';


export async function POST(request: NextRequest) {
    const { user, error } = await requireApiRole('GROWTH_AGENT');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        // Get agent profile
        const agent = await db.growthAgentProfile.findUnique({
            where: { userId: user!.id },
        });

        if (!agent) {
            return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
        }

        if (agent.status !== 'ACTIVE') {
            return NextResponse.json({
                error: 'Your account is not active. Cannot onboard suppliers.'
            }, { status: 403 });
        }

        const data = await request.json();

        // Get settings to check anti-fraud rules
        const settings = await db.growthSettings.findFirst();

        // Block self-onboard
        if (settings?.blockSelfOnboard) {
            // Check if email matches
            if (data.email && data.email.toLowerCase() === user!.email?.toLowerCase()) {
                return NextResponse.json({
                    error: 'You cannot onboard yourself as a supplier.'
                }, { status: 403 });
            }
        }

        // Create user + supplier in transaction
        const result = await db.$transaction(async (tx) => {
            // Generate temp password
            const tempPassword = Math.random().toString(36).slice(-8);

            // Create user
            const newUser = await tx.user.create({
                data: {
                    email: data.email || `${data.phone}@banadama.temp`,
                    name: data.ownerName,
                    phone: data.phone,
                    role: 'SUPPLIER',
                    status: 'ACTIVE',
                },
            });

            // Create supplier profile
            const supplier = await tx.supplier.create({
                data: {
                    userId: newUser.id,
                    businessName: data.businessName,
                    businessAddress: data.businessAddress,
                    country: data.country || 'NG',
                    category: data.category,
                    status: 'ACTIVE',
                },
            });

            // Create growth supplier record
            const growthSupplier = await tx.growthSupplier.create({
                data: {
                    supplierId: supplier.id,
                    agentId: agent.id,
                    onboardingNotes: data.notes,
                },
            });

            // Update agent stats
            await tx.growthAgentProfile.update({
                where: { id: agent.id },
                data: {
                    totalSuppliersOnboarded: { increment: 1 },
                },
            });

            // Create pending earning
            const earning = await tx.growthEarning.create({
                data: {
                    agentId: agent.id,
                    type: 'SUPPLIER_ONBOARD',
                    amount: settings?.supplierOnboardCommission || 50000,
                    status: 'PENDING',
                    refType: 'SUPPLIER',
                    refId: supplier.id,
                    description: `Onboarded: ${data.businessName}`,
                    unlockRequirement: `${settings?.ordersRequiredToUnlock || 1}_COMPLETED_ORDERS`,
                    unlockProgress: 0,
                    unlockTarget: settings?.ordersRequiredToUnlock || 1,
                },
            });

            // Update agent pending earnings
            await tx.growthAgentProfile.update({
                where: { id: agent.id },
                data: {
                    pendingEarnings: { increment: settings?.supplierOnboardCommission || 50000 },
                    totalEarnings: { increment: settings?.supplierOnboardCommission || 50000 },
                },
            });

            return { supplier, growthSupplier, earning, tempPassword };
        });

        await logAdminAction({
            adminId: user!.id,
            action: 'GROWTH_SUPPLIER_ONBOARD',
            targetType: 'SUPPLIER',
            targetId: result.supplier.id,
            after: createSnapshot(result.supplier),
            metadata: { agentId: agent.id },
        });

        return NextResponse.json({
            success: true,
            supplier: result.supplier,
            message: 'Supplier onboarded. Pending commission will unlock after completed orders.',
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to onboard supplier' }, { status: 500 });
    }
}
