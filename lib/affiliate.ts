// Core Affiliate Logic

import { ConversionType } from "@/types/affiliate";
import {
    AFFILIATE_CONFIG,
    calculateSaleCommission,
    nairaToKobo,
} from "@/config/affiliate";

/**
 * Calculate commission for a signup conversion
 * @returns Commission amount in kobo
 */
export function calculateSignupCommission(): number {
    return AFFILIATE_CONFIG.SIGNUP_COMMISSION;
}

/**
 * Calculate commission for a verified supplier
 * @returns Commission amount in kobo
 */
export function calculateVerifiedSupplierCommission(): number {
    return AFFILIATE_CONFIG.VERIFIED_SUPPLIER_COMMISSION;
}

/**
 * Calculate commission based on conversion type and amount
 * @param type - Type of conversion
 * @param amount - Sale amount in kobo (only for SALE type)
 * @returns Commission details
 */
export function calculateCommission(
    type: ConversionType,
    amount?: number
): {
    commission: number;
    rate?: number;
    tier?: string;
} {
    switch (type) {
        case ConversionType.SIGNUP:
            return {
                commission: calculateSignupCommission(),
            };

        case ConversionType.VERIFIED_SUPPLIER:
            return {
                commission: calculateVerifiedSupplierCommission(),
            };

        case ConversionType.SALE:
            if (!amount || amount <= 0) {
                throw new Error("Sale amount is required for SALE conversion type");
            }
            return calculateSaleCommission(amount);

        default:
            throw new Error(`Unknown conversion type: ${type}`);
    }
}

/**
 * Sum total earnings for an affiliate
 * @param conversions - Array of conversions
 * @returns Total earnings in kobo
 */
export function sumAffiliateEarnings(
    conversions: Array<{ commissionAmount: number }>
): number {
    return conversions.reduce((total, conv) => total + conv.commissionAmount, 0);
}

/**
 * Sum pending (unpaid) earnings
 * @param conversions - Array of conversions
 * @returns Pending earnings in kobo
 */
export function sumPendingEarnings(
    conversions: Array<{ commissionAmount: number; paid: boolean }>
): number {
    return conversions
        .filter((conv) => !conv.paid)
        .reduce((total, conv) => total + conv.commissionAmount, 0);
}

/**
 * Sum paid earnings
 * @param conversions - Array of conversions
 * @returns Paid earnings in kobo
 */
export function sumPaidEarnings(
    conversions: Array<{ commissionAmount: number; paid: boolean }>
): number {
    return conversions
        .filter((conv) => conv.paid)
        .reduce((total, conv) => total + conv.commissionAmount, 0);
}

/**
 * Calculate conversion rate
 * @param clicks - Total clicks
 * @param conversions - Total conversions
 * @returns Conversion rate as percentage (0-100)
 */
export function calculateConversionRate(
    clicks: number,
    conversions: number
): number {
    if (clicks === 0) return 0;
    return (conversions / clicks) * 100;
}

/**
 * Calculate average commission per sale
 * @param totalCommission - Total commission in kobo
 * @param totalSales - Total number of sales
 * @returns Average commission per sale in kobo
 */
export function calculateAverageCommission(
    totalCommission: number,
    totalSales: number
): number {
    if (totalSales === 0) return 0;
    return Math.floor(totalCommission / totalSales);
}

/**
 * Check if affiliate can request payout
 * @param pendingEarnings - Pending earnings in kobo
 * @returns true if can request payout
 */
export function canRequestPayout(pendingEarnings: number): boolean {
    return pendingEarnings >= AFFILIATE_CONFIG.MINIMUM_PAYOUT;
}

/**
 * Generate unique affiliate link slug
 * @param baseName - Base name for the slug
 * @param existingSlugs - Array of existing slugs to avoid duplicates
 * @returns Unique slug
 */
export function generateUniqueSlug(
    baseName: string,
    existingSlugs: string[]
): string {
    // Sanitize base name
    let slug = baseName
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    // Ensure minimum length
    if (slug.length < AFFILIATE_CONFIG.LINK_SLUG_MIN_LENGTH) {
        slug = `link-${slug}`;
    }

    // Check for uniqueness
    let finalSlug = slug;
    let counter = 1;

    while (existingSlugs.includes(finalSlug)) {
        finalSlug = `${slug}-${counter}`;
        counter++;
    }

    return finalSlug;
}

/**
 * Get commission tier description
 * @param saleAmount - Sale amount in kobo
 * @returns Tier description
 */
export function getCommissionTierDescription(saleAmount: number): string {
    const { TIER_THRESHOLDS, SALE_COMMISSION_TIERS } = AFFILIATE_CONFIG;

    if (saleAmount <= TIER_THRESHOLDS.TIER_1_MAX) {
        return `Tier 1: ${SALE_COMMISSION_TIERS.TIER_1 * 100}% commission`;
    } else if (saleAmount <= TIER_THRESHOLDS.TIER_2_MAX) {
        return `Tier 2: ${SALE_COMMISSION_TIERS.TIER_2 * 100}% commission`;
    } else {
        return `Tier 3: ${SALE_COMMISSION_TIERS.TIER_3 * 100}% commission`;
    }
}

/**
 * Format conversion type for display
 * @param type - Conversion type
 * @returns Formatted string
 */
export function formatConversionType(type: ConversionType): string {
    switch (type) {
        case ConversionType.SIGNUP:
            return "New Signup";
        case ConversionType.SALE:
            return "Sale Commission";
        case ConversionType.VERIFIED_SUPPLIER:
            return "Verified Supplier";
        default:
            return type;
    }
}
