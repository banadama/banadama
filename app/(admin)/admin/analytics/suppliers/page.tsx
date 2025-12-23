// app/(admin)/admin/analytics/suppliers/page.tsx - Supplier Intelligence
'use client';

import { useState, useEffect } from 'react';

interface SupplierData {
    totalSuppliers: number;
    activeSuppliers: number;
    topPerformers: Array<{
        id: string;
        businessName: string;
        overallScore: number;
        completedOrders: number;
        revenue: number;
    }>;
    highRisk: Array<{
        id: string;
        businessName: string;
        overallScore: number;
        riskReasons: string[];
        disputeRate: number;
    }>;
    avgMetrics: {
        responseTimeHours: number;
        fulfillmentRate: number;
        disputeRate: number;
    };
}

export default function SupplierAnalyticsPage() {
    const [data, setData] = useState<SupplierData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/analytics/suppliers', { credentials: 'include' });
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">🏭 Supplier Intelligence</h1>
                <p className="text-slate-400">Performance scores, risk flags, top performers</p>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : data ? (
                <>
                    {/* Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-white">{data.totalSuppliers}</div>
                            <div className="text-slate-400 text-sm">Total Suppliers</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-400">{data.activeSuppliers}</div>
                            <div className="text-slate-400 text-sm">Active</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-400">{data.topPerformers.length}</div>
                            <div className="text-slate-400 text-sm">Top Performers</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-red-400">{data.highRisk.length}</div>
                            <div className="text-slate-400 text-sm">High Risk</div>
                        </div>
                    </div>

                    {/* Average Metrics */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">📊 Platform Averages</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Avg Response Time</div>
                                <div className="text-2xl font-bold text-white">{data.avgMetrics.responseTimeHours.toFixed(1)}h</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Avg Fulfillment Rate</div>
                                <div className="text-2xl font-bold text-green-400">{(data.avgMetrics.fulfillmentRate * 100).toFixed(1)}%</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Avg Dispute Rate</div>
                                <div className="text-2xl font-bold text-red-400">{(data.avgMetrics.disputeRate * 100).toFixed(2)}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Top Performers */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-white font-medium mb-4">🏆 Top Performers</h3>
                            {data.topPerformers.length === 0 ? (
                                <p className="text-slate-500">No top performers yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.topPerformers.map((s, i) => (
                                        <div key={s.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{['🥇', '🥈', '🥉'][i] || '⭐'}</span>
                                                <div>
                                                    <div className="text-white font-medium">{s.businessName}</div>
                                                    <div className="text-xs text-slate-500">{s.completedOrders} orders</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold ${getScoreColor(s.overallScore)}`}>{s.overallScore}/100</div>
                                                <div className="text-xs text-green-400">{formatMoney(s.revenue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* High Risk */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-white font-medium mb-4">⚠️ High Risk Suppliers</h3>
                            {data.highRisk.length === 0 ? (
                                <p className="text-green-400">No high-risk suppliers detected</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.highRisk.map((s) => (
                                        <div key={s.id} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-white font-medium">{s.businessName}</span>
                                                <span className="text-red-400 font-bold">{s.overallScore}/100</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {s.riskReasons.map((r) => (
                                                    <span key={r} className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-2">
                                                Dispute rate: {(s.disputeRate * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Suggestion */}
                    <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <div className="text-purple-400 font-medium">AI SUGGESTED</div>
                                <div className="text-slate-400 text-sm">
                                    {data.highRisk.length > 0
                                        ? `Consider reviewing ${data.highRisk.length} high-risk supplier(s) for potential action.`
                                        : 'All suppliers are performing within acceptable parameters.'}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 ml-11">
                            This is a recommendation only. Human decision required.
                        </p>
                    </div>
                </>
            ) : null}
        </div>
    );
}
