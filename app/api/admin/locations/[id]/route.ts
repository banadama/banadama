// app/api/admin/locations/[id]/route.ts - Single Location Admin API
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";

// GET /api/admin/locations/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    const { id } = await params;

    const location = await db.location.findUnique({ where: { id } });
    if (!location) {
        return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Location not found" } }, { status: 404 });
    }

    return NextResponse.json({
        ok: true,
        data: { location },
    });
}

// PATCH /api/admin/locations/[id]
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
        const existing = await db.location.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Location not found" } }, { status: 404 });
        }

        const body = await request.json();
        const { country, state, city, enabled } = body;

        const location = await db.location.update({
            where: { id },
            data: {
                ...(country !== undefined && { country }),
                ...(state !== undefined && { state }),
                ...(city !== undefined && { city }),
                ...(enabled !== undefined && { enabled }),
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "UPDATE_LOCATION",
            targetType: "LOCATION",
            targetId: id,
            before: createSnapshot(existing),
            after: createSnapshot(location),
        });

        return NextResponse.json({
            ok: true,
            data: { location },
        });
    } catch (err) {
        console.error("Error updating location:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to update location" } }, { status: 500 });
    }
}

// DELETE /api/admin/locations/[id]
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
        const existing = await db.location.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Location not found" } }, { status: 404 });
        }

        // Soft delete - just disable
        await db.location.update({
            where: { id },
            data: { enabled: false },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "DELETE_LOCATION",
            targetType: "LOCATION",
            targetId: id,
            before: createSnapshot(existing),
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Error deleting location:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to delete location" } }, { status: 500 });
    }
}
