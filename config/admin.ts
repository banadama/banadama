// Admin panel configuration

export interface AdminMenuItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    requiredRole?: string;
    requiredFeatureFlag?: string;
    children?: AdminMenuItem[];
}

/**
 * Admin sidebar menu structure
 */
export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: "📊",
        href: "/admin/dashboard",
    },
    {
        id: "users",
        label: "Users",
        icon: "👥",
        href: "/admin/users",
    },
    {
        id: "suppliers",
        label: "Suppliers",
        icon: "🏭",
        href: "/admin/suppliers",
    },
    {
        id: "creators",
        label: "Creators",
        icon: "🎨",
        href: "/admin/creators",
    },
    {
        id: "affiliates",
        label: "Affiliates",
        icon: "🔗",
        href: "/admin/affiliates",
    },
    {
        id: "pricing",
        label: "Pricing",
        icon: "💰",
        href: "/admin/pricing",
        children: [
            {
                id: "pricing-overview",
                label: "Overview",
                icon: "📋",
                href: "/admin/pricing",
            },
            {
                id: "pricing-overrides",
                label: "Overrides",
                icon: "⚙️",
                href: "/admin/pricing/overrides",
            },
        ],
    },
    {
        id: "config",
        label: "Configuration",
        icon: "⚙️",
        href: "/admin/config",
        children: [
            {
                id: "config-general",
                label: "General",
                icon: "🔧",
                href: "/admin/config",
            },
            {
                id: "config-features",
                label: "Feature Flags",
                icon: "🚩",
                href: "/admin/config/features",
            },
        ],
    },
    {
        id: "logs",
        label: "Logs",
        icon: "📝",
        href: "/admin/logs",
        children: [
            {
                id: "logs-activity",
                label: "Activity",
                icon: "📊",
                href: "/admin/logs/activity",
            },
            {
                id: "logs-audit",
                label: "Audit",
                icon: "🔍",
                href: "/admin/logs/audit",
            },
        ],
    },
    {
        id: "security",
        label: "Security",
        icon: "🔒",
        href: "/admin/security",
        children: [
            {
                id: "security-overview",
                label: "Overview",
                icon: "🛡️",
                href: "/admin/security",
            },
            {
                id: "security-sessions",
                label: "Sessions",
                icon: "🔑",
                href: "/admin/security/sessions",
            },
        ],
    },
];

/**
 * Admin dashboard metrics configuration
 */
export const ADMIN_METRICS = {
    users: {
        label: "Total Users",
        icon: "👥",
        color: "blue",
    },
    suppliers: {
        label: "Active Suppliers",
        icon: "🏭",
        color: "emerald",
    },
    creators: {
        label: "Creators",
        icon: "🎨",
        color: "purple",
    },
    gmv: {
        label: "GMV (30 days)",
        icon: "💰",
        color: "yellow",
    },
    fees: {
        label: "Fees Earned",
        icon: "💵",
        color: "green",
    },
    affiliateCost: {
        label: "Affiliate Cost",
        icon: "🔗",
        color: "orange",
    },
};

/**
 * Admin action types for audit logging
 */
export const ADMIN_ACTIONS = {
    // User actions
    CREATE_USER: "CREATE_USER",
    UPDATE_USER: "UPDATE_USER",
    DELETE_USER: "DELETE_USER",
    CHANGE_ROLE: "CHANGE_ROLE",
    SUSPEND_USER: "SUSPEND_USER",
    ACTIVATE_USER: "ACTIVATE_USER",

    // Supplier actions
    APPROVE_SUPPLIER: "APPROVE_SUPPLIER",
    REJECT_SUPPLIER: "REJECT_SUPPLIER",
    UPDATE_SUPPLIER: "UPDATE_SUPPLIER",

    // Creator actions
    SUSPEND_CREATOR: "SUSPEND_CREATOR",
    RESTORE_CREATOR: "RESTORE_CREATOR",
    UPDATE_CREATOR_COMMISSION: "UPDATE_CREATOR_COMMISSION",

    // Affiliate actions
    LOCK_AFFILIATE: "LOCK_AFFILIATE",
    UNLOCK_AFFILIATE: "UNLOCK_AFFILIATE",
    ADJUST_AFFILIATE_COMMISSION: "ADJUST_AFFILIATE_COMMISSION",
    MANUAL_PAYOUT: "MANUAL_PAYOUT",

    // Pricing actions
    UPDATE_PRICING: "UPDATE_PRICING",
    CREATE_PRICING_OVERRIDE: "CREATE_PRICING_OVERRIDE",
    DELETE_PRICING_OVERRIDE: "DELETE_PRICING_OVERRIDE",

    // Config actions
    UPDATE_CONFIG: "UPDATE_CONFIG",
    TOGGLE_FEATURE_FLAG: "TOGGLE_FEATURE_FLAG",

    // Security actions
    FORCE_LOGOUT: "FORCE_LOGOUT",
    LOCK_ACCOUNT: "LOCK_ACCOUNT",
    RESET_PASSWORD: "RESET_PASSWORD",
} as const;

export type AdminAction = (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS];

/**
 * Target types for audit logging
 */
export const AUDIT_TARGET_TYPES = {
    USER: "USER",
    SUPPLIER: "SUPPLIER",
    CREATOR: "CREATOR",
    AFFILIATE: "AFFILIATE",
    PRICING: "PRICING",
    CONFIG: "CONFIG",
    FEATURE_FLAG: "FEATURE_FLAG",
    SESSION: "SESSION",
} as const;

export type AuditTargetType = (typeof AUDIT_TARGET_TYPES)[keyof typeof AUDIT_TARGET_TYPES];
