// lib/affiliate-utils.ts

import type { AffiliateStats, EarningsBreakdown } from '@/types/affiliate';

/**
 * Calculate affiliate earnings breakdown based on stats
 * 
 * Earnings logic:
 * - ₦50 per signup
 * - % commission per sale (1-3% of total sales value)
 * - ₦100 per verified supplier
 */
export function calculateEarnings(stats: AffiliateStats): EarningsBreakdown {
    const SIGNUP_RATE = 50; // ₦50 per signup
    const SUPPLIER_BONUS = 100; // ₦100 per verified supplier

    const signupEarnings = stats.totalSignups * SIGNUP_RATE;
    const salesCommission = Math.round(stats.totalSalesValue * stats.avgCommissionRate);
    const supplierBonus = stats.suppliersVerified * SUPPLIER_BONUS;
    const totalEarnings = signupEarnings + salesCommission + supplierBonus;

    return {
        signupEarnings,
        salesCommission,
        supplierBonus,
        totalEarnings,
    };
}

/**
 * Format naira amount for display
 */
export function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString()}`;
}

/**
 * Convert kobo to naira
 */
export function koboToNaira(kobo: number): number {
    return kobo / 100;
}

/**
 * Convert naira to kobo
 */
export function nairaToKobo(naira: number): number {
    return Math.round(naira * 100);
}
