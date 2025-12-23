// lib/auth.ts - Complete Authentication System
// Implements JWT httpOnly cookies + RBAC

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import type { Role } from "@prisma/client";

// ============================================
// TYPES
// ============================================

export interface AuthUser {
    id: string;
    email: string;
    role: Role;
    country?: string | null;
}

export interface SessionPayload {
    userId: string;
    email: string;
    role: Role;
    country?: string | null;
    iat?: number;
    exp?: number;
}

// ============================================
// JWT CONFIGURATION
// ============================================

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
);

const JWT_COOKIE_NAME = "banadama-session";
const JWT_EXPIRY = "7d"; // 7 days

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Set session using JWT httpOnly cookie
 * 
 * @param user - User data to encode in JWT
 * @returns JWT token string
 * 
 * @example
 * ```ts
 * await setSession({ id: '123', email: 'user@example.com', role: 'BUYER' });
 * ```
 */
export async function setSession(user: AuthUser): Promise<string> {
    try {
        // Create JWT payload
        const payload: SessionPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            country: user.country,
        };

        // Sign JWT
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(JWT_EXPIRY)
            .sign(JWT_SECRET);

        // Set httpOnly cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: JWT_COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return token;
    } catch (error) {
        console.error("Error setting session:", error);
        throw new Error("Failed to create session");
    }
}

/**
 * Get current user from JWT cookie
 * 
 * @returns AuthUser or null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(JWT_COOKIE_NAME)?.value;

        if (!token) {
            return null;
        }

        // Verify and decode JWT
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const session = payload as SessionPayload;

        if (!session.userId || !session.email) {
            return null;
        }

        // Fetch fresh user data from database
        const user = await db.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                role: true,
                country: true,
                isActive: true,
            },
        });

        if (!user || !user.isActive) {
            // User doesn't exist or is deactivated
            await clearSession();
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            country: user.country,
        };
    } catch (error) {
        // JWT verification failed or expired
        console.error("Error getting current user:", error);
        return null;
    }
}

/**
 * Clear session (logout)
 */
export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(JWT_COOKIE_NAME);
}

/**
 * Refresh session (extend expiry)
 */
export async function refreshSession(): Promise<void> {
    const user = await getCurrentUser();
    if (user) {
        await setSession(user);
    }
}

// ============================================
// ROLE-BASED ACCESS CONTROL
// ============================================

/**
 * Require specific role(s) for access
 * Redirects if not authenticated or wrong role
 * 
 * @param allowed - Single role or array of allowed roles
 * @returns Authenticated user if authorized
 * @throws Redirects to /auth/login if not authenticated
 * @throws Redirects to /auth/forbidden if wrong role
 * 
 * @example
 * ```ts
 * // Single role
 * await requireRole('BUYER');
 * 
 * // Multiple roles
 * await requireRole(['ADMIN', 'OPS']);
 * 
 * // Get user data
 * const user = await requireRole('ADMIN');
 * console.log(user.email);
 * ```
 */
export async function requireRole(
    allowed: Role | Role[]
): Promise<AuthUser> {
    const roles = Array.isArray(allowed) ? allowed : [allowed];

    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Handle legacy roles (FACTORY, WHOLESALER → SUPPLIER)
    const normalizedUserRole = normalizeRole(user.role);
    const normalizedAllowedRoles = roles.map(normalizeRole);

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
        redirect("/auth/forbidden");
    }

    return user;
}

/**
 * Require any authenticated user (any role)
 * 
 * @returns Authenticated user
 * @throws Redirects to /auth/login if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    return user;
}

/**
 * Check if user has specific role (non-throwing)
 * 
 * @param user - User to check
 * @param allowed - Allowed role(s)
 * @returns true if user has allowed role
 */
export function hasRole(
    user: AuthUser | null,
    allowed: Role | Role[]
): boolean {
    if (!user) return false;

    const roles = Array.isArray(allowed) ? allowed : [allowed];
    const normalizedUserRole = normalizeRole(user.role);
    const normalizedAllowedRoles = roles.map(normalizeRole);

    return normalizedAllowedRoles.includes(normalizedUserRole);
}

/**
 * Normalize legacy roles to SUPPLIER
 */
function normalizeRole(role: Role): Role {
    if (role === "FACTORY" || role === "WHOLESALER") {
        return "SUPPLIER";
    }
    return role;
}

// ============================================
// API ROUTE HELPERS
// ============================================

/**
 * Get current user for API routes (doesn't redirect)
 * Returns null if not authenticated
 */
export async function getApiUser(): Promise<AuthUser | null> {
    return getCurrentUser();
}

/**
 * Require role for API routes (returns error instead of redirect)
 * 
 * @example
 * ```ts
 * const { user, error } = await requireApiRole('ADMIN');
 * if (error) {
 *   return NextResponse.json({ error: error.message }, { status: error.status });
 * }
 * ```
 */
export async function requireApiRole(
    allowed: Role | Role[]
): Promise<{ user?: AuthUser; error?: { message: string; status: number } }> {
    const user = await getCurrentUser();

    if (!user) {
        return {
            error: { message: "Unauthorized", status: 401 },
        };
    }

    const roles = Array.isArray(allowed) ? allowed : [allowed];
    const normalizedUserRole = normalizeRole(user.role);
    const normalizedAllowedRoles = roles.map(normalizeRole);

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
        return {
            error: { message: "Forbidden", status: 403 },
        };
    }

    return { user };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get role-based dashboard URL
 */
export function getRoleDashboard(role: Role): string {
    const normalized = normalizeRole(role);

    const dashboards: Record<Role, string> = {
        BUYER: "/buyer/dashboard",
        SUPPLIER: "/factory/dashboard", // Default suppliers to factory
        FACTORY: "/factory/dashboard",
        WHOLESALER: "/wholesaler/dashboard",
        CREATOR: "/creator/dashboard",
        OPS: "/ops/overview",
        AFFILIATE: "/affiliate/dashboard",
        ADMIN: "/admin/overview",
    };

    return dashboards[role] || "/";
}

/**
 * Check if route is public (doesn't require auth)
 */
export function isPublicRoute(pathname: string): boolean {
    const publicPaths = [
        "/",
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/marketplace",
        "/buy-near-me",
        "/global-market",
        "/group-buy",
        "/creators",
        "/affiliate",
        "/api/auth",
    ];

    return publicPaths.some((path) => pathname.startsWith(path));
}

/**
 * Get allowed routes for a role
 */
export function getAllowedRoutesForRole(role: Role): string[] {
    const normalized = normalizeRole(role);

    const routes: Record<Role, string[]> = {
        BUYER: ["/buyer"],
        SUPPLIER: ["/supplier"],
        FACTORY: ["/supplier"],
        WHOLESALER: ["/supplier"],
        CREATOR: ["/creator"],
        OPS: ["/ops"],
        AFFILIATE: ["/affiliate"],
        ADMIN: ["/admin", "/ops"], // Admin can access everything
    };

    return routes[normalized] || [];
}
