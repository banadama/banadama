export enum ServiceTier {
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
    BUSINESS = 'BUSINESS',
}

export interface ServicePlanBenefits {
    supportLevel: 'standard' | 'priority' | 'dedicated';
    sourcingPriority: 'standard' | 'high' | 'top';
    responseTime: string;
    disputeHandling: boolean;
    dedicatedAgent: boolean;
}

export interface ServicePlan {
    id: ServiceTier;
    name: string;
    price: number; // Monthly subscription price if applicable, or per-request fee base
    description: string;
    benefits: ServicePlanBenefits;
}
