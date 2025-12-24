// app/(factory)/factory/rfqs/page.tsx - Factory RFQ List
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FactoryRfq {
    id: string;
    productCategory: string;
    productDescription: string;
    quantity: number;
    budget?: number;
    deliveryDeadline?: string;
    buyerCountry: string;
    status: string;
    createdAt: string;
}

export default function FactoryRfqsPage() {
    const [rfqs, setRfqs] = useState<FactoryRfq[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'PENDING' | 'QUOTED' | 'ALL'>('PENDING');

    useEffect(() => {
        const fetchRfqs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/factory/rfqs?status=${filter}`, { credentials: 'include' });
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
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">📋 RFQ Requests</h1>
                <p className="text-slate-400">Quote on buyer requests assigned to your factory</p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-400 text-sm">
                    💡 <strong>RFQ-First Workflow:</strong> Submit quotes with MOQ and lead time. Ops mediates all interactions.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {(['PENDING', 'QUOTED', 'ALL'] as const).map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg text-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'PENDING' ? 'Awaiting Quote' : f === 'QUOTED' ? 'Quoted' : 'All'}
                    </button>
                ))}
            </div>

            {/* RFQ List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : rfqs.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">📋</span>
                    <p className="text-slate-400 mt-4">No RFQs in this category</p>
                    <p className="text-slate-500 text-sm mt-2">
                        RFQs are assigned by Ops based on your capabilities
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {rfqs.map((rfq) => (
                        <Link key={rfq.id} href={`/factory/rfqs/${rfq.id}`}>
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-medium">{rfq.productCategory}</h3>
                                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{rfq.productDescription}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs ${rfq.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                            rfq.status === 'QUOTED' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-green-500/20 text-green-400'
                                        }`}>
                                        {rfq.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Quantity</span>
                                        <div className="text-white font-medium">{rfq.quantity.toLocaleString()} units</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Budget</span>
                                        <div className="text-green-400 font-medium">{formatMoney(rfq.budget)}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Buyer Location</span>
                                        <div className="text-white">{rfq.buyerCountry === 'NG' ? '🇳🇬 Nigeria' : '🇧🇩 Bangladesh'}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Deadline</span>
                                        <div className="text-white">{rfq.deliveryDeadline ? formatDate(rfq.deliveryDeadline) : '-'}</div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-slate-500 text-xs">Received: {formatDate(rfq.createdAt)}</span>
                                    <span className="text-blue-400 text-sm">Submit Quote →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
