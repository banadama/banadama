export const PRICING_CONFIG = {
    // Special packaging (service fee) tiers
    specialPackagingTiers: [
        { minQty: 1, maxQty: 100, unitFee: 1000 },
        { minQty: 101, maxQty: 200, unitFee: 980 },
        { minQty: 201, maxQty: 300, unitFee: 950 },
        { minQty: 301, maxQty: 500, unitFee: 930 },
        { minQty: 501, maxQty: 1000, unitFee: 900 },
        { minQty: 1001, maxQty: null, unitFee: 880 }, // null for Infinity
    ],

    fulfillmentRate: 0.052, // 5.2%

    affiliate: {
        signupReward: 50, // ₦50 per signup
        supplierVerifyReward: 100, // ₦100 per verified supplier
        saleCommissionRateMin: 0.01, // 1%
        saleCommissionRateMax: 0.03, // 3%
    },

    b2cBangladesh: {
        processingFeeMin: 500,
        processingFeeMax: 1000,
        defaultDuty: 0.12,
    },

    dutyRates: {
        clothing: 0.07,
        shoes: 0.07,
        electronics: 0.10,
        industrial: 0.15,
        default: 0.10,
    } as Record<string, number>,

    delivery: {
        lagos: { min: 1500, max: 2500 },
        southwest: { min: 2000, max: 3500 },
        north: { min: 3000, max: 6000 },
        east: { min: 2500, max: 5000 },
        default: { min: 3000, max: 5000 },
    } as Record<string, { min: number; max: number }>,
};
