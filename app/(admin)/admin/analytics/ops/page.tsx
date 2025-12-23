// app/(admin)/admin/analytics/ops/page.tsx - Ops Performance Analytics
'use client';

import { useState, useEffect } from 'react';

interface OpsData {
    period: string;
    avgRfqResponseTimeHours: number;
    avgOrderProcessingHours: number;
    avgDeliveryTimeHours: number;
    avgChatResponseTimeMinutes: number;
    rfqsCompleted: number;
    ordersProcessed: number;
    deliveriesOnTime: number;
    deliveriesLate: number;
    onTimeRate: number;
    opsUserMetrics: Array<{
        userId: string;
        name: string;
        rfqsHandled: number;
        avgResponseTime: number;
        rating: number;
    }>;
}

export default function OpsAnalyticsPage() {
    const [data, setData] = useState<OpsData | null>(null);
    const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/analytics/ops?period=${period}`, { credentials: 'include' });
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

    const formatHours = (h: number) => {
        if (h < 1) return `${Math.round(h * 60)}m`;
        return `${h.toFixed(1)}h`;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">🔧 Ops Performance</h1>
                    <p className="text-slate-400">Operations team metrics and efficiency</p>
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

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : data ? (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-400">{formatHours(data.avgRfqResponseTimeHours)}</div>
                            <div className="text-slate-400 text-sm">Avg RFQ Response</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-purple-400">{formatHours(data.avgOrderProcessingHours)}</div>
                            <div className="text-slate-400 text-sm">Avg Order Processing</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-400">{formatHours(data.avgDeliveryTimeHours)}</div>
                            <div className="text-slate-400 text-sm">Avg Delivery Time</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-orange-400">{data.avgChatResponseTimeMinutes.toFixed(0)}m</div>
                            <div className="text-slate-400 text-sm">Avg Chat Response</div>
                        </div>
                    </div>

                    {/* Volume Metrics */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">RFQs Completed</div>
                            <div className="text-3xl font-bold text-white">{data.rfqsCompleted}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Orders Processed</div>
                            <div className="text-3xl font-bold text-white">{data.ordersProcessed}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">On-Time Delivery Rate</div>
                            <div className="text-3xl font-bold text-green-400">{(data.onTimeRate * 100).toFixed(1)}%</div>
                            <div className="text-xs text-slate-500 mt-1">
                                {data.deliveriesOnTime} on-time / {data.deliveriesLate} late
                            </div>
                        </div>
                    </div>

                    {/* Ops Team Performance */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-white font-medium mb-4">👥 Ops Team Performance</h3>
                        {data.opsUserMetrics.length === 0 ? (
                            <p className="text-slate-500">No ops user data available</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-slate-400 text-sm">
                                        <th className="text-left pb-3">Ops Member</th>
                                        <th className="text-center pb-3">RFQs Handled</th>
                                        <th className="text-center pb-3">Avg Response</th>
                                        <th className="text-center pb-3">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {data.opsUserMetrics.map((u) => (
                                        <tr key={u.userId}>
                                            <td className="py-3 text-white">{u.name}</td>
                                            <td className="py-3 text-center text-slate-300">{u.rfqsHandled}</td>
                                            <td className="py-3 text-center text-slate-300">{formatHours(u.avgResponseTime)}</td>
                                            <td className="py-3 text-center">
                                                <span className={`font-bold ${u.rating >= 4 ? 'text-green-400' : u.rating >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {u.rating.toFixed(1)} ⭐
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* AI Insight */}
                    <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <div className="text-purple-400 font-medium">AI SUGGESTED</div>
                                <div className="text-slate-400 text-sm">
                                    {data.avgRfqResponseTimeHours > 24
                                        ? 'RFQ response time is above 24h. Consider adding more Ops capacity.'
                                        : data.onTimeRate < 0.9
                                            ? 'On-time delivery rate is below 90%. Review logistics bottlenecks.'
                                            : 'Ops performance is within target parameters.'}
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
