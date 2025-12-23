// app/api/admin/categories/[id]/route.ts - Single Category Admin API
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";

// GET /api/admin/categories/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    const { id } = await params;

    const category = await db.category.findUnique({ where: { id } });
    if (!category) {
        return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Category not found" } }, { status: 404 });
    }

    return NextResponse.json({
        ok: true,
        data: { category },
    });
}

// PATCH /api/admin/categories/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user: admin, error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    const { id } = await params;

    try {
        const existing = await db.category.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Category not found" } }, { status: 404 });
        }

        const body = await request.json();
        const { name, slug, enabled } = body;

        const category = await db.category.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(slug !== undefined && { slug }),
                ...(enabled !== undefined && { enabled }),
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "UPDATE_CATEGORY",
            targetType: "CATEGORY",
            targetId: id,
            before: createSnapshot(existing),
            after: createSnapshot(category),
        });

        return NextResponse.json({
            ok: true,
            data: { category },
        });
    } catch (err) {
        console.error("Error updating category:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to update category" } }, { status: 500 });
    }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user: admin, error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    const { id } = await params;

    try {
        const existing = await db.category.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Category not found" } }, { status: 404 });
        }

        // Soft delete - just disable
        await db.category.update({
            where: { id },
            data: { enabled: false },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "DELETE_CATEGORY",
            targetType: "CATEGORY",
            targetId: id,
            before: createSnapshot(existing),
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Error deleting category:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to delete category" } }, { status: 500 });
    }
}
