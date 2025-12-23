// app/api/admin/accounts/[id]/type/route.ts - Account Type Update API
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";

// PATCH /api/admin/accounts/[id]/type
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
        const { type } = body;

        const validTypes = ["BUYER", "FACTORY", "WHOLESALER", "RETAIL", "CREATOR"];
        if (!type || !validTypes.includes(type)) {
            return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Valid type is required" } }, { status: 400 });
        }

        const existingAccount = await db.account.findUnique({ where: { id } });
        if (!existingAccount) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Account not found" } }, { status: 404 });
        }

        const updatedAccount = await db.account.update({
            where: { id },
            data: { type },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "CHANGE_ACCOUNT_TYPE",
            targetType: "ACCOUNT",
            targetId: id,
            before: createSnapshot({ type: existingAccount.type }),
            after: createSnapshot({ type: updatedAccount.type }),
        });

        return NextResponse.json({
            ok: true,
            data: { accountId: id, type: updatedAccount.type },
        });
    } catch (err) {
        console.error("Error updating account type:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to update type" } }, { status: 500 });
    }
}
