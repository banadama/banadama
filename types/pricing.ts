// types/pricing.ts - TypeScript types for pricing system

export interface PricingInput {
    productPrice: number;
    quantity: number;
    category?: string;
    originCountry: string;
    destinationCountry: string;
    serviceTier: 'BASIC' | 'PREMIUM' | 'BUSINESS';
}

export interface PricingBreakdown {
    // Base
    unitPrice: number;
    quantity: number;
    subtotal: number;

    // Fees
    fulfillmentFee: number;
    fulfillmentRate: number;

    // International (if applicable)
    dutyRate?: number;
    dutyAmount?: number;
    shippingCost?: number;

    // Service tier adjustment
    serviceTierDiscount?: number;

    // Total
    total: number;
    currency: string;
}

export interface QuoteRequest {
    rfqId: string;
    supplierId: string;
    unitPrice: number;
    moq?: number;
    leadTime?: number;
    notes?: string;
}

export interface QuoteResponse {
    quoteId: string;
    pricing: PricingBreakdown;
    validUntil: Date;
    termsAndConditions?: string;
}

export type ServiceTier = 'BASIC' | 'PREMIUM' | 'BUSINESS';

export interface ServicePlanFeatures {
    tier: ServiceTier;
    fulfillmentRate: number;
    supportLevel: string;
    features: string[];
    monthlyFee: number;
}

export interface ShippingEstimate {
    carrier: string;
    estimatedDays: number;
    cost: number;
    trackingAvailable: boolean;
}
