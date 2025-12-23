// lib/affiliateCommission.ts

/**
 * Commission tier configuration for affiliate sales
 * 
 * Decide commission tier & rate based on order amount.
 * Thresholds are in Naira (NGN).
 * 
 * - SMALL  < ₦100,000  → 1%
 * - MEDIUM ₦100k–₦500k → 2%
 * - LARGE  >= ₦500k    → 3%
 */

export interface CommissionTier {
    tier: 'SMALL' | 'MEDIUM' | 'LARGE';
    rate: number;
}

/**
 * Calculate affiliate commission rate based on order amount
 * 
 * @param orderAmount - Order total in Naira (not kobo)
 * @returns Commission tier and rate
 */
export function getAffiliateCommissionRate(orderAmount: number): CommissionTier {
    if (orderAmount >= 500_000) {
        return { tier: 'LARGE', rate: 0.03 }; // 3%
    }
    if (orderAmount >= 100_000) {
        return { tier: 'MEDIUM', rate: 0.02 }; // 2%
    }
    return { tier: 'SMALL', rate: 0.01 }; // 1%
}

/**
 * Calculate commission amount in kobo (smallest unit)
 * 
 * @param orderAmountKobo - Order total in kobo
 * @returns Object with tier, rate, and commission amount in kobo
 */
export function calculateCommission(orderAmountKobo: number): {
    tier: CommissionTier['tier'];
    rate: number;
    commissionKobo: number;
    commissionNaira: number;
} {
    // Convert kobo to naira for tier calculation
    const orderAmountNaira = orderAmountKobo / 100;

    const { tier, rate } = getAffiliateCommissionRate(orderAmountNaira);

    const commissionKobo = Math.round(orderAmountKobo * rate);
    const commissionNaira = commissionKobo / 100;

    return {
        tier,
        rate,
        commissionKobo,
        commissionNaira,
    };
}

/**
 * Format commission tier for display
 */
export function formatCommissionTier(tier: CommissionTier['tier']): string {
    const labels = {
        SMALL: 'Small Order (1%)',
        MEDIUM: 'Medium Order (2%)',
        LARGE: 'Large Order (3%)',
    };
    return labels[tier];
}
