// app/(admin)/admin/analytics/buyers/page.tsx - Buyer Intelligence
'use client';

import { useState, useEffect } from 'react';

interface BuyerData {
    totalBuyers: number;
    activeBuyers: number;
    highValueBuyers: Array<{
        id: string;
        name: string;
        email: string;
        totalSpent: number;
        totalOrders: number;
        avgOrderValue: number;
        conversionRate: number;
    }>;
    atRiskBuyers: Array<{
        id: string;
        name: string;
        lastOrderDays: number;
        abandonedRfqs: number;
    }>;
    abandonedRfqs: Array<{
        id: string;
        category: string;
        createdAt: string;
        estimatedValue: number;
    }>;
    avgMetrics: {
        rfqFrequency: number;
        conversionRate: number;
        avgOrderValue: number;
    };
}

export default function BuyerAnalyticsPage() {
    const [data, setData] = useState<BuyerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/analytics/buyers', { credentials: 'include' });
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

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">👥 Buyer Intelligence</h1>
                <p className="text-slate-400">Buyer behavior, high-value segments, abandoned RFQs</p>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : data ? (
                <>
                    {/* Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-white">{data.totalBuyers}</div>
                            <div className="text-slate-400 text-sm">Total Buyers</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-400">{data.activeBuyers}</div>
                            <div className="text-slate-400 text-sm">Active (30d)</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-purple-400">{data.highValueBuyers.length}</div>
                            <div className="text-slate-400 text-sm">High Value</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-yellow-400">{data.atRiskBuyers.length}</div>
                            <div className="text-slate-400 text-sm">At Risk</div>
                        </div>
                    </div>

                    {/* Average Metrics */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">📊 Buyer Averages</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Avg RFQs per Buyer</div>
                                <div className="text-2xl font-bold text-white">{data.avgMetrics.rfqFrequency.toFixed(1)}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">RFQ → Order Conversion</div>
                                <div className="text-2xl font-bold text-green-400">{(data.avgMetrics.conversionRate * 100).toFixed(1)}%</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Avg Order Value</div>
                                <div className="text-2xl font-bold text-blue-400">{formatMoney(data.avgMetrics.avgOrderValue)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* High Value Buyers */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-white font-medium mb-4">💎 High Value Buyers</h3>
                            {data.highValueBuyers.length === 0 ? (
                                <p className="text-slate-500">No high-value buyers identified</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.highValueBuyers.slice(0, 5).map((b) => (
                                        <div key={b.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                            <div>
                                                <div className="text-white font-medium">{b.name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-500">{b.totalOrders} orders</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-green-400 font-bold">{formatMoney(b.totalSpent)}</div>
                                                <div className="text-xs text-slate-500">AOV: {formatMoney(b.avgOrderValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* At Risk (Churning) */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-white font-medium mb-4">⚠️ At-Risk Buyers</h3>
                            {data.atRiskBuyers.length === 0 ? (
                                <p className="text-green-400">No at-risk buyers detected</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.atRiskBuyers.slice(0, 5).map((b) => (
                                        <div key={b.id} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-white font-medium">{b.name || 'Unknown'}</span>
                                                <span className="text-yellow-400 text-sm">{b.lastOrderDays}d inactive</span>
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {b.abandonedRfqs} abandoned RFQs
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Abandoned RFQs */}
                    <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-white font-medium mb-4">📋 Recent Abandoned RFQs</h3>
                        {data.abandonedRfqs.length === 0 ? (
                            <p className="text-slate-500">No abandoned RFQs</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-slate-400 text-sm">
                                        <th className="text-left pb-3">Category</th>
                                        <th className="text-left pb-3">Date</th>
                                        <th className="text-right pb-3">Est. Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {data.abandonedRfqs.slice(0, 10).map((r) => (
                                        <tr key={r.id}>
                                            <td className="py-3 text-white">{r.category}</td>
                                            <td className="py-3 text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 text-right text-yellow-400">{formatMoney(r.estimatedValue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* AI Suggestion */}
                    <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <div className="text-purple-400 font-medium">AI SUGGESTED</div>
                                <div className="text-slate-400 text-sm">
                                    {data.abandonedRfqs.length > 0
                                        ? `${data.abandonedRfqs.length} RFQs were abandoned. Consider follow-up campaigns.`
                                        : 'Buyer engagement looks healthy.'}
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
