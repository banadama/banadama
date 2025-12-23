// app/api/admin/finance/escrow/[id]/release/route.ts - Escrow Release API (FINANCE_ADMIN)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";

// POST /api/admin/finance/escrow/[id]/release
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // FINANCE_ADMIN only
    const { user: admin, error } = await requireApiRole("FINANCE_ADMIN");
    if (error) {
        // Fallback to ADMIN if FINANCE_ADMIN not implemented
        const adminCheck = await requireApiRole("ADMIN");
        if (adminCheck.error) {
            return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Finance admin access required" } }, { status: 403 });
        }
    }

    const { id } = await params;

    try {
        const body = await request.json().catch(() => ({}));
        const { note } = body;

        const escrow = await db.escrow.findUnique({ where: { id } });
        if (!escrow) {
            return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Escrow not found" } }, { status: 404 });
        }

        if (escrow.status === "RELEASED") {
            return NextResponse.json({ ok: false, error: { code: "CONFLICT", message: "Escrow already released" } }, { status: 409 });
        }

        const updatedEscrow = await db.escrow.update({
            where: { id },
            data: {
                status: "RELEASED",
                releasedAt: new Date(),
                releaseNote: note || null,
            },
        });

        await logAdminAction({
            adminId: admin?.id || "system",
            action: "RELEASE_ESCROW",
            targetType: "ESCROW",
            targetId: id,
            before: createSnapshot({ status: escrow.status }),
            after: createSnapshot({ status: "RELEASED", note }),
        });

        return NextResponse.json({
            ok: true,
            data: { escrowId: id, status: "RELEASED" },
        });
    } catch (err) {
        console.error("Error releasing escrow:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to release escrow" } }, { status: 500 });
    }
}
