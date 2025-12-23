// lib/auth/route-access.ts - Route Access Control

import { SystemRole, AccountType, AuthSession } from "./session.types";

/**
 * SYSTEM ROLE → ROUTES
 */
const ROLE_ROUTES: Record<SystemRole, string[]> = {
    ADMIN: ["/admin"],
    FINANCE_ADMIN: ["/admin/finance"],
    OPS: ["/ops"],
    BUYER: ["/buyer", "/marketplace"],
    GROWTH_AGENT: ["/growth"],
    GROWTH_MANAGER: ["/growth", "/admin/studio/growth-settings"],
};

/**
 * ACCOUNT TYPE → ROUTES
 */
const ACCOUNT_ROUTES: Record<AccountType, string[]> = {
    BUYER: ["/buyer", "/marketplace"],
    COMPANY_FACTORY: ["/factory"],
    COMPANY_WHOLESALER: ["/wholesaler"],
    COMPANY_RETAIL: ["/retail"],
    CREATOR_MODEL: ["/creator"],
    CREATOR_GRAPHIC_DESIGNER: ["/creator"],
    CREATOR_MOCK_DESIGNER: ["/creator"],
    CREATOR_PHOTOGRAPHER: ["/creator"],
    CREATOR_VIDEOGRAPHER: ["/creator"],
    AFFILIATE: ["/affiliate"],
};

/**
 * PUBLIC ROUTES - No auth required
 */
export const PUBLIC_ROUTES = [
    "/",
    "/marketplace",
    "/near-me",
    "/global",
    "/creators",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/api/auth/login",
    "/api/auth/register",
    "/api/marketplace",
];

/**
 * Check if route is public
 */
export function isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.some(
        (route) => path === route || path.startsWith(`${route}/`)
    );
}

/**
 * Check if user's system role can access route
 */
export function roleCanAccessRoute(role: SystemRole, path: string): boolean {
    const allowedRoutes = ROLE_ROUTES[role] || [];

    // ADMIN can access everything
    if (role === "ADMIN") {
        return path.startsWith("/admin") || path.startsWith("/ops");
    }

    return allowedRoutes.some((route) => path.startsWith(route));
}

/**
 * Check if account type can access route
 */
export function accountCanAccessRoute(type: AccountType, path: string): boolean {
    const allowedRoutes = ACCOUNT_ROUTES[type] || [];
    return allowedRoutes.some((route) => path.startsWith(route));
}

/**
 * Get redirect URL for role after login
 */
export function getRedirectForSession(session: AuthSession): string {
    const { role } = session.user;
    const { type } = session.activeAccount;

    // System roles first
    switch (role) {
        case "ADMIN":
            return "/admin/overview";
        case "FINANCE_ADMIN":
            return "/admin/finance/dashboard";
        case "OPS":
            return "/ops/overview";
        case "GROWTH_AGENT":
        case "GROWTH_MANAGER":
            return "/growth/dashboard";
    }

    // Account type based
    switch (type) {
        case "COMPANY_FACTORY":
            return "/factory/dashboard";
        case "COMPANY_WHOLESALER":
            return "/wholesaler/dashboard";
        case "COMPANY_RETAIL":
            return "/retail/dashboard";
        case "CREATOR_MODEL":
        case "CREATOR_GRAPHIC_DESIGNER":
        case "CREATOR_MOCK_DESIGNER":
        case "CREATOR_PHOTOGRAPHER":
        case "CREATOR_VIDEOGRAPHER":
            return "/creator/dashboard";
        case "AFFILIATE":
            return "/affiliate/dashboard";
        case "BUYER":
        default:
            return "/buyer/dashboard";
    }
}

/**
 * Validate session can access path
 */
export function canAccessPath(session: AuthSession | null, path: string): boolean {
    // Public routes
    if (isPublicRoute(path)) {
        return true;
    }

    // No session = no access to protected routes
    if (!session) {
        return false;
    }

    const { role } = session.user;
    const { type } = session.activeAccount;

    // Check role-based access first
    if (roleCanAccessRoute(role, path)) {
        return true;
    }

    // Check account-based access
    if (accountCanAccessRoute(type, path)) {
        return true;
    }

    return false;
}
