// lib/auth/require.ts - Server-Side Auth Requirements for API Routes
import { NextResponse } from "next/server";
import { getSession, hasRole, hasAccountType, hasPermission } from "./session";
import { AuthSession, SystemRole, AccountType } from "./session.types";
import { Permission } from "./permissions.types";
import { checkPermission, checkAnyPermission, checkAllPermissions } from "./permissions";

type AuthResult =
    | { success: true; session: AuthSession }
    | { success: false; response: NextResponse };

/**
 * Require authentication for API route
 */
export async function requireAuth(): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    return { success: true, session };
}

/**
 * Require specific system role
 */
export async function requireRole(role: SystemRole): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    // ADMIN can access everything
    if (session.user.role === "ADMIN") {
        return { success: true, session };
    }

    if (!hasRole(session, role)) {
        return {
            success: false,
            response: NextResponse.json(
                { error: "Forbidden: Insufficient role" },
                { status: 403 }
            ),
        };
    }

    return { success: true, session };
}

/**
 * Require specific account type
 */
export async function requireAccountType(type: AccountType): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (!hasAccountType(session, type)) {
        return {
            success: false,
            response: NextResponse.json(
                { error: "Forbidden: Wrong account type" },
                { status: 403 }
            ),
        };
    }

    return { success: true, session };
}

/**
 * Require any of the given account types
 */
export async function requireAnyAccountType(
    types: AccountType[]
): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    const hasType = types.some((type) => hasAccountType(session, type));

    if (!hasType) {
        return {
            success: false,
            response: NextResponse.json(
                { error: "Forbidden: Wrong account type" },
                { status: 403 }
            ),
        };
    }

    return { success: true, session };
}

/**
 * Require specific permission (effective = account + role)
 */
export async function requirePermission(
    permission: Permission
): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (!checkPermission(session, permission)) {
        return {
            success: false,
            response: NextResponse.json(
                { error: `Forbidden: Missing permission ${permission}` },
                { status: 403 }
            ),
        };
    }

    return { success: true, session };
}

/**
 * Require ANY of the given permissions
 */
export async function requireAnyPermission(
    permissions: Permission[]
): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (!checkAnyPermission(session, permissions)) {
        return {
            success: false,
            response: NextResponse.json(
                { error: "Forbidden: Missing required permission" },
                { status: 403 }
            ),
        };
    }

    return { success: true, session };
}

/**
 * Require ALL of the given permissions
 */
export async function requireAllPermissions(
    permissions: Permission[]
): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (!checkAllPermissions(session, permissions)) {
        return {
            success: false,
            response: NextResponse.json(
                { error: "Forbidden: Missing required permissions" },
                { status: 403 }
            ),
        };
    }

    return { success: true, session };
}

/**
 * Require Ops role
 */
export async function requireOps(): Promise<AuthResult> {
    return requireRole("OPS");
}

/**
 * Require Admin role
 */
export async function requireAdmin(): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "FINANCE_ADMIN") {
        return {
            success: false,
            response: NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            ),
        };
    }

    return { success: true, session };
}

/**
 * Require Finance Admin role
 */
export async function requireFinanceAdmin(): Promise<AuthResult> {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "FINANCE_ADMIN") {
        return {
            success: false,
            response: NextResponse.json(
                { error: "Forbidden: Finance admin access required" },
                { status: 403 }
            ),
        };
    }

    return { success: true, session };
}

/**
 * Require supplier (any company type)
 */
export async function requireSupplier(): Promise<AuthResult> {
    return requireAnyAccountType([
        "COMPANY_FACTORY",
        "COMPANY_WHOLESALER",
        "COMPANY_RETAIL",
    ]);
}

/**
 * Require creator (any creator type)
 */
export async function requireCreator(): Promise<AuthResult> {
    return requireAnyAccountType([
        "CREATOR_MODEL",
        "CREATOR_GRAPHIC_DESIGNER",
        "CREATOR_MOCK_DESIGNER",
        "CREATOR_PHOTOGRAPHER",
        "CREATOR_VIDEOGRAPHER",
    ]);
}

// ─── PERMISSION-SPECIFIC SHORTCUTS ───

/** Require ability to create products */
export async function requireProductCreate(): Promise<AuthResult> {
    return requirePermission("PRODUCT_CREATE");
}

/** Require ability to create RFQ */
export async function requireRfqCreate(): Promise<AuthResult> {
    return requirePermission("RFQ_CREATE");
}

/** Require ability to create quotes (Ops only) */
export async function requireQuoteCreate(): Promise<AuthResult> {
    return requirePermission("QUOTE_CREATE");
}

/** Require ability to approve payouts (Finance only) */
export async function requirePayoutApprove(): Promise<AuthResult> {
    return requirePermission("PAYOUT_APPROVE");
}

/** Require ability to approve refunds (Finance only) */
export async function requireRefundApprove(): Promise<AuthResult> {
    return requirePermission("REFUND_APPROVE");
}

/** Require ability to assign verification ticks (Admin only) */
export async function requireVerifyAssign(): Promise<AuthResult> {
    return requirePermission("VERIFY_ASSIGN");
}

/** Require ability to manage users (Admin only) */
export async function requireUserManage(): Promise<AuthResult> {
    return requirePermission("USER_MANAGE");
}
