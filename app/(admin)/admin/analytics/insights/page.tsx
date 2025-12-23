// app/(admin)/admin/analytics/insights/page.tsx - AI Insights Dashboard
'use client';

import { useState, useEffect } from 'react';

interface AIInsight {
    id: string;
    agentType: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    suggestedAction?: string;
    targetType?: string;
    createdAt: string;
}

const PRIORITY_COLORS: Record<string, string> = {
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    LOW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const AGENT_ICONS: Record<string, string> = {
    MARKET_AI: '📊',
    SUPPLIER_AI: '🏭',
    BUYER_AI: '👥',
    OPS_AI: '🔧',
    PRICING_AI: '💰',
    FINANCE_AI: '💵',
};

export default function AIInsightsPage() {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ACTIVE' | 'ACKNOWLEDGED' | 'ALL'>('ACTIVE');

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/analytics/insights?status=${filter}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setInsights(data.insights || []);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, [filter]);

    const handleAction = async (id: string, action: 'acknowledge' | 'dismiss') => {
        try {
            const res = await fetch(`/api/admin/analytics/insights/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action }),
            });
            if (res.ok) {
                fetchInsights();
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">🤖 AI Insights</h1>
                <p className="text-slate-400">AI-generated recommendations for your review</p>
            </div>

            {/* Core Principle */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                        <div className="text-purple-400 font-medium">AI = RECOMMENDATION | HUMAN = FINAL DECISION</div>
                        <div className="text-slate-400 text-sm">
                            AI insights are suggestions only. You decide what action to take.
                            <strong className="text-red-400 ml-2">AI never auto-executes.</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {(['ACTIVE', 'ACKNOWLEDGED', 'ALL'] as const).map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg text-sm ${filter === f ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Insights List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading insights...</div>
            ) : insights.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                    <span className="text-4xl">✨</span>
                    <p className="text-slate-400 mt-4">No active insights. Everything looks good!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {insights.map((insight) => (
                        <div
                            key={insight.id}
                            className={`rounded-xl p-6 border ${PRIORITY_COLORS[insight.priority] || 'bg-slate-800/50 border-slate-700'}`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{AGENT_ICONS[insight.agentType] || '🤖'}</span>
                                    <div>
                                        <div className="text-white font-medium">{insight.title}</div>
                                        <div className="text-xs text-slate-500">
                                            {insight.agentType.replace(/_/g, ' ')} • {new Date(insight.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[insight.priority]}`}>
                                    {insight.priority}
                                </span>
                            </div>

                            <p className="text-slate-300 mb-4">{insight.description}</p>

                            {insight.suggestedAction && (
                                <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                                    <div className="text-xs text-slate-500 mb-1">Suggested Action</div>
                                    <div className="text-slate-200">{insight.suggestedAction}</div>
                                </div>
                            )}

                            {insight.status === 'ACTIVE' && (
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                        onClick={() => handleAction(insight.id, 'acknowledge')}
                                    >
                                        ✓ Acknowledge
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600"
                                        onClick={() => handleAction(insight.id, 'dismiss')}
                                    >
                                        ✗ Dismiss
                                    </button>
                                </div>
                            )}

                            {insight.status === 'ACKNOWLEDGED' && (
                                <div className="text-green-400 text-sm">✓ Acknowledged</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Safety Notice */}
            <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-medium mb-2">🚫 AI Cannot:</h4>
                <ul className="text-slate-400 text-sm space-y-1">
                    <li>❌ Approve or reject payouts</li>
                    <li>❌ Assign suppliers to orders</li>
                    <li>❌ Change fees or pricing</li>
                    <li>❌ Grant verification ticks</li>
                    <li>❌ Release escrow funds</li>
                </ul>
            </div>
        </div>
    );
}
