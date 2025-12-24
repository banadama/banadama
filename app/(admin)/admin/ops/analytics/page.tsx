// app/(ops)/ops/analytics/page.tsx - Ops Analytics (Limited View)
'use client';

import { useState, useEffect } from 'react';

interface OpsMyData {
    personalMetrics: {
        rfqsHandled: number;
        avgResponseTimeHours: number;
        ordersProcessed: number;
        onTimeRate: number;
    };
    teamAverages: {
        avgResponseTimeHours: number;
        avgOnTimeRate: number;
    };
    myRanking: {
        position: number;
        total: number;
    };
    recentInsights: Array<{
        id: string;
        title: string;
        description: string;
        priority: string;
    }>;
}

export default function OpsAnalyticsPage() {
    const [data, setData] = useState<OpsMyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/ops/analytics', { credentials: 'include' });
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

    const formatHours = (h: number) => {
        if (h < 1) return `${Math.round(h * 60)}m`;
        return `${h.toFixed(1)}h`;
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">📊 My Performance</h1>
                <p className="text-slate-400">Your ops metrics and insights</p>
            </div>

            {/* RBAC Notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-400 text-sm">
                    ℹ️ You can see your personal metrics and ops-related insights.
                    Full platform analytics are available to Admin only.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : data ? (
                <>
                    {/* My Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-400">{data.personalMetrics.rfqsHandled}</div>
                            <div className="text-slate-400 text-sm">RFQs Handled</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-purple-400">{formatHours(data.personalMetrics.avgResponseTimeHours)}</div>
                            <div className="text-slate-400 text-sm">Avg Response</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-400">{data.personalMetrics.ordersProcessed}</div>
                            <div className="text-slate-400 text-sm">Orders Processed</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-orange-400">{(data.personalMetrics.onTimeRate * 100).toFixed(0)}%</div>
                            <div className="text-slate-400 text-sm">On-Time Rate</div>
                        </div>
                    </div>

                    {/* Comparison */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">📈 vs Team Average</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-slate-400 text-sm mb-2">Response Time</div>
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-bold text-white">{formatHours(data.personalMetrics.avgResponseTimeHours)}</div>
                                    <span className="text-slate-500">vs</span>
                                    <div className="text-xl text-slate-400">{formatHours(data.teamAverages.avgResponseTimeHours)} avg</div>
                                    {data.personalMetrics.avgResponseTimeHours < data.teamAverages.avgResponseTimeHours ? (
                                        <span className="text-green-400 text-sm">✓ Faster</span>
                                    ) : (
                                        <span className="text-yellow-400 text-sm">⚠ Slower</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-2">On-Time Rate</div>
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-bold text-white">{(data.personalMetrics.onTimeRate * 100).toFixed(0)}%</div>
                                    <span className="text-slate-500">vs</span>
                                    <div className="text-xl text-slate-400">{(data.teamAverages.avgOnTimeRate * 100).toFixed(0)}% avg</div>
                                    {data.personalMetrics.onTimeRate >= data.teamAverages.avgOnTimeRate ? (
                                        <span className="text-green-400 text-sm">✓ Better</span>
                                    ) : (
                                        <span className="text-yellow-400 text-sm">⚠ Below avg</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ranking */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">🏆 Your Ranking</h3>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-green-400">#{data.myRanking.position}</div>
                            <div className="text-slate-400 mt-2">out of {data.myRanking.total} ops members</div>
                        </div>
                    </div>

                    {/* Ops Insights */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-white font-medium mb-4">🤖 Ops Insights</h3>
                        {data.recentInsights.length === 0 ? (
                            <p className="text-green-400">No pending insights for you. Great work!</p>
                        ) : (
                            <div className="space-y-3">
                                {data.recentInsights.map((insight) => (
                                    <div key={insight.id} className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-purple-400 font-medium">{insight.title}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${insight.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {insight.priority}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm">{insight.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-slate-500 mt-4">
                            AI insights are suggestions only. They do not affect your evaluation.
                        </p>
                    </div>
                </>
            ) : null}
        </div>
    );
}
