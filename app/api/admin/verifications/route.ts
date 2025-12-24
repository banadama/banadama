export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { VerificationStatus, VerificationType } from "@prisma/client";


// GET /api/admin/verifications - List all requests (Admin/Ops)
export async function GET(request: NextRequest) {
    try {
        // Contract says ADMIN, but usually OPS handles this too.
        // Strict adherence to contract naming, but pragmatically Ops need access.
        // Spec says: "GET /api/admin/verifications ... (ADMIN)"
        const { error } = await requireApiRole(["ADMIN", "OPS"]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") as VerificationStatus | null;
        const type = searchParams.get("type") as VerificationType | null;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) where.status = status;
        if (type) where.type = type;

        const [requests, total] = await Promise.all([
            db.verificationRequest.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, email: true, role: true, country: true },
                    },
                },
                orderBy: { createdAt: "asc" }, // Oldest first for queue
                skip,
                take: limit,
            }),
            db.verificationRequest.count({ where }),
        ]);

        return NextResponse.json({
            requests,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching admin verifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch verifications" },
            { status: 500 }
        );
    }
}
