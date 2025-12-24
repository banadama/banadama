// app/api/admin/users/[id]/status/route.ts - User Status Update API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";


// PATCH /api/admin/users/[id]/status
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
        const body = await request.json();
        const { status } = body;

        const validStatuses = ["ACTIVE", "SUSPENDED", "BANNED"];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Valid status is required (ACTIVE, SUSPENDED, BANNED)" } }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({ where: { id } });
        if (!existingUser) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "User not found" } }, { status: 404 });
        }

        const updatedUser = await db.user.update({
            where: { id },
            data: {
                status,
                isActive: status === "ACTIVE",
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "CHANGE_USER_STATUS",
            targetType: "USER",
            targetId: id,
            targetUserId: id,
            before: createSnapshot({ status: existingUser.status }),
            after: createSnapshot({ status: updatedUser.status }),
        });

        return NextResponse.json({
            ok: true,
            data: { userId: id, status: updatedUser.status },
        });
    } catch (err) {
        console.error("Error updating user status:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to update status" } }, { status: 500 });
    }
}
