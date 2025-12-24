// app/api/auth/login/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession, getRoleDashboard } from "@/lib/auth";
import bcrypt from "bcryptjs";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json(
                { error: "Account is deactivated. Please contact support." },
                { status: 403 }
            );
        }

        // Verify password
        if (!user.passwordHash) {
            return NextResponse.json(
                { error: "Login method not supported for this account" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Set JWT session
        await setSession({
            id: user.id,
            email: user.email,
            role: user.role,
            country: user.country,
        });

        // Get role-based dashboard URL
        const dashboardUrl = getRoleDashboard(user.role);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                country: user.country,
            },
            dashboardUrl,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Login failed. Please try again." },
            { status: 500 }
        );
    }
}
