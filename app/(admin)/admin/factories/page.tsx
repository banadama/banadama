// app/(admin)/admin/studio/factories/page.tsx - Admin Factory Management
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Factory {
    id: string;
    factoryName: string;
    factoryType?: string;
    country: string;
    city?: string;
    verificationStatus: string;
    hasGreenTick: boolean;
    enabledForInternational: boolean;
    monthlyCapacityUnits?: number;
    createdAt: string;
    supplierName?: string;
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    UNDER_REVIEW: 'bg-blue-500/20 text-blue-400',
    VERIFIED: 'bg-green-500/20 text-green-400',
    SUSPENDED: 'bg-red-500/20 text-red-400',
    REJECTED: 'bg-slate-500/20 text-slate-400',
};

export default function AdminFactoriesPage() {
    const [factories, setFactories] = useState<Factory[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchFactories = async () => {
            setLoading(true);
            try {
                const url = filter ? `/api/admin/factories?status=${filter}` : '/api/admin/factories';
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setFactories(data.factories || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFactories();
    }, [filter]);

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">🏭 Factory Management</h1>
                    <p className="text-slate-400">Approve, verify, and manage manufacturing factories</p>
                </div>
            </div>

            {/* Core Principle */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🏭</span>
                    <div>
                        <div className="text-blue-400 font-medium">FACTORY ≠ WHOLESALER</div>
                        <div className="text-slate-400 text-sm">
                            Factories are producers. RFQ-first workflow. Green tick required for international trade.
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
                        {f || 'All Factories'}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">
                        {factories.length}
                    </div>
                    <div className="text-slate-400 text-sm">Total Factories</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                        {factories.filter(f => f.verificationStatus === 'PENDING').length}
                    </div>
                    <div className="text-slate-400 text-sm">Pending Review</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                        {factories.filter(f => f.hasGreenTick).length}
                    </div>
                    <div className="text-slate-400 text-sm">🟢 Verified</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {factories.filter(f => f.enabledForInternational).length}
                    </div>
                    <div className="text-slate-400 text-sm">Int'l Trade Enabled</div>
                </div>
            </div>

            {/* Factories List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : factories.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">🏭</span>
                    <p className="text-slate-400 mt-4">No factories found</p>
                </div>
            ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-900/50">
                                <th className="text-left p-4 text-slate-400 font-medium">Factory</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Location</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Capacity</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Verification</th>
                                <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {factories.map((factory) => (
                                <tr key={factory.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🏭</span>
                                            <div>
                                                <div className="text-white font-medium">{factory.factoryName}</div>
                                                <div className="text-slate-500 text-sm">{factory.factoryType || 'General'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white">{factory.country === 'BD' ? '🇧🇩 Bangladesh' : '🇳🇬 Nigeria'}</div>
                                        {factory.city && <div className="text-slate-500 text-sm">{factory.city}</div>}
                                    </td>
                                    <td className="p-4">
                                        {factory.monthlyCapacityUnits ? (
                                            <div className="text-white">{factory.monthlyCapacityUnits.toLocaleString()} units/mo</div>
                                        ) : (
                                            <span className="text-slate-500">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[factory.verificationStatus]}`}>
                                            {factory.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {factory.hasGreenTick ? (
                                                <span className="text-green-400">🟢 Verified</span>
                                            ) : (
                                                <span className="text-slate-500">No tick</span>
                                            )}
                                            {factory.enabledForInternational && (
                                                <span className="text-blue-400 text-xs">🌍</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/studio/factories/${factory.id}`}>
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
