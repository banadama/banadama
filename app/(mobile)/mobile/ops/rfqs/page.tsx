// app/(mobile)/mobile/ops/rfqs/page.tsx - OPS RFQ Queue (Mobile)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface Rfq {
    id: string;
    productCategory: string;
    quantity: number;
    budget?: number;
    status: string;
    buyerName: string;
    createdAt: string;
}

export default function OpsRfqsMobile() {
    const [rfqs, setRfqs] = useState<Rfq[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'PENDING' | 'PROCESSING' | 'ALL'>('PENDING');

    useEffect(() => {
        const fetchRfqs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/ops/rfqs?status=${filter}`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setRfqs(data.rfqs || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRfqs();
    }, [filter]);

    const formatMoney = (kobo?: number) => kobo ? `₦${(kobo / 100).toLocaleString()}` : '-';
    const formatDate = (d: string) => new Date(d).toLocaleDateString();

    return (
        <div>
            <MobileHeader title="RFQ Queue" />

            {/* Filter Tabs */}
            <div className="flex gap-2 px-4 py-3 bg-slate-800/50 overflow-x-auto">
                {(['PENDING', 'PROCESSING', 'ALL'] as const).map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* RFQ List */}
            <div className="p-4">
                {loading ? (
                    <div className="text-center text-slate-400 py-8">Loading...</div>
                ) : rfqs.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">No RFQs found</div>
                ) : (
                    <div className="space-y-3">
                        {rfqs.map((rfq) => (
                            <Link key={rfq.id} href={`/mobile/ops/rfqs/${rfq.id}`}>
                                <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-white">{rfq.productCategory}</div>
                                        <span className={`px-2 py-0.5 rounded text-xs ${rfq.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                rfq.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-green-500/20 text-green-400'
                                            }`}>
                                            {rfq.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {rfq.quantity} units • {formatMoney(rfq.budget)} budget
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                                        <span>👤 {rfq.buyerName}</span>
                                        <span>{formatDate(rfq.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
