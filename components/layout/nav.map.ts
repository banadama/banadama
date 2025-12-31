// components/layout/nav.map.ts - Role to Navigation Mapping
import {
    buyerNav,
    opsNav,
    factoryNav,
    wholesalerNav,
    retailNav,
    creatorNav,
    affiliateNav,
    growthNav,
    adminStudioNav,
    financeAdminNav,
    analyticsNav,
} from "./nav.config";
import type { NavItem } from "./SideNav";

export type Role =
    | "BUYER"
    | "OPS"
    | "COMPANY_FACTORY"
    | "COMPANY_WHOLESALER"
    | "COMPANY_RETAIL"
    | "CREATOR"
    | "AFFILIATE"
    | "GROWTH_AGENT"
    | "GROWTH_MANAGER"
    | "ADMIN"
    | "FINANCE_ADMIN";

/**
 * Get navigation items for a specific role
 */
export function navForRole(role: Role): NavItem[] {
    switch (role) {
        case "BUYER":
            return buyerNav;
        case "OPS":
            return opsNav;
        case "COMPANY_FACTORY":
            return factoryNav;
        case "COMPANY_WHOLESALER":
            return wholesalerNav;
        case "COMPANY_RETAIL":
            return retailNav;
        case "CREATOR":
            return creatorNav;
        case "AFFILIATE":
            return affiliateNav;
        case "GROWTH_AGENT":
        case "GROWTH_MANAGER":
            return growthNav;
        case "FINANCE_ADMIN":
            return financeAdminNav;
        case "ADMIN":
            return adminStudioNav;
        default:
            return buyerNav;
    }
}

/**
 * Get redirect path for a role after login
 */
export function dashboardForRole(role: Role): string {
    switch (role) {
        case "BUYER":
            return "/buyer/dashboard";
        case "OPS":
            return "/ops/overview";
        case "COMPANY_FACTORY":
                return "/supplier/dashboard";
        case "COMPANY_WHOLESALER":
                return "/supplier/dashboard";
        case "COMPANY_RETAIL":
                return "/supplier/dashboard";
        case "CREATOR":
            return "/creator/dashboard";
        case "AFFILIATE":
            return "/affiliate/dashboard";
        case "GROWTH_AGENT":
        case "GROWTH_MANAGER":
            return "/growth/dashboard";
        case "FINANCE_ADMIN":
            return "/admin/finance/dashboard";
        case "ADMIN":
            return "/admin/overview";
        default:
            return "/buyer/dashboard";
    }
}

/**
 * Admin combined nav with analytics
 */
export function adminCombinedNav(): NavItem[] {
    return [
        ...adminStudioNav,
        { href: "", label: "─── Analytics ───", icon: "" }, // Separator
        ...analyticsNav,
    ];
}

/**
 * Finance admin combined nav
 */
export function financeWithAnalyticsNav(): NavItem[] {
    return [
        ...financeAdminNav,
        { href: "", label: "─── Analytics ───", icon: "" },
        { href: "/admin/analytics/finance", label: "Finance Analytics", icon: "📊" },
    ];
}

/**
 * Check if role has access to a route
 */
export function roleCanAccess(role: Role, path: string): boolean {
    const roleRoutes: Record<Role, string[]> = {
        BUYER: ["/buyer", "/marketplace"],
        OPS: ["/ops"],
        COMPANY_FACTORY: ["/factory"],
        COMPANY_WHOLESALER: ["/wholesaler"],
        COMPANY_RETAIL: ["/retail"],
        CREATOR: ["/creator"],
        AFFILIATE: ["/affiliate"],
        GROWTH: ["/growth"],
        FINANCE_ADMIN: ["/admin/finance", "/admin/analytics/finance"],
        ADMIN: ["/admin"],
    };

    const allowedPaths = roleRoutes[role] || [];
    return allowedPaths.some((allowed) => path.startsWith(allowed));
}
