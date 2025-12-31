// lib/pricing.ts - lightweight pricing utilities (legacy-compatible shape for tests)
import { PRICING_CONFIG } from "../config/pricing";

type SpecialTier = { minQty: number; maxQty: number | null; unitFee: number };

const TIERS: SpecialTier[] = PRICING_CONFIG.specialPackagingTiers as any;

export function getSpecialPackagingFeePerUnit(quantity: number): number {
    const tier = TIERS.find((t) => {
        const fitsMin = quantity >= t.minQty;
        const fitsMax = t.maxQty === null ? true : quantity <= t.maxQty;
        return fitsMin && fitsMax;
    });
    return tier?.unitFee ?? 1000;
}

export function calculateSpecialPackagingFee(quantity: number) {
    const unitFee = getSpecialPackagingFeePerUnit(quantity);
    return { unitFee, totalFee: unitFee * quantity };
}

export function calculateFulfillmentFee(input: any) {
    const rate = PRICING_CONFIG.fulfillmentRate || 0.052;
    const subtotal = input.orderValue ?? input.productSubtotal ?? 0;
    const amount = Math.round(subtotal * rate);
    return { rate, amount };
}

export function calculateDuty({ category, productValue }: { category?: string; productValue: number }) {
    const cat = (category || '').toString().toLowerCase();
    const rate = PRICING_CONFIG.dutyRates[cat] ?? PRICING_CONFIG.dutyRates.default;
    const amount = (productValue || 0) * rate;
    return { rate, amount };
}

export function calculateDelivery({ region }: { region?: string }) {
    const r = (region || 'default').toString().toLowerCase();
    const cfg = PRICING_CONFIG.delivery[r] || PRICING_CONFIG.delivery.default;
    const final = Math.round((cfg.min + cfg.max) / 2);
    return { final };
}

export function calculateFullPricing(params: any) {
    // expected params: productSubtotal, quantity, category, region, servicePlan, isB2CFromBangladesh
    const productSubtotal = params.productSubtotal ?? 0;
    const quantity = params.quantity ?? 1;

    const specialPackaging = calculateSpecialPackagingFee(quantity);
    const fulfillment = calculateFulfillmentFee({ productSubtotal });
    const duty = calculateDuty({ category: params.category, productValue: productSubtotal });
    const delivery = calculateDelivery({ region: params.region });

    const b2cProcessingFee = params.isB2CFromBangladesh
        ? Math.round((PRICING_CONFIG.b2cBangladesh.processingFeeMin + PRICING_CONFIG.b2cBangladesh.processingFeeMax) / 2)
        : undefined;

    const total =
        productSubtotal +
        specialPackaging.totalFee +
        fulfillment.amount +
        duty.amount +
        (delivery.final || 0) +
        (b2cProcessingFee || 0);

    return {
        specialPackaging,
        fulfillment,
        duty,
        delivery,
        b2cProcessingFee,
        total,
    };
}
