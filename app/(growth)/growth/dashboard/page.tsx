// app/(growth)/growth/dashboard/page.tsx - Growth Agent Dashboard
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GrowthStats {
    status: string;
    totalSuppliersOnboarded: number;
    activeSuppliersCount: number;
    totalOrdersGenerated: number;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
    region?: string;
    territory?: string;
}

export default function GrowthDashboardPage() {
    const [stats, setStats] = useState<GrowthStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/growth/stats', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
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
        return <div className="p-6 text-center text-slate-400">Loading...</div>;
    }

    if (!stats) {
        return (
            <div className="p-6">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-8 text-center">
                    <h2 className="text-2xl text-white font-bold mb-4">Welcome to Growth Team!</h2>
                    <p className="text-slate-400 mb-6">
                        Your application is under review. Once approved, you'll be able to start onboarding suppliers.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Growth Agent Dashboard</h1>
                <p className="text-slate-400">
                    {stats.territory && <span>{stats.territory} • </span>}
                    {stats.region && <span>{stats.region}</span>}
                </p>
            </div>

            {/* Core Principle */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🌱</span>
                    <div>
                        <div className="text-orange-400 font-medium">GROWTH = PEOPLE + FIELD + DISTRIBUTION</div>
                        <div className="text-slate-400 text-sm">
                            Onboard suppliers, help them succeed, earn commission on <strong>real activity</strong>.
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            {stats.status !== 'ACTIVE' && (
                <div className={`mb-6 p-4 rounded-xl ${stats.status === 'PENDING' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                        'bg-red-500/10 border border-red-500/30'
                    }`}>
                    <span className={`font-medium ${stats.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                        {stats.status === 'PENDING' ? '⏳ Pending Approval' : '⚠️ Account Suspended'}
                    </span>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon="🏭" label="Suppliers Onboarded" value={stats.totalSuppliersOnboarded} color="#f97316" />
                <StatCard icon="✅" label="Active Suppliers" value={stats.activeSuppliersCount} color="#22c55e" />
                <StatCard icon="📦" label="Orders Generated" value={stats.totalOrdersGenerated} color="#3b82f6" />
                <StatCard icon="💰" label="Total Earnings" value={formatMoney(stats.totalEarnings)} color="#a855f7" />
                <StatCard icon="⏳" label="Pending" value={formatMoney(stats.pendingEarnings)} color="#eab308" />
                <StatCard icon="✅" label="Paid Out" value={formatMoney(stats.paidEarnings)} color="#10b981" />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Link href="/growth/onboard-supplier">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 cursor-pointer transition-colors">
                        <span className="text-3xl">➕</span>
                        <h3 className="text-white font-medium mt-3">Onboard Supplier</h3>
                        <p className="text-slate-400 text-sm">Register a new supplier</p>
                    </div>
                </Link>
                <Link href="/growth/my-suppliers">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 cursor-pointer transition-colors">
                        <span className="text-3xl">🏭</span>
                        <h3 className="text-white font-medium mt-3">My Suppliers</h3>
                        <p className="text-slate-400 text-sm">View onboarded suppliers</p>
                    </div>
                </Link>
                <Link href="/growth/earnings">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 cursor-pointer transition-colors">
                        <span className="text-3xl">💰</span>
                        <h3 className="text-white font-medium mt-3">Earnings</h3>
                        <p className="text-slate-400 text-sm">View & withdraw earnings</p>
                    </div>
                </Link>
            </div>

            {/* How It Works */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">📘 How Commission Works</h3>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-3xl mb-2">1️⃣</div>
                        <div className="text-white font-medium text-sm">Onboard Supplier</div>
                        <div className="text-slate-500 text-xs">Visit market/factory</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">2️⃣</div>
                        <div className="text-white font-medium text-sm">Supplier Goes Live</div>
                        <div className="text-slate-500 text-xs">Products uploaded</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">3️⃣</div>
                        <div className="text-white font-medium text-sm">Orders Completed</div>
                        <div className="text-slate-500 text-xs">Real sales happen</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">4️⃣</div>
                        <div className="text-white font-medium text-sm">Earn Commission</div>
                        <div className="text-slate-500 text-xs">Finance approves</div>
                    </div>
                </div>
                <p className="text-yellow-400 text-xs text-center mt-4">
                    ⚠️ Commission is paid only after real activity. No payment for inactive suppliers.
                </p>
            </div>

            {/* Boundaries */}
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-medium mb-2">🚫 What You Cannot Do</h4>
                <ul className="text-slate-400 text-sm space-y-1">
                    <li>❌ Handle cash or payments</li>
                    <li>❌ Negotiate prices on behalf of platform</li>
                    <li>❌ Modify orders or payouts</li>
                    <li>❌ Assign verification ticks</li>
                </ul>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{icon}</span>
                <span className="font-bold text-lg" style={{ color }}>{value}</span>
            </div>
            <div className="text-slate-400 text-sm">{label}</div>
        </div>
    );
}
