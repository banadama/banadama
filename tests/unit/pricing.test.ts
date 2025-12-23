import {
    calculateSpecialPackagingFee,
    calculateFulfillmentFee,
    calculateDuty,
    calculateFullPricing,
} from "../../lib/pricing";
import { PRICING_CONFIG } from "../../config/pricing";

describe("Pricing Engine", () => {
    describe("Special Packaging Fee", () => {
        it("should apply correct tier for low quantity", () => {
            const qty = 50;
            const result = calculateSpecialPackagingFee(qty);
            expect(result.unitFee).toBe(1000);
            expect(result.totalFee).toBe(50000);
        });

        it("should apply correct tier for high quantity", () => {
            const qty = 1500;
            const result = calculateSpecialPackagingFee(qty);
            expect(result.unitFee).toBe(880);
            expect(result.totalFee).toBe(1500 * 880);
        });
    });

    describe("Fulfillment Fee", () => {
        it("should calculate 5.2% of subtotal", () => {
            const subtotal = 100000;
            const result = calculateFulfillmentFee({ productSubtotal: subtotal });
            expect(result.rate).toBe(0.052);
            expect(result.amount).toBe(5200);
        });
    });

    describe("Duty Calculation", () => {
        it("should apply category specific rate", () => {
            const result = calculateDuty({ category: "electronics", productValue: 100000 });
            expect(result.rate).toBe(0.10);
            expect(result.amount).toBe(10000);
        });

        it("should apply default rate for unknown category", () => {
            const result = calculateDuty({ category: "unknown_thing", productValue: 100000 });
            expect(result.rate).toBe(PRICING_CONFIG.dutyRates.default);
        });
    });

    describe("Full Pricing Breakdown", () => {
        it("should aggregate all costs correctly", () => {
            const params = {
                productSubtotal: 100000,
                quantity: 10,
                category: "clothing",
                region: "lagos",
                servicePlan: "BASIC" as const,
            };

            const result = calculateFullPricing(params);

            // Expected values
            const expectedPackaging = 10 * 1000; // 10000
            const expectedFulfillment = 100000 * 0.052; // 5200
            const expectedDuty = 100000 * 0.07; // 7000
            const expectedDelivery = (1500 + 2500) / 2; // 2000 (avg of lagos min/max)

            const expectedTotal = 100000 + expectedPackaging + expectedFulfillment + expectedDuty + expectedDelivery;

            expect(result.specialPackaging.totalFee).toBe(expectedPackaging);
            expect(result.fulfillment.amount).toBe(expectedFulfillment);
            expect(result.duty.amount).toBe(expectedDuty);
            expect(result.delivery.final).toBe(expectedDelivery);
            expect(result.total).toBe(expectedTotal);
        });

        it("should add B2C processing fee if applicable", () => {
            const params = {
                productSubtotal: 50000,
                quantity: 1,
                category: "shoes",
                region: "lagos",
                servicePlan: "BASIC" as const,
                isB2CFromBangladesh: true,
            };

            const result = calculateFullPricing(params);

            const expectedProcessing = (500 + 1000) / 2; // 750
            expect(result.b2cProcessingFee).toBe(expectedProcessing);
            expect(result.total).toBeGreaterThan(params.productSubtotal);
        });
    });
});
