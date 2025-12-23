// lib/pricing.ts
import {
    FullPricingInput,
    FullPricingBreakdown,
    SpecialPackagingTier,
    FulfillmentFeeInput,
    FulfillmentFeeOutput,
    AffiliateEarningInput,
    AffiliateEarning,
    DutyInput,
    DutyResult,
    DeliveryInput,
    DeliveryResult,
} from "@/types/pricing";

// 1. Special packaging tiers
const SPECIAL_PACKAGING_TIERS: SpecialPackagingTier[] = [
    { minQty: 1, maxQty: 100, feePerUnit: 1000 },
    { minQty: 101, maxQty: 200, feePerUnit: 980 },
    { minQty: 201, maxQty: 300, feePerUnit: 950 },
    { minQty: 301, maxQty: 500, feePerUnit: 930 },
    { minQty: 501, maxQty: 1000, feePerUnit: 900 },
    { minQty: 1001, maxQty: null, feePerUnit: 880 }, // custom/high volume
];

export function getSpecialPackagingFeePerUnit(quantity: number): number {
    const tier = SPECIAL_PACKAGING_TIERS.find((t) => {
        const fitsMin = quantity >= t.minQty;
        const fitsMax = t.maxQty === null ? true : quantity <= t.maxQty;
        return fitsMin && fitsMax;
    });

    return tier?.feePerUnit ?? 1000;
}

// 2. Fulfillment 5.2%
export function calculateFulfillmentFee(
    input: FulfillmentFeeInput
): FulfillmentFeeOutput {
    const rate = 0.052;
    const amount = Math.round(input.orderValue * rate);
    return { rate, amount };
}

// 3. Affiliate earnings (cost to platform)
export function calculateAffiliateEarning(
    input: AffiliateEarningInput & { orderValue: number }
): AffiliateEarning {
    if (!input.hasAffiliate) {
        return {
            perSignup: 50,
            perSalePercent: 0,
            perSupplierVerify: input.hasSupplierReferral ? 100 : 0,
            estimatedSaleCommission: 0,
            totalAffiliateCost: input.hasSupplierReferral ? 100 : 0,
        };
    }

    let perSalePercent = 0.01; // default small
    if (input.orderSize === "MEDIUM") perSalePercent = 0.02;
    if (input.orderSize === "LARGE") perSalePercent = 0.03;

    const perSignup = 50;
    const supplierVerify = input.hasSupplierReferral ? 100 : 0;
    const estimatedSaleCommission = Math.round(input.orderValue * perSalePercent);

    const totalAffiliateCost =
        perSignup + supplierVerify + estimatedSaleCommission;

    return {
        perSignup,
        perSalePercent,
        perSupplierVerify: supplierVerify,
        estimatedSaleCommission,
        totalAffiliateCost,
    };
}

// 4. Duty
export function calculateDuty(input: DutyInput): DutyResult {
    let rate = 0.07;
    if (input.dutyCategory === "ELECTRONICS") rate = 0.1;
    if (input.dutyCategory === "INDUSTRIAL") rate = 0.15;

    const amount = Math.round(input.orderValue * rate);
    return { rate, amount };
}

// 5. Delivery (rough ranges)
export function calculateDelivery(
    input: DeliveryInput
): DeliveryResult {
    switch (input.region) {
        case "LAGOS":
            return { base: 2000, estimatedRange: [1500, 2500] };
        case "SOUTH_WEST":
            return { base: 2500, estimatedRange: [2000, 3500] };
        case "NORTH":
            return { base: 4000, estimatedRange: [3000, 6000] };
        case "EAST":
            return { base: 3500, estimatedRange: [2500, 5000] };
        default:
            return { base: 3000, estimatedRange: [2000, 4500] };
    }
}

// 6. FULL PRICING
export function calculateFullPricing(
    input: FullPricingInput
): FullPricingBreakdown {
    const productTotal = input.unitPrice * input.quantity;

    const specialPackagingFeePerUnit = getSpecialPackagingFeePerUnit(
        input.quantity
    );
    const specialPackagingTotal = specialPackagingFeePerUnit * input.quantity;

    const fulfillment = calculateFulfillmentFee({ orderValue: productTotal });

    const orderSize: "SMALL" | "MEDIUM" | "LARGE" =
        productTotal < 50000
            ? "SMALL"
            : productTotal < 300000
                ? "MEDIUM"
                : "LARGE";

    const affiliate = calculateAffiliateEarning({
        orderSize,
        hasAffiliate: input.hasAffiliate,
        hasSupplierReferral: input.hasSupplierReferral,
        orderValue: productTotal,
    });

    const duty = calculateDuty({
        dutyCategory: input.dutyCategory,
        orderValue: productTotal,
    });

    const delivery = calculateDelivery({ region: input.region });

    // for now, no discounts
    const discounts = 0;

    const grandTotal =
        productTotal +
        specialPackagingTotal +
        fulfillment.amount +
        duty.amount +
        delivery.base -
        discounts;

    return {
        productTotal,
        specialPackagingFeePerUnit,
        specialPackagingTotal,
        fulfillment,
        affiliate,
        duty,
        delivery,
        discounts,
        grandTotal,
    };
}
