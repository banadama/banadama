// middleware.ts - Route Protection with Session-Based Access Control
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, AuthSession } from "./lib/auth/session.types";

/**
 * PUBLIC ROUTES - No auth required
 */
const PUBLIC_ROUTES = [
    "/",
    "/start",
    "/onboarding",
    "/marketplace",
    "/near-me",
    "/global",
    "/creators",
    "/auth",
    "/api/auth/login",
    "/api/auth/register",
    "/api/marketplace",
];

/**
 * STATIC ASSETS - Skip middleware
 */
const STATIC_PATHS = ["/_next", "/favicon", "/manifest", "/icons", "/images"];

/**
 * SYSTEM ROLE → ROUTES
 */
const ROLE_ROUTES: Record<string, string[]> = {
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
const ACCOUNT_ROUTES: Record<string, string[]> = {
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

function isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.some(
        (route) => path === route || path.startsWith(`${route}/`)
    );
}

function isStaticPath(path: string): boolean {
    return STATIC_PATHS.some((prefix) => path.startsWith(prefix));
}

function roleCanAccessRoute(role: string, path: string): boolean {
    // ADMIN can access everything
    if (role === "ADMIN") {
        return path.startsWith("/admin") || path.startsWith("/ops");
    }

    const allowedRoutes = ROLE_ROUTES[role] || [];
    return allowedRoutes.some((route) => path.startsWith(route));
}

function accountCanAccessRoute(type: string, path: string): boolean {
    const allowedRoutes = ACCOUNT_ROUTES[type] || [];
    return allowedRoutes.some((route) => path.startsWith(route));
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static assets
    if (isStaticPath(pathname)) {
        return NextResponse.next();
    }

    // Allow public routes
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // Allow API routes (they handle their own auth)
    if (pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    // Get session from cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
        // Not authenticated - redirect to login
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Parse session
        const session: AuthSession = JSON.parse(sessionCookie.value);

        // Check expiration
        if (session.expiresAt < Date.now()) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        const { role } = session.user;
        const { type } = session.activeAccount;

        // Check role-based access
        if (roleCanAccessRoute(role, pathname)) {
            return NextResponse.next();
        }

        // Check account-based access
        if (accountCanAccessRoute(type, pathname)) {
            return NextResponse.next();
        }

        // Access denied - redirect to appropriate dashboard
        const dashboardUrl = getDashboardUrl(session);
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
    } catch (error) {
        console.error("Middleware session parse error:", error);
        const loginUrl = new URL("/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
    }
}

function getDashboardUrl(session: AuthSession): string {
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

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
