// middleware.ts - Subdomain Routing + Auth Protection
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, AuthSession } from "./lib/auth/session.types";

// ============================================
// SUBDOMAIN → ROUTE GROUP MAPPING
// ============================================
const SUBDOMAIN_ROUTES: Record<string, string> = {
    admin: "/admin",
    ops: "/ops",
    supplier: "/supplier",
    bd: "/growth", // Business Development maps to growth
    ng: "/ng",
};

// ============================================
// PUBLIC ROUTES - No auth required
// ============================================
const PUBLIC_ROUTES = [
    "/",
    "/start",
    "/onboarding",
    "/marketplace",
    "/near-me",
    "/global",
    "/creators",
    "/auth",
    "/about",
    "/terms",
    "/privacy",
    "/help",
    "/support",
    "/api/auth/login",
    "/api/auth/register",
    "/api/marketplace",
];

// ============================================
// STATIC ASSETS - Skip middleware
// ============================================
const STATIC_PATHS = ["/_next", "/favicon", "/manifest", "/icons", "/images", "/api/"];

// ============================================
// ROLE → ROUTES ACCESS CONTROL
// ============================================
const ROLE_ROUTES: Record<string, string[]> = {
    ADMIN: ["/admin", "/ops"],
    FINANCE_ADMIN: ["/admin/finance"],
    OPS: ["/ops"],
    BUYER: ["/buyer", "/marketplace"],
    GROWTH_AGENT: ["/growth"],
    GROWTH_MANAGER: ["/growth", "/admin/studio/growth-settings"],
};

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

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSubdomain(host: string): string | null {
    // Handle localhost for development (no subdomain routing)
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
        return null;
    }

    // Extract subdomain from host (remove port if present)
    const cleanHost = host.replace(/:\d+$/, "");
    const parts = cleanHost.split(".");

    // Handle www redirect
    if (parts[0] === "www") {
        return "www";
    }

    // Check if it's a subdomain (e.g., admin.banadama.com has 3 parts)
    if (parts.length > 2) {
        return parts[0];
    }

    return null; // Main domain (banadama.com)
}

function isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
}

function isStaticPath(path: string): boolean {
    return STATIC_PATHS.some((prefix) => path.startsWith(prefix));
}

function roleCanAccessRoute(role: string, path: string): boolean {
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

// ============================================
// MIDDLEWARE
// ============================================

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get("host") || "";

    // 1. Skip static assets
    if (isStaticPath(pathname)) {
        return NextResponse.next();
    }

    // 2. Get subdomain
    const subdomain = getSubdomain(host);

    // 3. Handle www → apex domain redirect
    if (subdomain === "www") {
        const url = request.nextUrl.clone();
        url.host = host.replace("www.", "");
        return NextResponse.redirect(url, 301);
    }

    // 4. Subdomain-based routing (rewrite URL to route group)
    if (subdomain && SUBDOMAIN_ROUTES[subdomain]) {
        const targetPath = SUBDOMAIN_ROUTES[subdomain];

        // Only rewrite if not already on the target path and not an API route
        if (!pathname.startsWith(targetPath) && !pathname.startsWith("/api")) {
            const url = request.nextUrl.clone();
            url.pathname = `${targetPath}${pathname === "/" ? "" : pathname}`;
            return NextResponse.rewrite(url);
        }
    }

    // 5. Allow API routes (they handle their own auth)
    if (pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    // 6. Allow public routes
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // 7. Auth check for protected routes
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
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
