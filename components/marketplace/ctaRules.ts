// components/marketplace/ctaRules.ts - CTA Display Rules
export type CtaContext = "MARKETPLACE" | "NEAR_ME" | "GLOBAL" | "PRODUCT_DETAIL";

export function getCtas(input: {
    buyNowEnabled: boolean;
    rfqEnabled: boolean;
    context: CtaContext;
}) {
    const { buyNowEnabled, rfqEnabled, context } = input;

    // Global is buy-only. Never show RFQ.
    if (context === "GLOBAL") {
        return { showBuyNow: buyNowEnabled, showRFQ: false };
    }

    // Everywhere else: show based on flags
    return {
        showBuyNow: buyNowEnabled,
        showRFQ: rfqEnabled,
    };
}
