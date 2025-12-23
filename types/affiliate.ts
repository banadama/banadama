// types/affiliate.ts

/**
 * Affiliate statistics response
 */
export interface AffiliateStats {
    totalClicks: number;
    totalSignups: number;
    totalSalesValue: number;  // in naira (not kobo)
    avgCommissionRate: number; // 0.01-0.03 (1%-3%)
    suppliersVerified: number;
    period: string;  // e.g., "30d", "all-time"
}

/**
 * Earnings breakdown calculation
 */
export interface EarningsBreakdown {
    signupEarnings: number;     // ₦50 per signup
    salesCommission: number;    // % of sales value
    supplierBonus: number;      // ₦100 per verified supplier
    totalEarnings: number;      // sum of all above
}

/**
 * Affiliate link with stats
 */
export interface AffiliateLinkWithStats {
    id: string;
    slug: string;
    targetUrl: string;
    campaign?: string;
    clicks: number;
    signups: number;
    sales: number;
    active: boolean;
    createdAt: Date;
}

/**
 * Affiliate conversion record
 */
export interface AffiliateConversionRecord {
    id: string;
    type: 'SIGNUP' | 'SALE' | 'VERIFIED_SUPPLIER';
    userId?: string;
    orderId?: string;
    supplierId?: string;
    commissionAmount: number;  // in kobo
    commissionRate?: number;
    paid: boolean;
    createdAt: Date;
}

/**
 * Payout request
 */
export interface PayoutRequest {
    id: string;
    amount: number;  // in kobo
    currency: string;
    status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'PAID' | 'REJECTED';
    paymentMethod?: string;
    requestedAt: Date;
    approvedAt?: Date;
    paidAt?: Date;
    rejectionReason?: string;
}
