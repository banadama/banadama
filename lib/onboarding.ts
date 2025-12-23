// lib/onboarding.ts - Onboarding Helpers
import { Role } from "@prisma/client";

/**
 * Client-side cookie setter
 */
export function setOnboardingCookie(name: string, value: string, days = 7) {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";

    // Also save to localStorage as fallback
    localStorage.setItem(name, value);
}

/**
 * Client-side cookie getter
 */
export function getOnboardingCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return localStorage.getItem(name);
}

/**
 * Parse intent from query params
 */
export function parseIntentFromQuery(searchParams: URLSearchParams) {
    return {
        intent: searchParams.get('intent') || 'BUYER',
        subtype: searchParams.get('subtype') || null,
        country: searchParams.get('country') || 'GLOBAL',
        lang: searchParams.get('lang') || 'en'
    };
}

/**
 * Mapping intents to RBAC roles
 */
export function mapIntentToRole(intent: string, subtype: string | null): Role {
    switch (intent) {
        case 'SUPPLIER':
            if (subtype === 'FACTORY') return 'FACTORY' as Role;
            if (subtype === 'WHOLESALER') return 'WHOLESALER' as Role;
            return 'COMPANY_RETAIL' as Role; // Default for retail
        case 'CREATOR':
            return 'CREATOR' as Role;
        case 'AFFILIATE':
            return 'AFFILIATE' as Role;
        case 'BUYER':
        default:
            return 'BUYER' as Role;
    }
}
