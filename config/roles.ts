// Role-based permissions configuration

export enum UserRole {
    BUYER = "BUYER",
    FACTORY = "FACTORY",
    WHOLESALER = "WHOLESALER",
    CREATOR = "CREATOR",
    OPS = "OPS",
    AFFILIATE = "AFFILIATE",
    ADMIN = "ADMIN",
}

export type Permission =
    | "view_own_data"
    | "manage_own_requests"
    | "manage_own_orders"
    | "manage_own_wallet"
    | "manage_own_catalog"
    | "view_purchase_orders"
    | "manage_own_products"
    | "process_buyer_requests"
    | "create_purchase_orders"
    | "view_all_users"
    | "manage_users"
    | "manage_suppliers"
    | "manage_creators"
    | "manage_affiliates"
    | "manage_pricing"
    | "manage_config"
    | "view_audit_logs"
    | "manage_security";

/**
 * Permission matrix defining what each role can do
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.BUYER]: [
        "view_own_data",
        "manage_own_requests",
        "manage_own_orders",
        "manage_own_wallet",
    ],

    [UserRole.FACTORY]: [
        "view_own_data",
        "manage_own_catalog",
        "view_purchase_orders",
    ],

    [UserRole.WHOLESALER]: [
        "view_own_data",
        "manage_own_catalog",
        "view_purchase_orders",
    ],

    [UserRole.CREATOR]: [
        "view_own_data",
        "manage_own_products",
    ],

    [UserRole.OPS]: [
        "view_own_data",
        "process_buyer_requests",
        "create_purchase_orders",
    ],

    [UserRole.AFFILIATE]: [
        "view_own_data",
    ],

    [UserRole.ADMIN]: [
        "view_own_data",
        "view_all_users",
        "manage_users",
        "manage_suppliers",
        "manage_creators",
        "manage_affiliates",
        "manage_pricing",
        "manage_config",
        "view_audit_logs",
        "manage_security",
    ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if user can access admin area
 */
export function canAccessAdmin(role: UserRole): boolean {
    return role === UserRole.ADMIN;
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(role: UserRole): boolean {
    return hasPermission(role, "manage_users");
}

/**
 * Check if user can view audit logs
 */
export function canViewAuditLogs(role: UserRole): boolean {
    return hasPermission(role, "view_audit_logs");
}

/**
 * Check if user can manage pricing
 */
export function canManagePricing(role: UserRole): boolean {
    return hasPermission(role, "manage_pricing");
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
}

/**
 * Role descriptions for UI
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    [UserRole.BUYER]: "Can manage own requests, orders, and wallet",
    [UserRole.FACTORY]: "Can manage catalog and view purchase orders from Banadama",
    [UserRole.WHOLESALER]: "Can manage catalog and view purchase orders from Banadama",
    [UserRole.CREATOR]: "Can manage products and view earnings",
    [UserRole.OPS]: "Can process buyer requests and create purchase orders",
    [UserRole.AFFILIATE]: "Can manage affiliate links and view earnings",
    [UserRole.ADMIN]: "Full access to admin panel and all system features",
};

// Legacy exports for backward compatibility
export const ROLES = {
    BUYER: "BUYER",
    FACTORY: "FACTORY",
    WHOLESALER: "WHOLESALER",
    CREATOR: "CREATOR",
    OPS: "OPS",
    AFFILIATE: "AFFILIATE",
    ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
