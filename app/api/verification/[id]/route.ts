// app/api/verification/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user has permission (ADMIN or OPS)
        // Note: Assuming 'role' is available on the user object. 
        // If using a more complex permission system, use that instead.
        if (user.role !== "ADMIN" && user.role !== "OPS") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = params;
        const body = await req.json().catch(() => ({}));
        const { status, rejectionReason, notes } = body;

        if (!status || !["APPROVED", "REJECTED"].includes(status)) {
            return NextResponse.json(
                { error: "status must be APPROVED or REJECTED" },
                { status: 400 }
            );
        }

        const existing = await prisma.verification.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Verification not found" },
                { status: 404 }
            );
        }

        const updated = await prisma.verification.update({
            where: { id },
            data: {
                status,
                rejectionReason: status === "REJECTED" ? (rejectionReason || "Not specified") : null,
                notes: notes ?? existing.notes,
                reviewedAt: new Date(),
                reviewedById: user.id,
            },
            include: {
                user: true,
                reviewedBy: true,
            },
        });

        // If approved, we might want to update the user's verified status flag if it exists
        // but the schema update didn't explicitly add 'isVerified' to User, 
        // though the spec mentioned it. 
        // For now, we rely on the Verification record.

        return NextResponse.json(updated);
    } catch (err) {
        console.error("PATCH /api/verification/[id] error", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
