// lib/auth/permissions.matrix.ts - Account Type & Role Permissions Matrix

import { Permission } from "./permissions.types";
import { AccountType, SystemRole } from "./session.types";

/**
 * ACCOUNT TYPE → DEFAULT PERMISSIONS
 * These permissions are assigned when account is created
 */
export const ACCOUNT_PERMISSIONS: Record<AccountType, Permission[]> = {
    // ─── BUYER ───
    BUYER: [
        "VIEW_DASHBOARD",
        "RFQ_CREATE",
        "RFQ_VIEW",
        "QUOTE_VIEW",
        "QUOTE_CONFIRM",
        "ORDER_VIEW",
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
    ],

    // ─── COMPANY_FACTORY ───
    COMPANY_FACTORY: [
        "VIEW_DASHBOARD",
        "PRODUCT_CREATE",
        "PRODUCT_EDIT",
        "PRODUCT_HIDE",
        "RFQ_VIEW",
        "ORDER_VIEW",
        "PRODUCTION_STATUS_UPDATE",
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
        "WITHDRAW_REQUEST",
    ],

    // ─── COMPANY_WHOLESALER ───
    COMPANY_WHOLESALER: [
        "VIEW_DASHBOARD",
        "PRODUCT_CREATE",
        "PRODUCT_EDIT",
        "PRODUCT_HIDE",
        "RFQ_VIEW",
        "ORDER_VIEW",
        "ORDER_STATUS_UPDATE", // READY_TO_SHIP, SHIPPED only
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
        "WITHDRAW_REQUEST",
    ],

    // ─── COMPANY_RETAIL ───
    COMPANY_RETAIL: [
        "VIEW_DASHBOARD",
        "PRODUCT_CREATE",
        "PRODUCT_EDIT",
        "PRODUCT_HIDE",
        "ORDER_VIEW",
        "ORDER_STATUS_UPDATE", // PACKED, SHIPPED only
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
        "WITHDRAW_REQUEST",
    ],

    // ─── CREATOR_MODEL (Local Jobs) ───
    CREATOR_MODEL: [
        "VIEW_DASHBOARD",
        "CREATOR_JOB_VIEW",
        "CREATOR_DELIVERY_UPLOAD",
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
        "WITHDRAW_REQUEST",
    ],

    // ─── CREATOR_PHOTOGRAPHER (Local Jobs) ───
    CREATOR_PHOTOGRAPHER: [
        "VIEW_DASHBOARD",
        "CREATOR_JOB_VIEW",
        "CREATOR_DELIVERY_UPLOAD",
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
        "WITHDRAW_REQUEST",
    ],

    // ─── CREATOR_VIDEOGRAPHER (Local Jobs) ───
    CREATOR_VIDEOGRAPHER: [
        "VIEW_DASHBOARD",
        "CREATOR_JOB_VIEW",
        "CREATOR_DELIVERY_UPLOAD",
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
        "WITHDRAW_REQUEST",
    ],

    // ─── CREATOR_GRAPHIC_DESIGNER (Digital Products) ───
    CREATOR_GRAPHIC_DESIGNER: [
        "VIEW_DASHBOARD",
        "DIGITAL_PRODUCT_CREATE",
        "DIGITAL_PRODUCT_EDIT",
        "ORDER_VIEW", // digital sales list
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
        "WITHDRAW_REQUEST",
    ],

    // ─── CREATOR_MOCK_DESIGNER (Digital Products) ───
    CREATOR_MOCK_DESIGNER: [
        "VIEW_DASHBOARD",
        "DIGITAL_PRODUCT_CREATE",
        "DIGITAL_PRODUCT_EDIT",
        "ORDER_VIEW", // digital sales list
        "CHAT_VIEW",
        "CHAT_SEND",
        "WALLET_VIEW",
        "WITHDRAW_REQUEST",
    ],

    // ─── AFFILIATE ───
    AFFILIATE: [
        "VIEW_DASHBOARD",
        "AFFILIATE_LINK_CREATE",
        "AFFILIATE_SALES_VIEW",
        "AFFILIATE_EARNINGS_VIEW",
        "AFFILIATE_WITHDRAW_REQUEST",
        "WALLET_VIEW",
    ],
};

/**
 * SYSTEM ROLE → EXTRA POWERS
 * These are additional permissions granted by system role
 * NOT based on account type
 */
export const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
    // ─── OPS ───
    OPS: [
        "VIEW_DASHBOARD",
        "RFQ_VIEW",
        "RFQ_ASSIGN_SUPPLIER",
        "QUOTE_CREATE",
        "QUOTE_VIEW",
        "ORDER_VIEW",
        "SHIPMENT_CREATE",
        "SHIPMENT_UPDATE",
        "DELIVERY_MARK_DELIVERED",
        "POD_UPLOAD",
        "VERIFY_RECOMMEND",
        "CHAT_VIEW",
        "CHAT_SEND",
        "AUDIT_VIEW", // read-only
    ],

    // ─── ADMIN ───
    ADMIN: [
        "VIEW_DASHBOARD",
        "USER_MANAGE",
        "ACCOUNT_MANAGE",
        "VERIFY_ASSIGN",
        "FEATURE_TOGGLE",
        "PRICING_CONFIG",
        "MARKET_CONTROL",
        "TRADE_CONTROL",
        "AUDIT_VIEW",
        "PRODUCT_APPROVE",
        "CHAT_VIEW",
        "WALLET_VIEW",
    ],

    // ─── FINANCE_ADMIN ───
    FINANCE_ADMIN: [
        "VIEW_DASHBOARD",
        "PAYOUT_APPROVE",
        "REFUND_APPROVE",
        "LEDGER_ADJUST",
        "AUDIT_VIEW",
        "WALLET_VIEW",
    ],

    // ─── BUYER (System Role) ───
    BUYER: [
        "VIEW_DASHBOARD",
    ],

    // ─── GROWTH_AGENT ───
    GROWTH_AGENT: [
        "VIEW_DASHBOARD",
        "SUPPLIER_ONBOARD",
        "FIELD_UPLOAD_MEDIA",
        "GROWTH_EARNINGS_VIEW",
    ],

    // ─── GROWTH_MANAGER ───
    GROWTH_MANAGER: [
        "VIEW_DASHBOARD",
        "SUPPLIER_ONBOARD",
        "FIELD_UPLOAD_MEDIA",
        "GROWTH_EARNINGS_VIEW",
        "AUDIT_VIEW", // can see growth stats
    ],
};

/**
 * Get default permissions for account type
 */
export function getAccountPermissions(accountType: AccountType): Permission[] {
    return ACCOUNT_PERMISSIONS[accountType] || [];
}

/**
 * Get role permissions
 */
export function getRolePermissions(role: SystemRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
}
