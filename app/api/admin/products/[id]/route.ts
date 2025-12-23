// app/api/admin/products/[id]/route.ts - Single Product Control API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireApiRole } from '@/lib/auth';
import { logAdminAction, createSnapshot } from '@/lib/audit';

// GET /api/admin/products/[id] - Get product details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const product = await db.product.findUnique({
        where: { id },
        include: {
            supplier: {
                select: {
                    id: true,
                    businessName: true,
                    user: {
                        select: { id: true, email: true },
                    },
                },
            },
            creator: {
                select: {
                    id: true,
                    displayName: true,
                    user: {
                        select: { id: true, email: true },
                    },
                },
            },
        },
    });

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
}

// PATCH /api/admin/products/[id] - Update product admin controls
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user: admin, error } = await requireApiRole('ADMIN');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    try {
        const body = await request.json();
        const {
            action, // 'approve', 'reject', 'hide', 'unhide', 'flag', 'unflag', 'require_changes'
            reason,
        } = body;

        const currentProduct = await db.product.findUnique({
            where: { id },
        });

        if (!currentProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const beforeSnapshot = createSnapshot(currentProduct);

        let updateData: Record<string, unknown> = {};

        switch (action) {
            case 'approve':
                updateData = {
                    approvalStatus: 'APPROVED',
                    approvedAt: new Date(),
                    approvedByAdminId: admin!.id,
                    rejectionReason: null,
                    lastApprovedPrice: currentProduct.unitPrice,
                };
                break;

            case 'reject':
                updateData = {
                    approvalStatus: 'REJECTED',
                    rejectionReason: reason || 'Product rejected by admin',
                    isActive: false,
                };
                break;

            case 'require_changes':
                updateData = {
                    approvalStatus: 'CHANGES_REQUIRED',
                    rejectionReason: reason || 'Changes required before approval',
                };
                break;

            case 'hide':
                updateData = {
                    isHiddenByAdmin: true,
                    hiddenReason: reason || 'Hidden by admin',
                    hiddenAt: new Date(),
                    hiddenByAdminId: admin!.id,
                };
                break;

            case 'unhide':
                updateData = {
                    isHiddenByAdmin: false,
                    hiddenReason: null,
                    hiddenAt: null,
                    hiddenByAdminId: null,
                };
                break;

            case 'flag':
                updateData = {
                    isFlagged: true,
                    flagReason: reason || 'Flagged for review',
                    flaggedAt: new Date(),
                    flaggedByAdminId: admin!.id,
                };
                break;

            case 'unflag':
                updateData = {
                    isFlagged: false,
                    flagReason: null,
                    flaggedAt: null,
                    flaggedByAdminId: null,
                };
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        const updatedProduct = await db.product.update({
            where: { id },
            data: updateData,
        });

        // Log admin action
        await logAdminAction({
            adminId: admin!.id,
            action: action.toUpperCase(),
            targetType: 'PRODUCT',
            targetId: id,
            before: beforeSnapshot,
            after: createSnapshot(updatedProduct),
            metadata: { action, reason },
        });

        return NextResponse.json({
            success: true,
            product: updatedProduct,
            message: `Product ${action} successful`,
        });
    } catch (err) {
        console.error('Error updating product:', err);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}
