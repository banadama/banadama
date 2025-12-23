// app/(admin)/admin/studio/wholesalers/page.tsx - Admin Wholesaler Management
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Wholesaler {
    id: string;
    businessName: string;
    businessType?: string;
    country: string;
    city?: string;
    marketName?: string;
    verificationStatus: string;
    hasBlueTick: boolean;
    hasGreenTick: boolean;
    enabledForInternational: boolean;
    fulfillmentRate?: number;
    productsCount: number;
    createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    UNDER_REVIEW: 'bg-blue-500/20 text-blue-400',
    VERIFIED: 'bg-green-500/20 text-green-400',
    SUSPENDED: 'bg-red-500/20 text-red-400',
    REJECTED: 'bg-slate-500/20 text-slate-400',
};

export default function AdminWholesalersPage() {
    const [wholesalers, setWholesalers] = useState<Wholesaler[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchWholesalers = async () => {
            setLoading(true);
            try {
                const url = filter ? `/api/admin/wholesalers?status=${filter}` : '/api/admin/wholesalers';
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setWholesalers(data.wholesalers || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWholesalers();
    }, [filter]);

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">🏪 Wholesaler Management</h1>
                    <p className="text-slate-400">Verify, manage, and monitor wholesale suppliers</p>
                </div>
            </div>

            {/* Core Principle */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🏪</span>
                    <div>
                        <div className="text-blue-400 font-medium">WHOLESALER ≠ FACTORY</div>
                        <div className="text-slate-400 text-sm">
                            Wholesalers have ready stock. Buy Now mandatory. Fast delivery expected.
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'SUSPENDED'].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f || 'All Wholesalers'}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">
                        {wholesalers.length}
                    </div>
                    <div className="text-slate-400 text-sm">Total Wholesalers</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                        {wholesalers.filter(w => w.verificationStatus === 'PENDING').length}
                    </div>
                    <div className="text-slate-400 text-sm">Pending Review</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {wholesalers.filter(w => w.hasBlueTick).length}
                    </div>
                    <div className="text-slate-400 text-sm">🔵 Blue Tick</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                        {wholesalers.filter(w => w.hasGreenTick).length}
                    </div>
                    <div className="text-slate-400 text-sm">🟢 Green Tick</div>
                </div>
            </div>

            {/* Wholesalers List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : wholesalers.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">🏪</span>
                    <p className="text-slate-400 mt-4">No wholesalers found</p>
                </div>
            ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-900/50">
                                <th className="text-left p-4 text-slate-400 font-medium">Business</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Location</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Products</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Fulfillment</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Verification</th>
                                <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {wholesalers.map((w) => (
                                <tr key={w.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🏪</span>
                                            <div>
                                                <div className="text-white font-medium">{w.businessName}</div>
                                                <div className="text-slate-500 text-sm">
                                                    {w.businessType === 'STRONG_RETAILER' ? 'Retailer' : 'Wholesaler'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white">{w.country === 'NG' ? '🇳🇬 Nigeria' : '🇧🇩 Bangladesh'}</div>
                                        {w.marketName && <div className="text-slate-500 text-sm">{w.marketName}</div>}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white">{w.productsCount} products</div>
                                    </td>
                                    <td className="p-4">
                                        {w.fulfillmentRate !== undefined ? (
                                            <div className="text-green-400">{(w.fulfillmentRate * 100).toFixed(0)}%</div>
                                        ) : (
                                            <span className="text-slate-500">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {w.hasGreenTick ? (
                                                <span className="text-green-400">🟢 Green</span>
                                            ) : w.hasBlueTick ? (
                                                <span className="text-blue-400">🔵 Blue</span>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[w.verificationStatus]}`}>
                                                    {w.verificationStatus}
                                                </span>
                                            )}
                                            {w.enabledForInternational && (
                                                <span className="text-blue-400 text-xs">🌍</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/studio/wholesalers/${w.id}`}>
                                            <button className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">
                                                Manage →
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
