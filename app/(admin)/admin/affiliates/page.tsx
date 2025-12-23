// app/(admin)/admin/studio/affiliates/page.tsx - Admin Affiliate Management
'use client';

import { useState, useEffect } from 'react';

interface Affiliate {
    id: string;
    userId: string;
    displayName?: string;
    status: string;
    totalClicks: number;
    totalSales: number;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
    customCommissionRate?: number;
    createdAt: string;
    user?: {
        email: string;
        name?: string;
    };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
    ACTIVE: { label: 'Active', color: 'bg-green-500/20 text-green-400' },
    SUSPENDED: { label: 'Suspended', color: 'bg-red-500/20 text-red-400' },
    BANNED: { label: 'Banned', color: 'bg-red-700/20 text-red-500' },
};

export default function AdminAffiliatesPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchAffiliates = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/admin/affiliates?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setAffiliates(data.affiliates || []);
            }
        } catch (err) {
            console.error('Error fetching affiliates:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAffiliates();
    }, [statusFilter]);

    const handleAction = async (affiliateId: string, action: string) => {
        const reason = action === 'suspend' || action === 'ban' ? prompt('Reason:') : undefined;
        if ((action === 'suspend' || action === 'ban') && !reason) return;

        try {
            const res = await fetch(`/api/admin/affiliates/${affiliateId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action, reason }),
            });

            if (res.ok) {
                alert(`Affiliate ${action}d successfully`);
                fetchAffiliates();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to perform action');
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
                    <h1 className="text-2xl font-bold text-white mb-2">Affiliate Management</h1>
                    <p className="text-slate-400">Manage affiliate accounts and commissions</p>
                </div>
                <a href="/admin/studio/affiliate-settings">
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                        ⚙️ Settings
                    </button>
                </a>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {[
                    { value: '', label: 'All' },
                    { value: 'PENDING', label: 'Pending Approval' },
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'SUSPENDED', label: 'Suspended' },
                ].map((opt) => (
                    <button
                        key={opt.value}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === opt.value
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        onClick={() => setStatusFilter(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Affiliates Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading affiliates...</div>
                ) : affiliates.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No affiliates found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">User</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Clicks</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Sales</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Earnings</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Pending</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Rate</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {affiliates.map((aff) => (
                                <tr key={aff.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{aff.displayName || aff.user?.name || 'Unknown'}</div>
                                        <div className="text-sm text-slate-500">{aff.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[aff.status]?.color || 'bg-slate-500/20 text-slate-400'}`}>
                                            {STATUS_LABELS[aff.status]?.label || aff.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-300">{aff.totalClicks.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-green-400">{aff.totalSales}</td>
                                    <td className="px-6 py-4 text-right text-purple-400">{formatMoney(aff.totalEarnings)}</td>
                                    <td className="px-6 py-4 text-right text-yellow-400">{formatMoney(aff.pendingEarnings)}</td>
                                    <td className="px-6 py-4 text-center text-slate-300">
                                        {aff.customCommissionRate ? `${(aff.customCommissionRate * 100).toFixed(1)}%` : 'Default'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex gap-1 justify-center">
                                            {aff.status === 'PENDING' && (
                                                <button
                                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                    onClick={() => handleAction(aff.id, 'approve')}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {aff.status === 'ACTIVE' && (
                                                <button
                                                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                                    onClick={() => handleAction(aff.id, 'suspend')}
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                            {aff.status === 'SUSPENDED' && (
                                                <button
                                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                    onClick={() => handleAction(aff.id, 'activate')}
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
