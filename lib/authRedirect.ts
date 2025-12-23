// lib/authRedirect.ts - Auth redirect helper (client-safe)

/**
 * Generate login redirect URL with next path
 */
export function loginRedirect(nextPath: string) {
    const enc = encodeURIComponent(nextPath);
    return `/auth/login?next=${enc}`;
}
