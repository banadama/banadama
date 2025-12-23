// hooks/useVerification.ts
'use client';

import { useEffect, useState } from 'react';
import type {
    VerificationRequest,
    VerificationType,
} from '@/types/verification';

export function useVerification() {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/verification');
            if (!res.ok) throw new Error('Failed to fetch verification requests');
            const data = await res.json();
            setRequests(data);
            setError(null);
        } catch (err: any) {
            setError(err.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const createRequest = async (input: {
        type: VerificationType;
        supplierId?: string;
        creatorId?: string;
        data?: any;
        documentUrls?: string[];
    }) => {
        try {
            setLoading(true);
            const res = await fetch('/api/verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });
            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                throw new Error(errBody?.error || 'Failed to create verification request');
            }
            await fetchRequests();
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
        requests,
        refresh: fetchRequests,
        createRequest,
    };
}
