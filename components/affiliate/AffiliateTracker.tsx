'use client';

import { useEffect, useRef } from 'react';

interface AffiliateTrackerProps {
    referralCode?: string;
}

/**
 * AffiliateTracker
 * 
 * Silently tracks affiliate link clicks when a user lands on the page
 * with a referral code in the URL (?ref=CODE).
 * 
 * Usage:
 * ```tsx
 * <AffiliateTracker referralCode={searchParams.ref} />
 * ```
 */
export function AffiliateTracker({ referralCode }: AffiliateTrackerProps) {
    const tracked = useRef(false);

    useEffect(() => {
        // Only track once per page load
        if (!referralCode || tracked.current) return;

        tracked.current = true;

        // Generate or get session ID for deduplication
        let sessionId = '';
        if (typeof window !== 'undefined') {
            sessionId = sessionStorage.getItem('affiliate_session') || '';
            if (!sessionId) {
                sessionId = `ses_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                sessionStorage.setItem('affiliate_session', sessionId);
            }

            // Also store referral code in session for signup tracking
            sessionStorage.setItem('referral_code', referralCode);
        }

        // Track the click (fire and forget)
        fetch('/api/affiliate/track-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referralCode, sessionId }),
        }).catch((error) => {
            console.error('Failed to track affiliate click:', error);
        });
    }, [referralCode]);

    // This component renders nothing
    return null;
}

/**
 * Helper to get stored referral code from session
 * Use this when creating a new user to track the signup
 */
export function getStoredReferralCode(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('referral_code');
}

/**
 * Helper to clear referral tracking after successful signup
 */
export function clearReferralTracking(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('referral_code');
    sessionStorage.removeItem('affiliate_session');
}
