// types/account.ts - Multi-Account System Types

export type AccountType =
    | 'BUYER'
    | 'COMPANY_FACTORY'
    | 'COMPANY_WHOLESALER'
    | 'COMPANY_RETAIL'
    | 'CREATOR_MODEL'
    | 'CREATOR_GRAPHIC'
    | 'CREATOR_MOCK';

export type VerificationLevel = 'NONE' | 'BLUE' | 'GREEN' | 'GOLD';

export type MembershipRole = 'OWNER' | 'STAFF';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export interface Account {
    id: string;
    type: AccountType;
    name: string;
    country: string;
    verificationLevel: VerificationLevel;
    verifiedAt?: string | null;
    verifiedByAdminId?: string | null;
    verificationNotes?: string | null;
    isActive: boolean;
    profileData?: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
}

export interface AccountMembership {
    id: string;
    userId: string;
    accountId: string;
    role: MembershipRole;
    joinedAt: string;
    account?: Account;
}

export interface AccountWithMemberships extends Account {
    memberships: (AccountMembership & { user: { id: string; email: string } })[];
}

export interface UserWithAccounts {
    id: string;
    email: string;
    phone?: string | null;
    status: UserStatus;
    country?: string | null;
    isActive: boolean;
    activeAccountId?: string | null;
    accounts: AccountMembership[];
    createdAt: string;
    updatedAt: string;
}

// Admin Studio types
export interface FeatureFlag {
    id: string;
    key: string;
    enabled: boolean;
    rolloutPercentage: number;
    allowedRoles: string[];
    name: string;
    description?: string | null;
    category?: string | null;
    updatedByAdminId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SiteSetting {
    id: string;
    key: string;
    value: unknown;
    category?: string | null;
    description?: string | null;
    updatedByAdminId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuditLogEntry {
    id: string;
    adminId: string;
    entityType: string;
    entityId: string;
    action: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    createdAt: string;
    admin?: {
        id: string;
        email: string;
    };
}

// Verification tick display helper
export function getVerificationBadge(level: VerificationLevel): {
    icon: string;
    label: string;
    color: string;
} {
    switch (level) {
        case 'BLUE':
            return { icon: '🔵', label: 'Verified', color: 'blue' };
        case 'GREEN':
            return { icon: '🟢', label: 'Business Verified', color: 'green' };
        case 'GOLD':
            return { icon: '🟡', label: 'Premium', color: 'gold' };
        default:
            return { icon: '', label: '', color: '' };
    }
}

// Account type display helper
export function getAccountTypeLabel(type: AccountType): string {
    const labels: Record<AccountType, string> = {
        BUYER: 'Buyer',
        COMPANY_FACTORY: 'Factory',
        COMPANY_WHOLESALER: 'Wholesaler',
        COMPANY_RETAIL: 'Retail',
        CREATOR_MODEL: 'Model',
        CREATOR_GRAPHIC: 'Graphic Designer',
        CREATOR_MOCK: 'Mock Designer',
    };
    return labels[type] || type;
}

// Check if account type should get BLUE or GREEN tick
export function getDefaultVerificationLevel(type: AccountType): VerificationLevel {
    // Businesses get GREEN, individuals get BLUE
    if (['COMPANY_FACTORY', 'COMPANY_WHOLESALER', 'COMPANY_RETAIL'].includes(type)) {
        return 'GREEN';
    }
    return 'BLUE';
}
