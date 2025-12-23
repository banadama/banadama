'use client';

import { useEffect, useState } from 'react';

/**
 * Affiliate statistics from API
 */
export type AffiliateStatsData = {
    clicks: number;
    signups: number;
    salesCount: number;
    verifiedSuppliers: number;
    earnings: {
        fromSignups: number;
        fromSuppliers: number;
        fromSales: number;
        total: number;
        currency: string;
    };
    range: string;
};

/**
 * Hook to fetch affiliate statistics with optional date range filtering
 * 
 * @param range - Date range filter: 'all' | '30d' | '90d'
 * @returns Affiliate stats data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useAffiliateStats('30d');
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * 
 * return <div>Total Earnings: ₦{data.earnings.total}</div>;
 * ```
 */
export function useAffiliateStats(range: 'all' | '30d' | '90d' = 'all') {
    const [data, setData] = useState<AffiliateStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        setLoading(true);
        setError(null);

        fetch(`/api/affiliate/stats?range=${range}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then((json) => {
                if (!json.ok) {
                    throw new Error(json.error || 'Error loading stats');
                }
                if (isMounted) {
                    setData(json.stats);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [range]);

    return { data, loading, error };
}
