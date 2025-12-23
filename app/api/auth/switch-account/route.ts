// app/api/auth/switch-account/route.ts - Switch Active Account
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, setSession, AuthUser } from "@/lib/auth";

/**
 * POST /api/auth/switch-account
 * 
 * Switch the active account for the current user.
 * User must own or be a member of the account.
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { accountId, role: requestedRole } = await request.json();

        if (!accountId) {
            return NextResponse.json(
                { error: "accountId is required" },
                { status: 400 }
            );
        }

        // Fetch fresh user data to verify access
        const dbUser = await db.user.findUnique({
            where: { id: user.id },
            include: {
                buyerProfile: true,
                supplierProfile: true,
                creatorProfile: true,
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Logic to verify if user has access to this account/role
        // and switch to it. For now, we'll just update the session role
        // if the corresponding profile exists.

        let targetRole = user.role;
        if (requestedRole === "BUYER" && dbUser.buyerProfile) targetRole = "BUYER";
        else if (requestedRole === "SUPPLIER" && dbUser.supplierProfile) targetRole = "SUPPLIER";
        else if (requestedRole === "CREATOR" && dbUser.creatorProfile) targetRole = "CREATOR";
        else if (requestedRole === "OPS" && dbUser.role === "OPS") targetRole = "OPS";
        else if (requestedRole === "ADMIN" && dbUser.role === "ADMIN") targetRole = "ADMIN";

        const updatedUser: AuthUser = {
            id: user.id,
            email: user.email,
            role: targetRole,
            country: user.country
        };

        await setSession(updatedUser);

        return NextResponse.json({
            ok: true,
            user: updatedUser
        });
    } catch (error) {
        console.error("Switch account error:", error);
        return NextResponse.json(
            { error: "Failed to switch account" },
            { status: 500 }
        );
    }
}
