// lib/auth/session.types.ts - Auth Session Types (LOCKED)

/**
 * VERIFICATION LEVELS (TICKS)
 */
export type VerificationLevel = "NONE" | "GREEN_TICK" | "BLUE_TICK";

/**
 * SYSTEM ROLES - Controls route access like /admin, /ops
 */
export type SystemRole =
    | "ADMIN"
    | "FINANCE_ADMIN"
    | "OPS"
    | "BUYER"
    | "GROWTH_AGENT"
    | "GROWTH_MANAGER";

/**
 * ACCOUNT TYPES - Controls feature access
 */
export type AccountType =
    | "BUYER"
    | "COMPANY_FACTORY"
    | "COMPANY_WHOLESALER"
    | "COMPANY_RETAIL"
    | "CREATOR_MODEL"
    | "CREATOR_GRAPHIC_DESIGNER"
    | "CREATOR_MOCK_DESIGNER"
    | "CREATOR_PHOTOGRAPHER"
    | "CREATOR_VIDEOGRAPHER"
    | "AFFILIATE";

/**
 * COUNTRY SCOPE
 */
export type CountryScope = "NG" | "BD" | "GLOBAL";

/**
 * VERIFICATION INFO
 */
export interface VerificationInfo {
    level: VerificationLevel;
    verifiedAt?: string;
}

/**
 * ACTIVE ACCOUNT
 */
export interface ActiveAccount {
    id: string;
    type: AccountType;
    name: string;
    country: CountryScope;
    verification: VerificationInfo;
    permissions: string[];
}

/**
 * SESSION USER
 */
export interface SessionUser {
    id: string;
    email: string;
    name?: string;
    role: SystemRole;
    accountIds: string[];
}

/**
 * AUTH SESSION - Single Source of Truth
 * 
 * Stored in httpOnly cookie as JWT (prod) or JSON (dev)
 */
export interface AuthSession {
    user: SessionUser;
    activeAccount: ActiveAccount;
    issuedAt: number;
    expiresAt: number;
}

/**
 * Session Cookie Config
 */
export const SESSION_COOKIE_NAME = "banadama_session";

export const SESSION_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
};
