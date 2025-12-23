// app/(admin)/admin/analytics/market/page.tsx - Market Analytics
'use client';

import { useState, useEffect } from 'react';

interface MarketData {
    totalRfqs: number;
    totalOrders: number;
    totalGmv: number;
    platformRevenue: number;
    rfqToOrderRate: number;
    avgOrderValue: number;
    buyNowPercentage: number;
    rfqPercentage: number;
    topCategories: Array<{ name: string; rfqs: number; orders: number; gmv: number }>;
    countryBreakdown: { nigeria: number; bangladesh: number; international: number };
    demandGaps: Array<{ category: string; demand: number; supply: number; gap: number }>;
}

export default function MarketAnalyticsPage() {
    const [data, setData] = useState<MarketData | null>(null);
    const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/analytics/market?period=${period}`, { credentials: 'include' });
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
    }, [period]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100000000).toFixed(2)}M`;
    const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">📊 Market Analytics</h1>
                    <p className="text-slate-400">Platform-wide market insights</p>
                </div>
                <div className="flex gap-2">
                    {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((p) => (
                        <button
                            key={p}
                            className={`px-4 py-2 rounded-lg text-sm ${period === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                            onClick={() => setPeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Core Principle */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                        <div className="text-blue-400 font-medium">ANALYTICS = VISIBILITY | AI = RECOMMENDATION</div>
                        <div className="text-slate-400 text-sm">Data informs decisions. Humans make final calls.</div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading analytics...</div>
            ) : data ? (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <MetricCard label="Total GMV" value={formatMoney(data.totalGmv)} icon="💰" color="#22c55e" />
                        <MetricCard label="Platform Revenue" value={formatMoney(data.platformRevenue)} icon="📈" color="#3b82f6" />
                        <MetricCard label="Total Orders" value={data.totalOrders.toLocaleString()} icon="📦" color="#f97316" />
                        <MetricCard label="Total RFQs" value={data.totalRfqs.toLocaleString()} icon="📋" color="#a855f7" />
                    </div>

                    {/* Conversion & AOV */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">RFQ → Order Rate</div>
                            <div className="text-3xl font-bold text-green-400">{formatPercent(data.rfqToOrderRate)}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Avg Order Value</div>
                            <div className="text-3xl font-bold text-white">₦{(data.avgOrderValue / 100).toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Buy Now vs RFQ</div>
                            <div className="flex gap-4">
                                <div>
                                    <span className="text-xl font-bold text-blue-400">{formatPercent(data.buyNowPercentage)}</span>
                                    <span className="text-slate-500 text-xs ml-1">Buy Now</span>
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-purple-400">{formatPercent(data.rfqPercentage)}</span>
                                    <span className="text-slate-500 text-xs ml-1">RFQ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Country Breakdown */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">🌍 Country Breakdown (GMV)</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-3xl mb-2">🇳🇬</div>
                                <div className="text-xl font-bold text-white">{formatMoney(data.countryBreakdown.nigeria)}</div>
                                <div className="text-slate-400 text-sm">Nigeria</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🇧🇩</div>
                                <div className="text-xl font-bold text-white">{formatMoney(data.countryBreakdown.bangladesh)}</div>
                                <div className="text-slate-400 text-sm">Bangladesh</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🌐</div>
                                <div className="text-xl font-bold text-white">{formatMoney(data.countryBreakdown.international)}</div>
                                <div className="text-slate-400 text-sm">International</div>
                            </div>
                        </div>
                    </div>

                    {/* Top Categories */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">🏆 Top Categories</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="text-slate-400 text-sm">
                                    <th className="text-left pb-3">Category</th>
                                    <th className="text-right pb-3">RFQs</th>
                                    <th className="text-right pb-3">Orders</th>
                                    <th className="text-right pb-3">GMV</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {data.topCategories.map((c, i) => (
                                    <tr key={c.name}>
                                        <td className="py-3 text-white">
                                            {i < 3 ? ['🥇', '🥈', '🥉'][i] : ''} {c.name}
                                        </td>
                                        <td className="py-3 text-right text-slate-300">{c.rfqs}</td>
                                        <td className="py-3 text-right text-slate-300">{c.orders}</td>
                                        <td className="py-3 text-right text-green-400">₦{(c.gmv / 100).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Demand/Supply Gaps */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-white font-medium mb-4">⚡ Demand vs Supply Gaps</h3>
                        {data.demandGaps.length === 0 ? (
                            <p className="text-slate-500">No significant gaps detected</p>
                        ) : (
                            <div className="space-y-3">
                                {data.demandGaps.map((g) => (
                                    <div key={g.category} className="flex items-center gap-4">
                                        <span className="text-white w-32">{g.category}</span>
                                        <div className="flex-1 bg-slate-900 rounded-full h-4 overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${(g.supply / g.demand) * 100}%` }} />
                                        </div>
                                        <span className={`text-sm ${g.gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {g.gap > 0 ? `−${g.gap}` : `+${Math.abs(g.gap)}`} suppliers needed
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="text-center text-slate-500">No data available</div>
            )}
        </div>
    );
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="font-bold text-2xl" style={{ color }}>{value}</span>
            </div>
            <div className="text-slate-400 text-sm">{label}</div>
        </div>
    );
}
