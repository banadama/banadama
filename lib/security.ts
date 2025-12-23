// lib/security.ts - Security helpers and input validation

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Rate limit helper (in-memory, for production use Redis)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetAt) {
        // New window
        const resetAt = now + windowMs;
        rateLimitMap.set(identifier, { count: 1, resetAt });
        return { allowed: true, remaining: maxRequests - 1, resetAt };
    }

    if (record.count >= maxRequests) {
        // Rate limit exceeded
        return { allowed: false, remaining: 0, resetAt: record.resetAt };
    }

    // Increment count
    record.count++;
    rateLimitMap.set(identifier, record);
    return {
        allowed: true,
        remaining: maxRequests - record.count,
        resetAt: record.resetAt,
    };
}

/**
 * Clean expired rate limit records (call periodically)
 */
export function cleanRateLimitMap() {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}

/**
 * Validate amount (must be positive number)
 */
export function isValidAmount(amount: any): boolean {
    const num = Number(amount);
    return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Validate integer (for quantities, etc.)
 */
export function isValidInteger(value: any, min: number = 1): boolean {
    const num = Number(value);
    return Number.isInteger(num) && num >= min;
}

/**
 * Validate country code (ISO 2-letter)
 */
export function isValidCountryCode(code: string): boolean {
    return /^[A-Z]{2}$/.test(code);
}

/**
 * Validate currency code (ISO 3-letter)
 */
export function isValidCurrencyCode(code: string): boolean {
    const validCurrencies = ['NGN', 'BDT', 'USD', 'EUR', 'GBP'];
    return validCurrencies.includes(code);
}

/**
 * Escape SQL (basic - Prisma handles this, but useful for raw queries)
 */
export function escapeSql(value: string): string {
    return value.replace(/'/g, "''");
}

/**
 * Generate secure random token
 */
export function generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const crypto = require('crypto');
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        token += chars[bytes[i] % chars.length];
    }

    return token;
}

/**
 * Hash sensitive data (for logging, etc.)
 */
export function hashForLogging(value: string): string {
    if (value.length <= 4) return '***';
    return value.substring(0, 2) + '***' + value.substring(value.length - 2);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
