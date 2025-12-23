// app/(affiliate)/affiliate/earnings/page.tsx - Affiliate Earnings History
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface EarningSummary {
    totalEarnings: number;
    pendingEarnings: number;
    availableToWithdraw: number;
    paidEarnings: number;
}

interface EarningEntry {
    id: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    createdAt: string;
}

export default function AffiliateEarningsPage() {
    const [summary, setSummary] = useState<EarningSummary>({
        totalEarnings: 0,
        pendingEarnings: 0,
        availableToWithdraw: 0,
        paidEarnings: 0,
    });
    const [history, setHistory] = useState<EarningEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const res = await fetch('/api/affiliate/earnings', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data.summary || summary);
                    setHistory(data.history || []);
                }
            } catch (err) {
                console.error('Error fetching earnings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Earnings</h1>
                <p className="text-slate-400">Your commission earnings and history</p>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading earnings...</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Total Earnings</div>
                            <div className="text-2xl font-bold text-purple-400">{formatMoney(summary.totalEarnings)}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Pending (Awaiting Delivery)</div>
                            <div className="text-2xl font-bold text-yellow-400">{formatMoney(summary.pendingEarnings)}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Available to Withdraw</div>
                            <div className="text-2xl font-bold text-green-400">{formatMoney(summary.availableToWithdraw)}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-slate-400 text-sm mb-2">Already Paid Out</div>
                            <div className="text-2xl font-bold text-slate-400">{formatMoney(summary.paidEarnings)}</div>
                        </div>
                    </div>

                    {/* Withdraw Button */}
                    {summary.availableToWithdraw > 0 && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8 flex justify-between items-center">
                            <div>
                                <div className="text-green-400 font-medium">You have earnings available to withdraw!</div>
                                <div className="text-slate-400 text-sm">Request a payout to your account</div>
                            </div>
                            <Link href="/affiliate/withdraw">
                                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    🏦 Withdraw {formatMoney(summary.availableToWithdraw)}
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Earnings History */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700">
                            <h3 className="text-white font-medium">Earnings History</h3>
                        </div>
                        {history.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No earnings yet</div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Description</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Amount</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {history.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-800/50">
                                            <td className="px-6 py-4 text-slate-400 text-sm">
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">{entry.type}</td>
                                            <td className="px-6 py-4 text-slate-400">{entry.description}</td>
                                            <td className={`px-6 py-4 text-right font-medium ${entry.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {entry.amount >= 0 ? '+' : ''}{formatMoney(entry.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs ${entry.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                                                        entry.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                    }`}>
                                                    {entry.status}
                                                </span>
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
