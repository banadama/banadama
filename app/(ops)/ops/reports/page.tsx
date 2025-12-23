// app/(ops)/ops/reports/page.tsx - Daily Reports & KPI Tracking
'use client';

import { useState, useEffect } from 'react';

interface DailyStats {
    date: string;
    newRfqs: number;
    processedRfqs: number;
    newOrders: number;
    deliveredOrders: number;
    openDisputes: number;
    resolvedDisputes: number;
    verificationsPending: number;
    verificationsReviewed: number;
    messagesReceived: number;
    messagesReplied: number;
}

export default function OpsReportsPage() {
    const [stats, setStats] = useState<DailyStats | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/ops/reports/daily', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.today);
                    setWeeklyStats(data.weekly || []);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const kpis = stats ? [
        { label: 'RFQ Processing Rate', value: stats.newRfqs > 0 ? Math.round((stats.processedRfqs / stats.newRfqs) * 100) : 100, unit: '%', target: 90 },
        { label: 'Order Delivery Rate', value: stats.newOrders > 0 ? Math.round((stats.deliveredOrders / stats.newOrders) * 100) : 100, unit: '%', target: 95 },
        { label: 'Dispute Resolution', value: stats.openDisputes + stats.resolvedDisputes > 0 ? Math.round((stats.resolvedDisputes / (stats.openDisputes + stats.resolvedDisputes)) * 100) : 100, unit: '%', target: 80 },
        { label: 'Message Response Rate', value: stats.messagesReceived > 0 ? Math.round((stats.messagesReplied / stats.messagesReceived) * 100) : 100, unit: '%', target: 95 },
    ] : [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Daily Reports</h1>
                    <p className="text-slate-400">Track your daily operations and KPIs</p>
                </div>
                <div className="text-slate-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading reports...</div>
            ) : (
                <>
                    {/* Today's Numbers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard label="New RFQs" value={stats?.newRfqs || 0} icon="📝" />
                        <StatCard label="Processed RFQs" value={stats?.processedRfqs || 0} icon="✓" color="green" />
                        <StatCard label="New Orders" value={stats?.newOrders || 0} icon="🛒" />
                        <StatCard label="Delivered" value={stats?.deliveredOrders || 0} icon="📦" color="green" />
                        <StatCard label="Open Disputes" value={stats?.openDisputes || 0} icon="⚠️" color="red" />
                        <StatCard label="Resolved" value={stats?.resolvedDisputes || 0} icon="✓" color="green" />
                        <StatCard label="Pending Verifications" value={stats?.verificationsPending || 0} icon="📋" />
                        <StatCard label="Reviewed" value={stats?.verificationsReviewed || 0} icon="✓" color="green" />
                    </div>

                    {/* KPIs */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4">Key Performance Indicators</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {kpis.map((kpi) => (
                                <div key={kpi.label}>
                                    <div className="text-slate-400 text-sm mb-2">{kpi.label}</div>
                                    <div className="flex items-end gap-2">
                                        <span className={`text-3xl font-bold ${kpi.value >= kpi.target ? 'text-green-400' : 'text-yellow-400'
                                            }`}>
                                            {kpi.value}{kpi.unit}
                                        </span>
                                        <span className="text-slate-500 text-sm mb-1">Target: {kpi.target}{kpi.unit}</span>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${kpi.value >= kpi.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                                            style={{ width: `${Math.min(kpi.value, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Trend */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">This Week's Activity</h2>
                        {weeklyStats.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-slate-400 text-sm">
                                            <th className="pb-3">Date</th>
                                            <th className="pb-3">RFQs</th>
                                            <th className="pb-3">Orders</th>
                                            <th className="pb-3">Disputes</th>
                                            <th className="pb-3">Verifications</th>
                                            <th className="pb-3">Messages</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {weeklyStats.map((day) => (
                                            <tr key={day.date} className="text-slate-300">
                                                <td className="py-3">{new Date(day.date).toLocaleDateString()}</td>
                                                <td className="py-3">{day.processedRfqs}/{day.newRfqs}</td>
                                                <td className="py-3">{day.deliveredOrders}/{day.newOrders}</td>
                                                <td className="py-3">{day.resolvedDisputes}/{day.openDisputes + day.resolvedDisputes}</td>
                                                <td className="py-3">{day.verificationsReviewed}/{day.verificationsPending + day.verificationsReviewed}</td>
                                                <td className="py-3">{day.messagesReplied}/{day.messagesReceived}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 py-8">No weekly data available</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color?: string }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                <span className={`text-2xl font-bold ${color === 'green' ? 'text-green-400' :
                        color === 'red' ? 'text-red-400' :
                            'text-white'
                    }`}>
                    {value}
                </span>
            </div>
            <div className="text-slate-400 text-sm">{label}</div>
        </div>
    );
}
