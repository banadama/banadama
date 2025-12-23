// lib/auth/permissions.ts - Permission Checking Logic

import { AuthSession } from "./session.types";
import { Permission } from "./permissions.types";
import { ROLE_PERMISSIONS, ACCOUNT_PERMISSIONS } from "./permissions.matrix";

/**
 * Get effective permissions for a session
 * Effective = union of (account permissions) + (role permissions)
 */
export function getEffectivePermissions(session: AuthSession): Permission[] {
    const accountPerms = session.activeAccount.permissions as Permission[];
    const rolePerms = ROLE_PERMISSIONS[session.user.role] || [];

    // Union of both, deduplicated
    const allPerms = new Set([...accountPerms, ...rolePerms]);
    return Array.from(allPerms);
}

/**
 * Check if session has a specific permission
 */
export function checkPermission(
    session: AuthSession | null,
    permission: Permission
): boolean {
    if (!session) return false;

    // ADMIN has all permissions
    if (session.user.role === "ADMIN") {
        return true;
    }

    const effectivePerms = getEffectivePermissions(session);
    return effectivePerms.includes(permission);
}

/**
 * Check if session has ANY of the given permissions
 */
export function checkAnyPermission(
    session: AuthSession | null,
    permissions: Permission[]
): boolean {
    if (!session) return false;

    // ADMIN has all permissions
    if (session.user.role === "ADMIN") {
        return true;
    }

    const effectivePerms = getEffectivePermissions(session);
    return permissions.some((p) => effectivePerms.includes(p));
}

/**
 * Check if session has ALL of the given permissions
 */
export function checkAllPermissions(
    session: AuthSession | null,
    permissions: Permission[]
): boolean {
    if (!session) return false;

    // ADMIN has all permissions
    if (session.user.role === "ADMIN") {
        return true;
    }

    const effectivePerms = getEffectivePermissions(session);
    return permissions.every((p) => effectivePerms.includes(p));
}

/**
 * Get missing permissions from a set
 */
export function getMissingPermissions(
    session: AuthSession | null,
    required: Permission[]
): Permission[] {
    if (!session) return required;

    // ADMIN has all permissions
    if (session.user.role === "ADMIN") {
        return [];
    }

    const effectivePerms = getEffectivePermissions(session);
    return required.filter((p) => !effectivePerms.includes(p));
}

/**
 * Business Logic Constraints
 */
export const PERMISSION_CONSTRAINTS = {
    // Order status update - limited by account type
    ORDER_STATUS_UPDATE: {
        COMPANY_WHOLESALER: ["READY_TO_SHIP", "SHIPPED"],
        COMPANY_RETAIL: ["PACKED", "SHIPPED"],
        COMPANY_FACTORY: [], // Factory uses PRODUCTION_STATUS_UPDATE
    },

    // Chat constraints - who can chat with whom
    CHAT_CONSTRAINTS: {
        BUYER: ["OPS"], // Buyer ↔ Ops only
        COMPANY_FACTORY: ["OPS"], // Factory ↔ Ops only
        COMPANY_WHOLESALER: ["OPS"], // Wholesaler ↔ Ops only
        COMPANY_RETAIL: ["OPS"], // Retail ↔ Ops only
        CREATOR_MODEL: ["OPS"], // Creator ↔ Ops only
        CREATOR_PHOTOGRAPHER: ["OPS"],
        CREATOR_VIDEOGRAPHER: ["OPS"],
        CREATOR_GRAPHIC_DESIGNER: ["OPS", "BUYER"], // support threads
        CREATOR_MOCK_DESIGNER: ["OPS", "BUYER"],
    },
};

/**
 * Check if account type can update to a specific order status
 */
export function canUpdateToStatus(
    accountType: string,
    targetStatus: string
): boolean {
    const allowed =
        PERMISSION_CONSTRAINTS.ORDER_STATUS_UPDATE[
        accountType as keyof typeof PERMISSION_CONSTRAINTS.ORDER_STATUS_UPDATE
        ];

    if (!allowed) return false;
    return allowed.includes(targetStatus);
}

/**
 * Check if two account types can chat
 */
export function canChatWith(
    senderType: string,
    recipientRole: string
): boolean {
    const allowed =
        PERMISSION_CONSTRAINTS.CHAT_CONSTRAINTS[
        senderType as keyof typeof PERMISSION_CONSTRAINTS.CHAT_CONSTRAINTS
        ];

    if (!allowed) return false;
    return allowed.includes(recipientRole);
}
