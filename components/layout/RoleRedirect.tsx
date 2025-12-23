// components/layout/RoleRedirect.tsx
// Server component helper for role-based redirects

import { redirect } from "next/navigation";
import { getCurrentUser, getRoleDashboard } from "@/lib/auth";

/**
 * RoleRedirect - Server component that redirects unauthenticated users
 * or redirects authenticated users to their role-based dashboard
 * 
 * Use this on public pages or landing page to automatically
 * redirect logged-in users to their dashboard
 * 
 * @example
 * ```tsx
 * // In app/page.tsx (home page)
 * import { RoleRedirect } from "@/components/layout/RoleRedirect";
 * 
 * export default async function HomePage() {
 *   await RoleRedirect({ ifAuthenticated: true });
 *   // rest of your public page code
 * }
 * ```
 */
export async function RoleRedirect({
    ifAuthenticated = false,
    customPath,
}: {
    /** If true, redirects authenticated users to their role dashboard */
    ifAuthenticated?: boolean;
    /** Custom redirect path (overrides role-based redirect) */
    customPath?: string;
}) {
    const user = await getCurrentUser();

    if (user && ifAuthenticated) {
        // User is logged in, redirect to their dashboard
        const targetPath = customPath || getRoleDashboard(user.role);
        redirect(targetPath);
    }

    if (!user && !ifAuthenticated) {
        // User is not logged in, redirect to login
        redirect("/auth/login");
    }

    // If neither condition is met, do nothing (allow through)
    return null;
}
