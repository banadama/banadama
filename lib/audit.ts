// Audit logging for admin actions

import { AdminAction, AuditTargetType } from "@/config/admin";
import { db } from "@/lib/db";

export interface AuditLogEntry {
    adminId: string;
    action: AdminAction | string;
    targetType: AuditTargetType | string;
    targetId: string;
    targetUserId?: string;
    before?: any;
    after?: any;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Log an admin action to the audit log
 * This should be called for all sensitive admin operations
 */
export async function logAdminAction(entry: AuditLogEntry): Promise<void> {
    try {
        // Write to database
        await db.adminAuditLog.create({
            data: {
                adminId: entry.adminId,
                action: entry.action,
                targetType: entry.targetType,
                targetId: entry.targetId,
                targetUserId: entry.targetUserId,
                before: entry.before,
                after: entry.after,
                metadata: entry.metadata,
                ipAddress: entry.ipAddress,
                userAgent: entry.userAgent,
            },
        });

        // Also log to console in development
        if (process.env.NODE_ENV === "development") {
            console.log("[AUDIT LOG]", {
                timestamp: new Date().toISOString(),
                ...entry,
            });
        }
    } catch (error) {
        console.error("Failed to write audit log:", error);
        // Don't throw - we don't want audit logging failures to break the app
    }
}

/**
 * Create a snapshot of an object for before/after comparison
 */
export function createSnapshot(obj: any): any {
    if (!obj) return null;

    // Remove sensitive fields
    const { password, token, secret, ...safe } = obj;

    return JSON.parse(JSON.stringify(safe));
}

/**
 * Log a user role change
 */
export async function logRoleChange(
    adminId: string,
    userId: string,
    oldRole: string,
    newRole: string,
    metadata?: any
): Promise<void> {
    await logAdminAction({
        adminId,
        action: "CHANGE_ROLE",
        targetType: "USER",
        targetId: userId,
        targetUserId: userId,
        before: { role: oldRole },
        after: { role: newRole },
        metadata,
    });
}

/**
 * Log a user suspension
 */
export async function logUserSuspension(
    adminId: string,
    userId: string,
    reason?: string
): Promise<void> {
    await logAdminAction({
        adminId,
        action: "SUSPEND_USER",
        targetType: "USER",
        targetId: userId,
        targetUserId: userId,
        metadata: { reason },
    });
}

/**
 * Log a pricing change
 */
export async function logPricingChange(
    adminId: string,
    before: any,
    after: any,
    metadata?: any
): Promise<void> {
    await logAdminAction({
        adminId,
        action: "UPDATE_PRICING",
        targetType: "PRICING",
        targetId: "global",
        before: createSnapshot(before),
        after: createSnapshot(after),
        metadata,
    });
}

/**
 * Log a feature flag toggle
 */
export async function logFeatureFlagToggle(
    adminId: string,
    flagKey: string,
    enabled: boolean
): Promise<void> {
    await logAdminAction({
        adminId,
        action: "TOGGLE_FEATURE_FLAG",
        targetType: "FEATURE_FLAG",
        targetId: flagKey,
        after: { enabled },
    });
}

/**
 * Log a supplier approval/rejection
 */
export async function logSupplierAction(
    adminId: string,
    supplierId: string,
    action: "APPROVE_SUPPLIER" | "REJECT_SUPPLIER",
    reason?: string
): Promise<void> {
    await logAdminAction({
        adminId,
        action,
        targetType: "SUPPLIER",
        targetId: supplierId,
        metadata: { reason },
    });
}

/**
 * Get audit logs with filters
 */
export interface AuditLogFilter {
    adminId?: string;
    targetType?: string;
    targetId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}

export async function getAuditLogs(filter: AuditLogFilter = {}): Promise<any[]> {
    const where: any = {};

    if (filter.adminId) where.adminId = filter.adminId;
    if (filter.targetType) where.targetType = filter.targetType;
    if (filter.targetId) where.targetId = filter.targetId;
    if (filter.action) where.action = filter.action;

    if (filter.startDate || filter.endDate) {
        where.createdAt = {};
        if (filter.startDate) where.createdAt.gte = filter.startDate;
        if (filter.endDate) where.createdAt.lte = filter.endDate;
    }

    return await db.adminAuditLog.findMany({
        where,
        include: {
            admin: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
            targetUser: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: filter.limit || 50,
        skip: filter.offset || 0,
    });
}

