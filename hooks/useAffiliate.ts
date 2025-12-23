"use client";

import { useState, useEffect } from "react";
import {
    AffiliateProfile,
    AffiliateLink,
    AffiliateConversion,
    AffiliatePayout,
    AffiliateStats,
    AffiliateDashboardData,
} from "@/types/affiliate";

/**
 * Hook to fetch affiliate profile data
 */
export function useAffiliateProfile(userId?: string) {
    const [profile, setProfile] = useState<AffiliateProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        async function fetchProfile() {
            try {
                const response = await fetch(`/api/affiliate/profile?userId=${userId}`);
                if (!response.ok) throw new Error("Failed to fetch profile");
                const data = await response.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [userId]);

    return { profile, loading, error };
}

/**
 * Hook to fetch affiliate links
 */
export function useAffiliateLinks(affiliateId?: string) {
    const [links, setLinks] = useState<AffiliateLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!affiliateId) {
            setLoading(false);
            return;
        }

        async function fetchLinks() {
            try {
                const response = await fetch(`/api/affiliate/links?affiliateId=${affiliateId}`);
                if (!response.ok) throw new Error("Failed to fetch links");
                const data = await response.json();
                setLinks(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchLinks();
    }, [affiliateId]);

    const refresh = async () => {
        if (!affiliateId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/affiliate/links?affiliateId=${affiliateId}`);
            if (!response.ok) throw new Error("Failed to fetch links");
            const data = await response.json();
            setLinks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { links, loading, error, refresh };
}

/**
 * Hook to fetch affiliate earnings/conversions
 */
export function useAffiliateEarnings(affiliateId?: string) {
    const [conversions, setConversions] = useState<AffiliateConversion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!affiliateId) {
            setLoading(false);
            return;
        }

        async function fetchConversions() {
            try {
                const response = await fetch(`/api/affiliate/conversions?affiliateId=${affiliateId}`);
                if (!response.ok) throw new Error("Failed to fetch conversions");
                const data = await response.json();
                setConversions(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchConversions();
    }, [affiliateId]);

    return { conversions, loading, error };
}

/**
 * Hook to fetch affiliate payouts
 */
export function useAffiliatePayouts(affiliateId?: string) {
    const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!affiliateId) {
            setLoading(false);
            return;
        }

        async function fetchPayouts() {
            try {
                const response = await fetch(`/api/affiliate/payouts?affiliateId=${affiliateId}`);
                if (!response.ok) throw new Error("Failed to fetch payouts");
                const data = await response.json();
                setPayouts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPayouts();
    }, [affiliateId]);

    const refresh = async () => {
        if (!affiliateId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/affiliate/payouts?affiliateId=${affiliateId}`);
            if (!response.ok) throw new Error("Failed to fetch payouts");
            const data = await response.json();
            setPayouts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { payouts, loading, error, refresh };
}

/**
 * Hook to fetch affiliate stats
 */
export function useAffiliateStats(affiliateId?: string) {
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!affiliateId) {
            setLoading(false);
            return;
        }

        async function fetchStats() {
            try {
                const response = await fetch(`/api/affiliate/stats?affiliateId=${affiliateId}`);
                if (!response.ok) throw new Error("Failed to fetch stats");
                const data = await response.json();
                setStats(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [affiliateId]);

    return { stats, loading, error };
}

/**
 * Main hook to fetch all affiliate dashboard data
 */
export function useAffiliate(userId?: string) {
    const [dashboardData, setDashboardData] = useState<AffiliateDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        async function fetchDashboard() {
            try {
                const response = await fetch(`/api/affiliate/dashboard?userId=${userId}`);
                if (!response.ok) throw new Error("Failed to fetch dashboard data");
                const data = await response.json();
                setDashboardData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, [userId]);

    const refresh = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/affiliate/dashboard?userId=${userId}`);
            if (!response.ok) throw new Error("Failed to fetch dashboard data");
            const data = await response.json();
            setDashboardData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { dashboardData, loading, error, refresh };
}
