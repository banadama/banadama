// lib/auth/session.ts - Session Management

import { cookies } from "next/headers";
import {
    AuthSession,
    SESSION_COOKIE_NAME,
    SESSION_COOKIE_OPTIONS,
    SystemRole,
    AccountType,
    ActiveAccount,
} from "./session.types";

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<AuthSession | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

        if (!sessionCookie?.value) {
            return null;
        }

        // In production, this would verify JWT signature
        // For now, parse as JSON
        const session: AuthSession = JSON.parse(sessionCookie.value);

        // Check expiration
        if (session.expiresAt < Date.now()) {
            return null;
        }

        return session;
    } catch (error) {
        console.error("Session parse error:", error);
        return null;
    }
}

/**
 * Set session cookie
 */
export async function setSession(session: AuthSession): Promise<void> {
    const cookieStore = await cookies();

    // In production, this would sign as JWT
    const value = JSON.stringify(session);

    cookieStore.set(SESSION_COOKIE_NAME, value, SESSION_COOKIE_OPTIONS);
}

/**
 * Delete session cookie
 */
export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Update active account in session
 */
export async function updateActiveAccount(
    newAccount: ActiveAccount
): Promise<AuthSession | null> {
    const session = await getSession();
    if (!session) return null;

    // Verify user owns this account
    if (!session.user.accountIds.includes(newAccount.id)) {
        throw new Error("User does not own this account");
    }

    const updatedSession: AuthSession = {
        ...session,
        activeAccount: newAccount,
        issuedAt: Date.now(),
    };

    await setSession(updatedSession);
    return updatedSession;
}

/**
 * Check if user has system role
 */
export function hasRole(session: AuthSession | null, role: SystemRole): boolean {
    if (!session) return false;
    return session.user.role === role;
}

/**
 * Check if current account is of type
 */
export function hasAccountType(
    session: AuthSession | null,
    type: AccountType
): boolean {
    if (!session) return false;
    return session.activeAccount.type === type;
}

/**
 * Check if account has permission
 */
export function hasPermission(
    session: AuthSession | null,
    permission: string
): boolean {
    if (!session) return false;
    return session.activeAccount.permissions.includes(permission);
}

/**
 * Check verification level
 */
export function hasVerification(
    session: AuthSession | null,
    level: "GREEN_TICK" | "BLUE_TICK"
): boolean {
    if (!session) return false;
    const currentLevel = session.activeAccount.verification.level;

    if (level === "GREEN_TICK") {
        return currentLevel === "GREEN_TICK" || currentLevel === "BLUE_TICK";
    }

    return currentLevel === "BLUE_TICK";
}
