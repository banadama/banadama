// types/verification.ts

export type VerificationType = 'USER_KYC' | 'SUPPLIER' | 'CREATOR';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface VerificationRequest {
    id: string;
    userId: string;
    type: VerificationType;
    status: VerificationStatus;
    supplierId?: string | null;
    creatorId?: string | null;
    data?: any;
    documentUrls: string[];
    reviewedById?: string | null;
    reviewedAt?: string | null;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
}
