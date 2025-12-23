// app/(affiliate)/affiliate/dashboard/page.tsx - Affiliate Dashboard
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AffiliateStats {
    status: string;
    totalClicks: number;
    totalSales: number;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
    commissionRate: number;
}

export default function AffiliateDashboardPage() {
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/affiliate/stats', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    if (loading) {
        return (
            <div className="p-6 text-center text-slate-400">Loading dashboard...</div>
        );
    }

    if (!stats) {
        return (
            <div className="p-6">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-8 text-center">
                    <h2 className="text-2xl text-white font-bold mb-4">Welcome to Affiliate Program!</h2>
                    <p className="text-slate-400 mb-6">
                        Your application is under review. Once approved, you'll be able to start earning commissions on sales.
                    </p>
                    <Link href="/affiliate/links">
                        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            View My Profile
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Affiliate Dashboard</h1>
                <p className="text-slate-400">Track your sales and earnings</p>
            </div>

            {/* Status Badge */}
            {stats.status !== 'ACTIVE' && (
                <div className={`mb-6 p-4 rounded-xl ${stats.status === 'PENDING' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                        stats.status === 'SUSPENDED' ? 'bg-red-500/10 border border-red-500/30' :
                            'bg-slate-500/10 border border-slate-500/30'
                    }`}>
                    <span className="text-lg">
                        {stats.status === 'PENDING' ? '⏳' : stats.status === 'SUSPENDED' ? '⚠️' : '❌'}
                    </span>
                    <span className={`ml-2 font-medium ${stats.status === 'PENDING' ? 'text-yellow-400' :
                            stats.status === 'SUSPENDED' ? 'text-red-400' :
                                'text-slate-400'
                        }`}>
                        {stats.status === 'PENDING' ? 'Application Pending' :
                            stats.status === 'SUSPENDED' ? 'Account Suspended' :
                                'Account Inactive'}
                    </span>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <StatCard icon="👁️" label="Total Clicks" value={stats.totalClicks.toLocaleString()} color="#60a5fa" />
                <StatCard icon="🛒" label="Total Sales" value={stats.totalSales.toLocaleString()} color="#22c55e" />
                <StatCard icon="💰" label="Total Earnings" value={formatMoney(stats.totalEarnings)} color="#a78bfa" />
                <StatCard icon="⏳" label="Pending" value={formatMoney(stats.pendingEarnings)} color="#facc15" />
                <StatCard icon="✅" label="Paid Out" value={formatMoney(stats.paidEarnings)} color="#4ade80" />
            </div>

            {/* Commission Rate */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-white font-medium">Your Commission Rate</h3>
                        <p className="text-slate-400 text-sm">Earn on every completed sale</p>
                    </div>
                    <div className="text-3xl font-bold text-purple-400">
                        {(stats.commissionRate * 100).toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Link href="/affiliate/links">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors cursor-pointer">
                        <span className="text-3xl">🔗</span>
                        <h3 className="text-white font-medium mt-3">Create Link</h3>
                        <p className="text-slate-400 text-sm">Generate tracking links</p>
                    </div>
                </Link>
                <Link href="/affiliate/sales">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors cursor-pointer">
                        <span className="text-3xl">📊</span>
                        <h3 className="text-white font-medium mt-3">View Sales</h3>
                        <p className="text-slate-400 text-sm">Track your conversions</p>
                    </div>
                </Link>
                <Link href="/affiliate/withdraw">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors cursor-pointer">
                        <span className="text-3xl">🏦</span>
                        <h3 className="text-white font-medium mt-3">Withdraw</h3>
                        <p className="text-slate-400 text-sm">Request payout</p>
                    </div>
                </Link>
            </div>

            {/* How It Works */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">📘 How It Works</h3>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl mb-2">1️⃣</div>
                        <div className="text-sm text-slate-400">Share your link</div>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">2️⃣</div>
                        <div className="text-sm text-slate-400">Buyer places order</div>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">3️⃣</div>
                        <div className="text-sm text-slate-400">Order delivered</div>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">4️⃣</div>
                        <div className="text-sm text-slate-400">Earn commission!</div>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">
                    ⚠️ Commission is only earned after delivery confirmation. No commission on cancelled orders.
                </p>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{icon}</span>
                <span className="font-bold" style={{ color }}>{value}</span>
            </div>
            <div className="text-slate-400 text-sm">{label}</div>
        </div>
    );
}
