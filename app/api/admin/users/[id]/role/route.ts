// app/api/admin/users/[id]/role/route.ts - User Role Update API
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";

// PATCH /api/admin/users/[id]/role
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
        const { role } = body;

        if (!role) {
            return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Role is required" } }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({ where: { id } });
        if (!existingUser) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "User not found" } }, { status: 404 });
        }

        const updatedUser = await db.user.update({
            where: { id },
            data: { role },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "CHANGE_USER_ROLE",
            targetType: "USER",
            targetId: id,
            targetUserId: id,
            before: createSnapshot({ role: existingUser.role }),
            after: createSnapshot({ role: updatedUser.role }),
        });

        return NextResponse.json({
            ok: true,
            data: { userId: id, role: updatedUser.role },
        });
    } catch (err) {
        console.error("Error updating user role:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to update role" } }, { status: 500 });
    }
}
