import { ServiceTier, ServicePlan } from '@/types/servicePlan';

export const SERVICE_PLANS: Record<ServiceTier, ServicePlan> = {
    [ServiceTier.BASIC]: {
        id: ServiceTier.BASIC,
        name: 'Basic',
        price: 0,
        description: 'Essential sourcing for small businesses',
        benefits: {
            supportLevel: 'standard',
            sourcingPriority: 'standard',
            responseTime: '48h',
            disputeHandling: true,
            dedicatedAgent: false,
        },
    },
    [ServiceTier.PREMIUM]: {
        id: ServiceTier.PREMIUM,
        name: 'Premium',
        price: 1000, // Example monthly price
        description: 'Priority support and faster sourcing',
        benefits: {
            supportLevel: 'priority',
            sourcingPriority: 'high',
            responseTime: '24h',
            disputeHandling: true,
            dedicatedAgent: false,
        },
    },
    [ServiceTier.BUSINESS]: {
        id: ServiceTier.BUSINESS,
        name: 'Business',
        price: 3000, // Example monthly price
        description: 'Dedicated support for high-volume buyers',
        benefits: {
            supportLevel: 'dedicated',
            sourcingPriority: 'top',
            responseTime: '4h',
            disputeHandling: true,
            dedicatedAgent: true,
        },
    },
};
