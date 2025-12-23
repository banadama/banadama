// app/(admin)/admin/analytics/finance/page.tsx - Finance Analytics
'use client';

import { useState, useEffect } from 'react';

interface FinanceData {
    period: string;
    escrowLocked: number;
    escrowReleased: number;
    escrowBalance: number;
    platformFees: number;
    supplierPayouts: number;
    affiliatePayouts: number;
    growthPayouts: number;
    refundsIssued: number;
    refundCount: number;
    disputesOpened: number;
    disputesResolved: number;
    revenueByCategory: Array<{ category: string; revenue: number }>;
    revenueByCountry: { nigeria: number; bangladesh: number; international: number };
}

export default function FinanceAnalyticsPage() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('MONTHLY');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/analytics/finance?period=${period}`, { credentials: 'include' });
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

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;
    const formatMillions = (kobo: number) => `₦${(kobo / 100000000).toFixed(2)}M`;

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">💰 Finance Analytics</h1>
                    <p className="text-slate-400">Escrow, revenue, refunds & payouts</p>
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

            {/* RBAC Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                    Finance data is confidential. Only visible to ADMIN and FINANCE_ADMIN roles.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : data ? (
                <>
                    {/* Escrow Status */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">🔐 Escrow Status</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Locked</div>
                                <div className="text-3xl font-bold text-yellow-400">{formatMillions(data.escrowLocked)}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Released ({period.toLowerCase()})</div>
                                <div className="text-3xl font-bold text-green-400">{formatMillions(data.escrowReleased)}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Current Balance</div>
                                <div className="text-3xl font-bold text-blue-400">{formatMillions(data.escrowBalance)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-white font-medium mb-4">📈 Platform Revenue</h3>
                            <div className="text-4xl font-bold text-green-400 mb-4">{formatMoney(data.platformFees)}</div>
                            <div className="text-slate-400 text-sm">From platform fees this {period.toLowerCase()}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-white font-medium mb-4">💸 Payouts</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Supplier Payouts</span>
                                    <span className="text-white font-medium">{formatMoney(data.supplierPayouts)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Affiliate Payouts</span>
                                    <span className="text-white font-medium">{formatMoney(data.affiliatePayouts)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Growth Payouts</span>
                                    <span className="text-white font-medium">{formatMoney(data.growthPayouts)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refunds & Disputes */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">⚖️ Refunds & Disputes</h3>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Refunds Issued</div>
                                <div className="text-2xl font-bold text-red-400">{formatMoney(data.refundsIssued)}</div>
                                <div className="text-xs text-slate-500">{data.refundCount} refunds</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Disputes Opened</div>
                                <div className="text-2xl font-bold text-yellow-400">{data.disputesOpened}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Disputes Resolved</div>
                                <div className="text-2xl font-bold text-green-400">{data.disputesResolved}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Resolution Rate</div>
                                <div className="text-2xl font-bold text-blue-400">
                                    {data.disputesOpened > 0
                                        ? `${((data.disputesResolved / data.disputesOpened) * 100).toFixed(0)}%`
                                        : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue by Country */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                        <h3 className="text-white font-medium mb-4">🌍 Revenue by Country</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl mb-2">🇳🇬</div>
                                <div className="text-2xl font-bold text-white">{formatMoney(data.revenueByCountry.nigeria)}</div>
                                <div className="text-slate-400 text-sm">Nigeria</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🇧🇩</div>
                                <div className="text-2xl font-bold text-white">{formatMoney(data.revenueByCountry.bangladesh)}</div>
                                <div className="text-slate-400 text-sm">Bangladesh</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🌐</div>
                                <div className="text-2xl font-bold text-white">{formatMoney(data.revenueByCountry.international)}</div>
                                <div className="text-slate-400 text-sm">International</div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue by Category */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-white font-medium mb-4">📊 Revenue by Category</h3>
                        {data.revenueByCategory.length === 0 ? (
                            <p className="text-slate-500">No category data</p>
                        ) : (
                            <div className="space-y-3">
                                {data.revenueByCategory.map((c) => (
                                    <div key={c.category} className="flex items-center gap-4">
                                        <span className="text-white w-32">{c.category}</span>
                                        <div className="flex-1 bg-slate-900 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="h-full bg-green-500"
                                                style={{
                                                    width: `${(c.revenue / Math.max(...data.revenueByCategory.map(x => x.revenue))) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-green-400 font-medium w-24 text-right">{formatMoney(c.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* AI Insight */}
                    <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <div className="text-purple-400 font-medium">AI SUGGESTED</div>
                                <div className="text-slate-400 text-sm">
                                    {data.refundCount > 10
                                        ? `High refund volume (${data.refundCount}). Review supplier quality.`
                                        : data.escrowBalance > data.escrowReleased * 2
                                            ? 'Escrow balance is high. Consider faster fulfillment cycles.'
                                            : 'Financial metrics are within normal ranges.'}
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
