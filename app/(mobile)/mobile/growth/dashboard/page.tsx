// app/(mobile)/mobile/growth/dashboard/page.tsx - Growth Agent Mobile Dashboard
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface GrowthStats {
    status: string;
    totalSuppliersOnboarded: number;
    activeSuppliersCount: number;
    totalEarnings: number;
    pendingEarnings: number;
    region?: string;
    territory?: string;
}

export default function GrowthMobileDashboard() {
    const [stats, setStats] = useState<GrowthStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/growth/stats', { credentials: 'include' });
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    if (loading) {
        return (
            <div>
                <MobileHeader title="Growth Dashboard" />
                <div className="p-4 text-center text-slate-400">Loading...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div>
                <MobileHeader title="Growth Dashboard" />
                <div className="p-4">
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 text-center">
                        <span className="text-4xl">🌱</span>
                        <h2 className="text-xl text-white font-bold mt-4">Application Pending</h2>
                        <p className="text-slate-400 mt-2">Your growth agent application is under review.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <MobileHeader title="Growth Dashboard" />

            <div className="p-4">
                {/* Territory */}
                {stats.territory && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 mb-4 text-center">
                        <span className="text-orange-400">📍 {stats.territory}</span>
                        {stats.region && <span className="text-slate-500"> • {stats.region}</span>}
                    </div>
                )}

                {/* Earnings Overview */}
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-5 mb-4">
                    <div className="text-orange-100 text-sm">Total Earnings</div>
                    <div className="text-3xl font-bold text-white">{formatMoney(stats.totalEarnings)}</div>
                    <div className="text-orange-200 text-xs mt-1">
                        {formatMoney(stats.pendingEarnings)} pending unlock
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-800 rounded-xl p-4">
                        <div className="text-3xl font-bold text-white">{stats.totalSuppliersOnboarded}</div>
                        <div className="text-slate-400 text-sm">Onboarded</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-4">
                        <div className="text-3xl font-bold text-green-400">{stats.activeSuppliersCount}</div>
                        <div className="text-slate-400 text-sm">Active</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                    <Link href="/mobile/growth/onboard">
                        <div className="bg-orange-600 rounded-xl p-5 flex items-center justify-between active:bg-orange-700">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">➕</span>
                                <div>
                                    <div className="text-white font-medium">Onboard Supplier</div>
                                    <div className="text-orange-200 text-xs">Register new business</div>
                                </div>
                            </div>
                            <span className="text-white text-xl">→</span>
                        </div>
                    </Link>

                    <Link href="/mobile/growth/suppliers">
                        <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between active:bg-slate-700">
                            <span className="text-white font-medium">🏭 My Suppliers</span>
                            <span className="text-slate-400">→</span>
                        </div>
                    </Link>

                    <Link href="/mobile/growth/earnings">
                        <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between active:bg-slate-700">
                            <span className="text-white font-medium">💰 Earnings Details</span>
                            <span className="text-slate-400">→</span>
                        </div>
                    </Link>
                </div>

                {/* How It Works */}
                <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="text-white font-medium mb-2">💡 How to Earn</div>
                    <ol className="text-slate-400 text-sm space-y-1 list-decimal list-inside">
                        <li>Visit market / factory</li>
                        <li>Onboard supplier</li>
                        <li>Supplier completes orders</li>
                        <li>Earn commission!</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
