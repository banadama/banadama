export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";

// Local type definitions to avoid @prisma/client import during build
type VerificationStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
type VerificationType = "USER_KYC" | "SUPPLIER" | "CREATOR";

const VALID_VERIFICATION_TYPES: VerificationType[] = ["USER_KYC", "SUPPLIER", "CREATOR"];

// GET /api/verification - List user's verification requests
export async function GET(request: NextRequest) {
    try {
        const { user, error } = await requireApiRole([
            "BUYER",
            "SUPPLIER",
            "CREATOR",
            "AFFILIATE",
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const requests = await db.verificationRequest.findMany({
            where: { userId: user!.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("Error fetching verification requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch verification requests" },
            { status: 500 }
        );
    }
}

// POST /api/verification - Create a new verification request
export async function POST(request: NextRequest) {
    try {
        const { user, error } = await requireApiRole([
            "BUYER",
            "SUPPLIER",
            "CREATOR",
            "AFFILIATE",
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const body = await request.json();
        const { type, documents, businessName, registrationNumber } = body;

        // Validate type
        if (!VALID_VERIFICATION_TYPES.includes(type)) {
            return NextResponse.json(
                { error: "Invalid verification type" },
                { status: 400 }
            );
        }

        if (!documents || !Array.isArray(documents) || documents.length === 0) {
            return NextResponse.json(
                { error: "At least one document is required" },
                { status: 400 }
            );
        }

        // Check for existing pending request of same type
        const existing = await db.verificationRequest.findFirst({
            where: {
                userId: user!.id,
                type: type,
                status: "PENDING",
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "You already have a pending verification request of this type" },
                { status: 409 }
            );
        }

        // Create request
        const verification = await db.verificationRequest.create({
            data: {
                userId: user!.id,
                type: type,
                status: "PENDING",
                documents: documents, // Array of URLs
                data: {
                    businessName,
                    registrationNumber,
                },
            },
        });

        return NextResponse.json({
            success: true,
            verification,
        });
    } catch (error) {
        console.error("Error creating verification request:", error);
        return NextResponse.json(
            { error: "Failed to create verification request" },
            { status: 500 }
        );
    }
}
