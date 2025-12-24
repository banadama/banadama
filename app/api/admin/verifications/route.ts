export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";

// Local type definitions to avoid @prisma/client import during build
type VerificationStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
type VerificationType = "USER_KYC" | "SUPPLIER" | "CREATOR";

// GET /api/admin/verifications - List all requests (Admin/Ops)
export async function GET(request: NextRequest) {
    try {
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
                orderBy: { createdAt: "asc" },
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
