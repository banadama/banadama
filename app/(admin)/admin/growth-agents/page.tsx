// app/(admin)/admin/studio/growth-agents/page.tsx - Manage Growth Agents
'use client';

import { useState, useEffect } from 'react';

interface GrowthAgent {
    id: string;
    userId: string;
    displayName?: string;
    phone?: string;
    region?: string;
    territory?: string;
    role: string;
    status: string;
    totalSuppliersOnboarded: number;
    activeSuppliersCount: number;
    totalEarnings: number;
    pendingEarnings: number;
    createdAt: string;
    user?: {
        email: string;
        name?: string;
    };
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    ACTIVE: 'bg-green-500/20 text-green-400',
    SUSPENDED: 'bg-red-500/20 text-red-400',
    TERMINATED: 'bg-red-700/20 text-red-500',
};

export default function GrowthAgentsPage() {
    const [agents, setAgents] = useState<GrowthAgent[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/admin/growth/agents?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setAgents(data.agents || []);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [statusFilter]);

    const handleAction = async (agentId: string, action: string) => {
        const reason = (action === 'suspend' || action === 'terminate') ? prompt('Reason:') : undefined;
        if ((action === 'suspend' || action === 'terminate') && !reason) return;

        try {
            const res = await fetch(`/api/admin/growth/agents/${agentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action, reason }),
            });
            if (res.ok) {
                fetchAgents();
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">👥 Growth Agents</h1>
                    <p className="text-slate-400">Manage field agents and their performance</p>
                </div>
                <a href="/admin/studio/growth-settings">
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                        ⚙️ Settings
                    </button>
                </a>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6">
                {['', 'PENDING', 'ACTIVE', 'SUSPENDED'].map((s) => (
                    <button
                        key={s}
                        className={`px-4 py-2 rounded-lg text-sm ${statusFilter === s ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setStatusFilter(s)}
                    >
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {/* Agents Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : agents.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No agents found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Agent</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Region</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Suppliers</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Active</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Earnings</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{agent.displayName || agent.user?.name || 'Unknown'}</div>
                                        <div className="text-sm text-slate-500">{agent.user?.email}</div>
                                        <div className="text-xs text-slate-600">{agent.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[agent.status]}`}>
                                            {agent.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-300">
                                        {agent.region || '-'}
                                        {agent.territory && <div className="text-xs text-slate-500">{agent.territory}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-white">{agent.totalSuppliersOnboarded}</td>
                                    <td className="px-6 py-4 text-center text-green-400">{agent.activeSuppliersCount}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-white">{formatMoney(agent.totalEarnings)}</div>
                                        {agent.pendingEarnings > 0 && (
                                            <div className="text-xs text-yellow-400">{formatMoney(agent.pendingEarnings)} pending</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex gap-1 justify-center">
                                            {agent.status === 'PENDING' && (
                                                <button
                                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                                                    onClick={() => handleAction(agent.id, 'approve')}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {agent.status === 'ACTIVE' && (
                                                <button
                                                    className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                                                    onClick={() => handleAction(agent.id, 'suspend')}
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                            {agent.status === 'SUSPENDED' && (
                                                <button
                                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                                                    onClick={() => handleAction(agent.id, 'activate')}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
