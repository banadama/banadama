// types/user.ts

/**
 * Single source of truth for user roles across the platform
 */
export type UserRole =
    | 'BUYER'
    | 'SUPPLIER'
    | 'FACTORY'
    | 'WHOLESALER'
    | 'CREATOR'
    | 'AFFILIATE'
    | 'OPS'
    | 'ADMIN';

/**
 * Authenticated user object
 */
export interface AuthUser {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    avatar?: string | null;
    createdAt?: Date;
}

/**
 * Session data stored in cookies/JWT
 */
export interface UserSession {
    userId: string;
    email: string;
    role: UserRole;
    expiresAt: Date;
}
