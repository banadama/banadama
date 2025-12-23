// app/api/admin/pricing/route.ts - Pricing & Commission Rules API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// GET /api/admin/pricing - List all pricing rules
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');
    const ruleType = searchParams.get('ruleType');

    const where: Record<string, unknown> = {};

    if (scope) {
        where.scope = scope;
    }

    if (ruleType) {
        where.ruleType = ruleType;
    }

    const rules = await db.pricingRule.findMany({
        where,
        orderBy: [{ scope: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ rules });
}

// POST /api/admin/pricing - Create new pricing rule
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const {
            scope,
            scopeValue,
            ruleType,
            feeType,
            feeValue,
            minOrderValue,
            maxOrderValue,
            priority,
            description,
        } = body;

        if (!scope || !ruleType || !feeType || feeValue === undefined) {
            return NextResponse.json(
                { error: 'Required fields: scope, ruleType, feeType, feeValue' },
                { status: 400 }
            );
        }

        const rule = await db.pricingRule.create({
            data: {
                scope,
                scopeValue,
                ruleType,
                feeType,
                feeValue,
                minOrderValue,
                maxOrderValue,
                priority: priority || 0,
                description,
                createdByAdminId: admin!.id,
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: 'UPDATE_PRICING',
            targetType: 'PRICING',
            targetId: rule.id,
            after: createSnapshot(rule),
            metadata: { action: 'create', ruleType },
        });

        return NextResponse.json({ rule }, { status: 201 });
    } catch (err) {
        console.error('Error creating pricing rule:', err);
        return NextResponse.json(
            { error: 'Failed to create pricing rule' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/pricing - Update pricing rule
export async function PATCH(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { id, isActive, feeValue, priority, description, ...rest } = body;

        if (!id) {
            return NextResponse.json({ error: 'Rule ID required' }, { status: 400 });
        }

        const currentRule = await db.pricingRule.findUnique({
            where: { id },
        });

        if (!currentRule) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        const beforeSnapshot = createSnapshot(currentRule);

        const updatedRule = await db.pricingRule.update({
            where: { id },
            data: {
                ...(isActive !== undefined && { isActive }),
                ...(feeValue !== undefined && { feeValue }),
                ...(priority !== undefined && { priority }),
                ...(description !== undefined && { description }),
                ...rest,
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: 'UPDATE_PRICING',
            targetType: 'PRICING',
            targetId: id,
            before: beforeSnapshot,
            after: createSnapshot(updatedRule),
            metadata: { action: 'update' },
        });

        return NextResponse.json({ rule: updatedRule });
    } catch (err) {
        console.error('Error updating pricing rule:', err);
        return NextResponse.json(
            { error: 'Failed to update pricing rule' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/pricing - Delete pricing rule
export async function DELETE(request: NextRequest) {
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Rule ID required' }, { status: 400 });
        }

        const rule = await db.pricingRule.findUnique({
            where: { id },
        });

        if (!rule) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        await db.pricingRule.delete({
            where: { id },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: 'UPDATE_PRICING',
            targetType: 'PRICING',
            targetId: id,
            before: createSnapshot(rule),
            metadata: { action: 'delete' },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error deleting pricing rule:', err);
        return NextResponse.json(
            { error: 'Failed to delete pricing rule' },
            { status: 500 }
        );
    }
}
