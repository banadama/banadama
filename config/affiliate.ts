// config/affiliate.ts - Affiliate system configuration

export const AFFILIATE_CONFIG = {
    // Commission rates (sales-only model)
    commissionRates: {
        sale: 0.02, // 2% of order value
        verifiedSupplier: 500000, // ₦5,000 flat per verified supplier
    },

    // Minimum payout threshold
    minPayoutAmount: 1000000, // ₦10,000

    // Payout schedule
    payoutSchedule: {
        processingDays: [1, 15], // 1st and 15th of each month
        minDaysSinceConversion: 30, // Wait 30 days after conversion
    },

    // Cookie/tracking settings
    tracking: {
        cookieExpiryDays: 30, // Track for 30 days
        attributionWindow: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    },

    // Link generation
    linkPrefix: 'aff',
    customSlugPattern: /^[a-z0-9-]{3,20}$/,

    // Performance tiers (optional future use)
    tiers: [
        {
            name: 'Bronze',
            minSales: 0,
            maxSales: 10,
            bonusRate: 0, // No bonus
        },
        {
            name: 'Silver',
            minSales: 11,
            maxSales: 50,
            bonusRate: 0.002, // Additional 0.2%
        },
        {
            name: 'Gold',
            minSales: 51,
            maxSales: Infinity,
            bonusRate: 0.005, // Additional 0.5%
        },
    ],

    // Restrictions
    restrictions: {
        maxLinksPerAffiliate: 10,
        requireVerification: false, // MVP: false, later: true
        allowSelfReferral: false,
    },
};

/**
 * Calculate commission for a sale
 */
export function calculateSaleCommission(orderValue: number): number {
    return Math.round(orderValue * AFFILIATE_CONFIG.commissionRates.sale);
}

/**
 * Calculate commission for verified supplier
 */
export function calculateSupplierCommission(): number {
    return AFFILIATE_CONFIG.commissionRates.verifiedSupplier;
}

/**
 * Check if affiliate can request payout
 */
export function canRequestPayout(
    totalEarnings: number,
    pendingPayouts: number
): boolean {
    const availableBalance = totalEarnings - pendingPayouts;
    return availableBalance >= AFFILIATE_CONFIG.minPayoutAmount;
}

/**
 * Get performance tier based on sales count
 */
export function getPerformanceTier(salesCount: number) {
    return AFFILIATE_CONFIG.tiers.find(
        (tier) => salesCount >= tier.minSales && salesCount <= tier.maxSales
    );
}

/**
 * Validate affiliate slug
 */
export function isValidAffiliateSlug(slug: string): boolean {
    return AFFILIATE_CONFIG.customSlugPattern.test(slug);
}

/**
 * Check if conversion is within attribution window
 */
export function isWithinAttributionWindow(clickedAt: Date): boolean {
    const now = Date.now();
    const clickTime = new Date(clickedAt).getTime();
    const diff = now - clickTime;
    return diff <= AFFILIATE_CONFIG.tracking.attributionWindow;
}
