// app/(growth)/growth/earnings/page.tsx - Growth Agent Earnings
'use client';

import { useState, useEffect } from 'react';

interface EarningSummary {
    totalEarnings: number;
    pendingEarnings: number;
    unlockedEarnings: number;
    paidEarnings: number;
}

interface Earning {
    id: string;
    type: string;
    amount: number;
    status: string;
    description?: string;
    unlockProgress?: number;
    unlockTarget?: number;
    createdAt: string;
}

export default function GrowthEarningsPage() {
    const [summary, setSummary] = useState<EarningSummary>({
        totalEarnings: 0,
        pendingEarnings: 0,
        unlockedEarnings: 0,
        paidEarnings: 0,
    });
    const [earnings, setEarnings] = useState<Earning[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawing, setWithdrawing] = useState(false);

    const fetchEarnings = async () => {
        try {
            const res = await fetch('/api/growth/earnings', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setSummary(data.summary || summary);
                setEarnings(data.earnings || []);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    const handleWithdraw = async () => {
        if (summary.unlockedEarnings < 500000) {
            alert('Minimum withdrawal is ₦5,000');
            return;
        }

        if (!confirm(`Request withdrawal of ₦${(summary.unlockedEarnings / 100).toLocaleString()}?`)) {
            return;
        }

        setWithdrawing(true);
        try {
            const res = await fetch('/api/growth/withdraw', {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                alert('Withdrawal request submitted. Finance will review.');
                fetchEarnings();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to request withdrawal');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setWithdrawing(false);
        }
    };

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'SUPPLIER_ONBOARD': return '🏭 Supplier Onboard';
            case 'SUPPLIER_FIRST_ORDER': return '🎉 First Order Bonus';
            case 'ORDER_COMMISSION': return '📦 Order Commission';
            case 'BONUS': return '⭐ Bonus';
            default: return type;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
            case 'UNLOCKED': return 'bg-green-500/20 text-green-400';
            case 'PAID': return 'bg-blue-500/20 text-blue-400';
            case 'REVERSED': return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">💰 Earnings</h1>
                <p className="text-slate-400">Your commission earnings from supplier onboarding</p>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Total Earnings</div>
                            <div className="text-2xl font-bold text-white">{formatMoney(summary.totalEarnings)}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Pending (Locked)</div>
                            <div className="text-2xl font-bold text-yellow-400">{formatMoney(summary.pendingEarnings)}</div>
                            <div className="text-xs text-slate-500 mt-1">Awaiting activity</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Unlocked (Withdrawable)</div>
                            <div className="text-2xl font-bold text-green-400">{formatMoney(summary.unlockedEarnings)}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Paid Out</div>
                            <div className="text-2xl font-bold text-blue-400">{formatMoney(summary.paidEarnings)}</div>
                        </div>
                    </div>

                    {/* Withdraw Button */}
                    {summary.unlockedEarnings >= 500000 && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8 flex justify-between items-center">
                            <div>
                                <div className="text-green-400 font-medium">You have earnings available!</div>
                                <div className="text-slate-400 text-sm">Request payout to your account</div>
                            </div>
                            <button
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                onClick={handleWithdraw}
                                disabled={withdrawing}
                            >
                                {withdrawing ? 'Submitting...' : `💸 Withdraw ${formatMoney(summary.unlockedEarnings)}`}
                            </button>
                        </div>
                    )}

                    {/* Pending Explanation */}
                    {summary.pendingEarnings > 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                            <p className="text-yellow-400 text-sm">
                                ⏳ <strong>Pending earnings</strong> are locked until your onboarded suppliers complete orders.
                                This protects against fake onboarding.
                            </p>
                        </div>
                    )}

                    {/* Earnings List */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700">
                            <h3 className="text-white font-medium">Earnings History</h3>
                        </div>
                        {earnings.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No earnings yet</div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Description</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Amount</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {earnings.map((e) => (
                                        <tr key={e.id} className="hover:bg-slate-800/50">
                                            <td className="px-6 py-4 text-white">{getTypeLabel(e.type)}</td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {e.description}
                                                {e.status === 'PENDING' && e.unlockTarget && (
                                                    <div className="text-xs text-yellow-400 mt-1">
                                                        Progress: {e.unlockProgress || 0} / {e.unlockTarget} orders
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-green-400 font-medium">
                                                {formatMoney(e.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(e.status)}`}>
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">
                                                {new Date(e.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
