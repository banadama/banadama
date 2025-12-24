// app/api/creator/setup/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreatorType } from "@/types/creator";


export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (user.role !== "CREATOR") {
            return NextResponse.json(
                { error: "Only creators can setup creator profiles" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { creatorType } = body;

        // Validate creator type
        if (!creatorType || !Object.values(CreatorType).includes(creatorType)) {
            return NextResponse.json(
                { error: "Invalid creator type" },
                { status: 400 }
            );
        }

        // Check if profile already exists
        const existingProfile = await db.creatorProfile.findUnique({
            where: { userId: user.id },
        });

        if (existingProfile) {
            // Update existing profile
            const updatedProfile = await db.creatorProfile.update({
                where: { userId: user.id },
                data: {
                    creatorType: creatorType as CreatorType,
                },
            });

            return NextResponse.json({
                success: true,
                profile: updatedProfile,
                message: "Creator profile updated successfully",
            });
        }

        // Create new profile
        const profile = await db.creatorProfile.create({
            data: {
                userId: user.id,
                creatorType: creatorType as CreatorType,
            },
        });

        return NextResponse.json({
            success: true,
            profile,
            message: "Creator profile created successfully",
        });
    } catch (error) {
        console.error("Error setting up creator profile:", error);
        return NextResponse.json(
            { error: "Failed to setup creator profile" },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch creator profile
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const profile = await db.creatorProfile.findUnique({
            where: { userId: user.id },
            include: {
                products: true,
            },
        });

        if (!profile) {
            return NextResponse.json(
                { exists: false, profile: null },
                { status: 200 }
            );
        }

        return NextResponse.json({
            exists: true,
            profile,
        });
    } catch (error) {
        console.error("Error fetching creator profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch creator profile" },
            { status: 500 }
        );
    }
}
