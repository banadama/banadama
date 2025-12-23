// hooks/useAdminVerifications.ts
'use client';

import { useEffect, useState } from 'react';
import type {
    VerificationRequest,
    VerificationStatus,
    VerificationType,
} from '@/types/verification';

export function useAdminVerifications(filters?: {
    status?: VerificationStatus;
    type?: VerificationType;
}) {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<VerificationRequest[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters?.status) params.set('status', filters.status);
            if (filters?.type) params.set('type', filters.type);

            const url =
                '/api/admin/verifications' +
                (params.toString() ? `?${params.toString()}` : '');

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch verifications');
            const data = await res.json();
            setItems(data);
            setError(null);
        } catch (err: any) {
            setError(err.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters?.status, filters?.type]);

    const updateStatus = async (id: string, status: VerificationStatus, rejectionReason?: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/verifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, rejectionReason }),
            });
            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                throw new Error(errBody?.error || 'Failed to update verification');
            }
            await fetchItems();
            return true;
        } catch (err: any) {
            setError(err.message ?? 'Unknown error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        items,
        refresh: fetchItems,
        updateStatus,
    };
}
