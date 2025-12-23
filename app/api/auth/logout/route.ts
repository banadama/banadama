// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST() {
    try {
        // Clear JWT session
        await clearSession();

        return NextResponse.json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Logout failed" },
            { status: 500 }
        );
    }
}
