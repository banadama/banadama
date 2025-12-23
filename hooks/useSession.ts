// hooks/useSession.ts - Client-side Session & Permission Hooks
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { AuthSession, ActiveAccount, SystemRole, AccountType } from "@/lib/auth/session.types";
import type { Permission } from "@/lib/auth/permissions.types";
import { ROLE_PERMISSIONS } from "@/lib/auth/permissions.matrix";

type SessionState = {
    session: AuthSession | null;
    loading: boolean;
    error: string | null;
};

/**
 * Hook to get current session on client
 */
export function useSession() {
    const [state, setState] = useState<SessionState>({
        session: null,
        loading: true,
        error: null,
    });

    const fetchSession = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");

            if (!res.ok) {
                setState({ session: null, loading: false, error: null });
                return;
            }

            const data = await res.json();
            setState({
                session: data as AuthSession,
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error("Session fetch error:", error);
            setState({
                session: null,
                loading: false,
                error: "Failed to load session",
            });
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    const refresh = useCallback(() => {
        setState((s) => ({ ...s, loading: true }));
        fetchSession();
    }, [fetchSession]);

    return {
        ...state,
        refresh,
        isAuthenticated: !!state.session,
        user: state.session?.user,
        activeAccount: state.session?.activeAccount,
    };
}

/**
 * Hook to switch account
 */
export function useAccountSwitch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const switchAccount = useCallback(async (accountId: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/switch-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to switch account");
            }

            const data = await res.json();

            // Reload page to refresh session
            window.location.reload();

            return data.activeAccount as ActiveAccount;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { switchAccount, loading, error };
}

/**
 * Hook to check permissions (effective = account + role)
 */
export function usePermissions() {
    const { session } = useSession();

    // Calculate effective permissions
    const effectivePermissions = useMemo(() => {
        if (!session) return [] as Permission[];

        const accountPerms = (session.activeAccount.permissions || []) as Permission[];
        const rolePerms = (ROLE_PERMISSIONS[session.user.role] || []) as Permission[];

        // Union of both, deduplicated
        const allPerms = new Set([...accountPerms, ...rolePerms]);
        return Array.from(allPerms);
    }, [session]);

    const can = useCallback(
        (permission: Permission): boolean => {
            if (!session) return false;

            // ADMIN has all permissions
            if (session.user.role === "ADMIN") return true;

            return effectivePermissions.includes(permission);
        },
        [session, effectivePermissions]
    );

    const canAny = useCallback(
        (permissions: Permission[]): boolean => {
            if (!session) return false;

            // ADMIN has all permissions
            if (session.user.role === "ADMIN") return true;

            return permissions.some((p) => effectivePermissions.includes(p));
        },
        [session, effectivePermissions]
    );

    const canAll = useCallback(
        (permissions: Permission[]): boolean => {
            if (!session) return false;

            // ADMIN has all permissions
            if (session.user.role === "ADMIN") return true;

            return permissions.every((p) => effectivePermissions.includes(p));
        },
        [session, effectivePermissions]
    );

    const hasRole = useCallback(
        (role: SystemRole): boolean => {
            if (!session) return false;
            return session.user.role === role;
        },
        [session]
    );

    const hasAccountType = useCallback(
        (type: AccountType): boolean => {
            if (!session) return false;
            return session.activeAccount.type === type;
        },
        [session]
    );

    const isVerified = useCallback(
        (level?: "GREEN_TICK" | "BLUE_TICK"): boolean => {
            if (!session) return false;
            const currentLevel = session.activeAccount.verification.level;

            if (!level) return currentLevel !== "NONE";
            if (level === "GREEN_TICK") {
                return currentLevel === "GREEN_TICK" || currentLevel === "BLUE_TICK";
            }
            return currentLevel === "BLUE_TICK";
        },
        [session]
    );

    const isAdmin = useMemo(() => session?.user.role === "ADMIN", [session]);
    const isOps = useMemo(() => session?.user.role === "OPS", [session]);
    const isFinanceAdmin = useMemo(() => session?.user.role === "FINANCE_ADMIN", [session]);
    const isBuyer = useMemo(() => session?.activeAccount.type === "BUYER", [session]);
    const isSupplier = useMemo(() => {
        const type = session?.activeAccount.type;
        return type === "COMPANY_FACTORY" || type === "COMPANY_WHOLESALER" || type === "COMPANY_RETAIL";
    }, [session]);
    const isCreator = useMemo(() => {
        const type = session?.activeAccount.type;
        return type?.startsWith("CREATOR_") || false;
    }, [session]);

    return {
        can,
        canAny,
        canAll,
        hasRole,
        hasAccountType,
        isVerified,
        effectivePermissions,
        // Shortcuts
        isAdmin,
        isOps,
        isFinanceAdmin,
        isBuyer,
        isSupplier,
        isCreator,
    };
}

/**
 * Component to conditionally render based on permission
 */
export function Can({
    permission,
    children,
    fallback = null,
}: {
    permission: Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { can } = usePermissions();

    if (can(permission)) {
        return children;
    }

    return fallback;
}

/**
 * Component to conditionally render based on role
 */
export function HasRole({
    role,
    children,
    fallback = null,
}: {
    role: SystemRole;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { hasRole } = usePermissions();

    if (hasRole(role)) {
        return children;
    }

    return fallback;
}

/**
 * Component to conditionally render based on verification
 */
export function IsVerified({
    level,
    children,
    fallback = null,
}: {
    level?: "GREEN_TICK" | "BLUE_TICK";
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { isVerified } = usePermissions();

    if (isVerified(level)) {
        return children;
    }

    return fallback;
}
