// middleware.ts - Clean host-based subdomain routing for Banadama
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/auth/session.types";

/**
 * SUBDOMAIN CONFIGURATION
 * Maps host subdomains to internal route groups
 */
const DOMAIN_MAP: Record<string, string> = {
    "admin": "admin",
    "ops": "admin/ops", // Ops is now part of admin
    "supplier": "supplier",
    "factory": "supplier/factory", // Legacy support
    "wholesaler": "supplier/wholesaler", // Legacy support
    "bd": "regional/bd",
    "ng": "regional/ng",
};

/**
 * PUBLIC ROUTES
 * These routes are accessible without a session
 */
const PUBLIC_ROUTES = [
    "/",
    "/auth",
    "/marketplace",
    "/near-me",
    "/global",
    "/creators",
    "/about",
    "/terms",
    "/privacy",
    "/help",
    "/support",
    "/api/auth",
];

const STATIC_ASSETS = ["/_next", "/favicon", "/manifest", "/icons", "/images", "/api/"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get("host") || "";

    // 1. Skip static assets and internal Next.js requests
    if (STATIC_ASSETS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 2. Determine Subdomain
    const cleanHost = host.replace(/:\d+$/, ""); // Remove port
    const parts = cleanHost.split(".");

    // Handle www redirect
    if (parts[0] === "www") {
        const url = request.nextUrl.clone();
        url.host = cleanHost.replace("www.", "");
        return NextResponse.redirect(url, 301);
    }

    // Identify subdomain (e.g., admin.banadama.com -> parts.length > 2)
    // For localhost development, we might not have a subdomain unless using local pods/tunnels
    const subdomain = parts.length > 2 ? parts[0] : null;

    // 3. Host-based Routing (URL Rewriting)
    if (subdomain && DOMAIN_MAP[subdomain]) {
        const targetGroup = DOMAIN_MAP[subdomain];

        // Prevent recursive rewriting if already processed
        // Route groups like (admin) or (supplier) are usually handled by Next.js automatically
        // but since we are doing subdomain routing, we rewrite to the internal path.
        // If we use (admin) in our folder name, the internal path for Next.js is just /admin/path

        const internalPath = `/${targetGroup}${pathname === "/" ? "" : pathname}`;

        // Only rewrite if we're not already targeting the right group
        // Note: For API routes, we might want to bypass host-based routing or handle it differently
        if (!pathname.startsWith("/api")) {
            const url = request.nextUrl.clone();
            url.pathname = internalPath;
            return NextResponse.rewrite(url);
        }
    }

    // 4. Authentication Check for Protected Portals
    // We only enforce session check here if the user is attempting to access a dashboard
    const isProtectedPath = !PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));

    if (isProtectedPath) {
        const session = request.cookies.get(SESSION_COOKIE_NAME);

        if (!session?.value) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Deeper session validation (expiry, role) usually happens in server components or layouts
        // to keep middleware lightweight.
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
