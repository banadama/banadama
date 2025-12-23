// lib/auth/permissions.types.ts - Permission Types (LOCKED)

/**
 * ALL PERMISSIONS - Single source of truth
 */
export type Permission =
    // Dashboard
    | "VIEW_DASHBOARD"

    // Marketplace / Products
    | "PRODUCT_CREATE"
    | "PRODUCT_EDIT"
    | "PRODUCT_HIDE"
    | "PRODUCT_APPROVE"

    // RFQ / Quotes
    | "RFQ_CREATE"
    | "RFQ_VIEW"
    | "RFQ_ASSIGN_SUPPLIER"
    | "QUOTE_CREATE"
    | "QUOTE_VIEW"
    | "QUOTE_CONFIRM"

    // Orders / Production / Status
    | "ORDER_VIEW"
    | "ORDER_STATUS_UPDATE"
    | "PRODUCTION_STATUS_UPDATE"
    | "DELIVERY_MARK_DELIVERED"

    // Logistics
    | "SHIPMENT_CREATE"
    | "SHIPMENT_UPDATE"
    | "POD_UPLOAD"

    // Chat
    | "CHAT_VIEW"
    | "CHAT_SEND"

    // Wallet / Finance
    | "WALLET_VIEW"
    | "WITHDRAW_REQUEST"
    | "PAYOUT_APPROVE"
    | "REFUND_APPROVE"
    | "LEDGER_ADJUST"

    // Verification / Trust
    | "VERIFY_RECOMMEND"
    | "VERIFY_ASSIGN"

    // Admin Studio / Settings
    | "USER_MANAGE"
    | "ACCOUNT_MANAGE"
    | "FEATURE_TOGGLE"
    | "PRICING_CONFIG"
    | "MARKET_CONTROL"
    | "TRADE_CONTROL"
    | "AUDIT_VIEW"

    // Growth
    | "SUPPLIER_ONBOARD"
    | "FIELD_UPLOAD_MEDIA"
    | "GROWTH_EARNINGS_VIEW"

    // Creators
    | "CREATOR_JOB_VIEW"
    | "CREATOR_DELIVERY_UPLOAD"
    | "DIGITAL_PRODUCT_CREATE"
    | "DIGITAL_PRODUCT_EDIT"

    // Affiliate
    | "AFFILIATE_LINK_CREATE"
    | "AFFILIATE_SALES_VIEW"
    | "AFFILIATE_EARNINGS_VIEW"
    | "AFFILIATE_WITHDRAW_REQUEST";

/**
 * Permission Groups - for UI display
 */
export const PERMISSION_GROUPS = {
    dashboard: ["VIEW_DASHBOARD"],
    products: ["PRODUCT_CREATE", "PRODUCT_EDIT", "PRODUCT_HIDE", "PRODUCT_APPROVE"],
    rfq: ["RFQ_CREATE", "RFQ_VIEW", "RFQ_ASSIGN_SUPPLIER", "QUOTE_CREATE", "QUOTE_VIEW", "QUOTE_CONFIRM"],
    orders: ["ORDER_VIEW", "ORDER_STATUS_UPDATE", "PRODUCTION_STATUS_UPDATE", "DELIVERY_MARK_DELIVERED"],
    logistics: ["SHIPMENT_CREATE", "SHIPMENT_UPDATE", "POD_UPLOAD"],
    chat: ["CHAT_VIEW", "CHAT_SEND"],
    wallet: ["WALLET_VIEW", "WITHDRAW_REQUEST", "PAYOUT_APPROVE", "REFUND_APPROVE", "LEDGER_ADJUST"],
    verification: ["VERIFY_RECOMMEND", "VERIFY_ASSIGN"],
    admin: ["USER_MANAGE", "ACCOUNT_MANAGE", "FEATURE_TOGGLE", "PRICING_CONFIG", "MARKET_CONTROL", "TRADE_CONTROL", "AUDIT_VIEW"],
    growth: ["SUPPLIER_ONBOARD", "FIELD_UPLOAD_MEDIA", "GROWTH_EARNINGS_VIEW"],
    creators: ["CREATOR_JOB_VIEW", "CREATOR_DELIVERY_UPLOAD", "DIGITAL_PRODUCT_CREATE", "DIGITAL_PRODUCT_EDIT"],
    affiliate: ["AFFILIATE_LINK_CREATE", "AFFILIATE_SALES_VIEW", "AFFILIATE_EARNINGS_VIEW", "AFFILIATE_WITHDRAW_REQUEST"],
} as const;
