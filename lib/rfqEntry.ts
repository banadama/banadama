// lib/rfqEntry.ts - RFQ entry helpers
import { loginRedirect } from "@/lib/authRedirect";

/**
 * Generate RFQ form entry href with product prefill
 */
export function rfqEntryHref(productId: string) {
    return `/buyer/requests/new?productId=${encodeURIComponent(productId)}`;
}

/**
 * Generate login-gated RFQ entry href
 */
export function rfqLoginGateHref(productId: string) {
    return loginRedirect(rfqEntryHref(productId));
}
