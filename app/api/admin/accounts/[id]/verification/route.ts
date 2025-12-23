// app/api/admin/accounts/[id]/verification/route.ts - Account Verification Tick API
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";

// PATCH /api/admin/accounts/[id]/verification
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
        const { tick } = body;

        const validTicks = ["NONE", "BLUE_TICK", "GREEN_TICK"];
        if (!tick || !validTicks.includes(tick)) {
            return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Valid tick is required (NONE, BLUE_TICK, GREEN_TICK)" } }, { status: 400 });
        }

        const existingAccount = await db.account.findUnique({ where: { id } });
        if (!existingAccount) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Account not found" } }, { status: 404 });
        }

        const updatedAccount = await db.account.update({
            where: { id },
            data: {
                verificationLevel: tick,
                verifiedAt: tick !== "NONE" ? new Date() : null,
                verifiedByAdminId: tick !== "NONE" ? admin!.id : null,
            },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "CHANGE_VERIFICATION_TICK",
            targetType: "ACCOUNT",
            targetId: id,
            before: createSnapshot({ verificationLevel: existingAccount.verificationLevel }),
            after: createSnapshot({ verificationLevel: updatedAccount.verificationLevel }),
        });

        return NextResponse.json({
            ok: true,
            data: { accountId: id, tick: updatedAccount.verificationLevel },
        });
    } catch (err) {
        console.error("Error updating verification tick:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to update verification" } }, { status: 500 });
    }
}
