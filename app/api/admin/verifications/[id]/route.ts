export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { VerificationStatus } from "@prisma/client";


// PATCH /api/admin/verifications/[id] - Approve/Reject
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { user: admin, error } = await requireApiRole(["ADMIN"]); // Strict ADMIN as per spec

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const { id } = params;
        const body = await request.json();
        const { status, notes } = body;

        // Validate status
        if (!["APPROVED", "REJECTED"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status. Must be APPROVED or REJECTED" },
                { status: 400 }
            );
        }

        const verificationRequest = await db.verificationRequest.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!verificationRequest) {
            return NextResponse.json(
                { error: "Verification request not found" },
                { status: 404 }
            );
        }

        if (verificationRequest.status !== "PENDING") {
            return NextResponse.json(
                { error: "Request is already processed" },
                { status: 400 }
            );
        }

        // Update in transaction
        const updated = await db.$transaction(async (tx) => {
            // 1. Update request
            const req = await tx.verificationRequest.update({
                where: { id },
                data: {
                    status: status as VerificationStatus,
                    reviewedAt: new Date(),
                    reviewedBy: admin!.id,
                    rejectionReason: status === "REJECTED" ? notes : null,
                },
            });

            // 2. If approved, update user/profile flags
            if (status === "APPROVED") {
                // Log action
                await tx.adminAuditLog.create({
                    data: {
                        adminId: admin!.id,
                        action: "VERIFY_USER",
                        targetUserId: verificationRequest.userId,
                        details: { verificationId: id, type: verificationRequest.type },
                    },
                });

                // Add verified badge logic here if needed
                // For example, update SupplierProfile.isVerified
                if (verificationRequest.type === "SUPPLIER") {
                    await tx.supplierProfile.update({
                        where: { userId: verificationRequest.userId },
                        data: { isVerified: true }
                    }).catch(() => null); // Ignore if profile missing
                }
            }

            return req;
        });

        return NextResponse.json({
            success: true,
            verification: updated,
        });
    } catch (error) {
        console.error("Error updates verification:", error);
        return NextResponse.json(
            { error: "Failed to update verification" },
            { status: 500 }
        );
    }
}
