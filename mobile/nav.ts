// mobile/nav.ts - Mobile Navigation Config

export type MobileScreen = {
    label: string;
    screen: string;
    icon?: string;
};

export type MobileRole = "OPS" | "SUPPLIER" | "BUYER" | "GROWTH" | "CREATOR" | "AFFILIATE";

export const mobileNav: Record<MobileRole, MobileScreen[]> = {
    OPS: [
        { label: "Dashboard", screen: "OpsDashboard", icon: "🛰️" },
        { label: "RFQs", screen: "OpsRFQs", icon: "🧾" },
        { label: "Orders", screen: "OpsOrders", icon: "📦" },
        { label: "Logistics", screen: "OpsLogistics", icon: "🚚" },
        { label: "Messages", screen: "OpsMessages", icon: "💬" },
    ],
    SUPPLIER: [
        { label: "Dashboard", screen: "SupplierDashboard", icon: "🏭" },
        { label: "Orders", screen: "SupplierOrders", icon: "📦" },
        { label: "Products", screen: "SupplierProducts", icon: "🧺" },
        { label: "Messages", screen: "SupplierMessages", icon: "💬" },
        { label: "Wallet", screen: "SupplierWallet", icon: "💳" },
    ],
    BUYER: [
        { label: "Marketplace", screen: "BuyerMarketplace", icon: "🛒" },
        { label: "RFQs", screen: "BuyerRFQs", icon: "🧾" },
        { label: "Orders", screen: "BuyerOrders", icon: "📦" },
        { label: "Messages", screen: "BuyerMessages", icon: "💬" },
    ],
    GROWTH: [
        { label: "Dashboard", screen: "GrowthDashboard", icon: "🚀" },
        { label: "Onboard", screen: "GrowthOnboard", icon: "➕" },
        { label: "My Suppliers", screen: "GrowthSuppliers", icon: "🏪" },
        { label: "Earnings", screen: "GrowthEarnings", icon: "💰" },
    ],
    CREATOR: [
        { label: "Dashboard", screen: "CreatorDashboard", icon: "🎨" },
        { label: "Jobs", screen: "CreatorJobs", icon: "📍" },
        { label: "Products", screen: "CreatorProducts", icon: "🧩" },
        { label: "Wallet", screen: "CreatorWallet", icon: "💳" },
    ],
    AFFILIATE: [
        { label: "Dashboard", screen: "AffiliateDashboard", icon: "🔗" },
        { label: "Links", screen: "AffiliateLinks", icon: "🧷" },
        { label: "Earnings", screen: "AffiliateEarnings", icon: "💰" },
    ],
};

/**
 * Get bottom tab navigation for a role
 */
export function getBottomTabs(role: MobileRole): MobileScreen[] {
    const nav = mobileNav[role] || mobileNav.BUYER;
    // Return first 5 items max for bottom tabs
    return nav.slice(0, 5);
}

/**
 * Get full navigation for drawer/menu
 */
export function getFullNav(role: MobileRole): MobileScreen[] {
    return mobileNav[role] || mobileNav.BUYER;
}
