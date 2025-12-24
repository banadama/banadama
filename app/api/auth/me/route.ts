// app/api/auth/me/route.ts - Get Current Session

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getRoleDashboard } from "@/lib/auth";

/**
 * GET /api/auth/me
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                country: user.country,
                dashboard: getRoleDashboard(user.role)
            }
        });
    } catch (error) {
        console.error("Auth me error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
