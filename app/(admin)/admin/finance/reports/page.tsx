// app/(admin)/admin/finance/reports/page.tsx - Financial Reports
'use client';

import { useState, useEffect } from 'react';

interface FinanceReport {
    daily: {
        date: string;
        escrowLocked: number;
        payoutsReleased: number;
        refundsIssued: number;
        platformFees: number;
    };
    weekly: {
        platformRevenue: number;
        supplierEarnings: number;
        totalTransactions: number;
    };
    monthly: {
        byCountry: Array<{ country: string; revenue: number; fees: number }>;
        byCategory: Array<{ category: string; revenue: number; fees: number }>;
    };
}

export default function ReportsPage() {
    const [report, setReport] = useState<FinanceReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/finance/reports?period=${period}`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setReport(data);
                }
            } catch (err) {
                console.error('Error fetching report:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [period]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700 }}>📈 Financial Reports</h1>
                <p style={{ color: '#94a3b8' }}>Revenue, fees, and financial analytics</p>
            </div>

            {/* Period Selector */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                    <button
                        key={p}
                        className={`finance-btn ${period === p ? 'finance-btn-primary' : ''}`}
                        style={{ background: period !== p ? 'rgba(148, 163, 184, 0.2)' : undefined, color: period !== p ? '#94a3b8' : undefined }}
                        onClick={() => setPeriod(p)}
                    >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="finance-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: '#94a3b8' }}>Loading reports...</div>
                </div>
            ) : !report ? (
                <div className="finance-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: '#64748b' }}>Report data not available</div>
                </div>
            ) : (
                <>
                    {/* Daily Summary */}
                    {period === 'daily' && (
                        <div className="finance-card">
                            <h3>📅 Today's Summary</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Escrow Locked</div>
                                    <div style={{ color: '#facc15', fontSize: '1.5rem', fontWeight: 700 }}>
                                        {formatMoney(report.daily.escrowLocked)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Payouts Released</div>
                                    <div style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 700 }}>
                                        {formatMoney(report.daily.payoutsReleased)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Refunds Issued</div>
                                    <div style={{ color: '#f87171', fontSize: '1.5rem', fontWeight: 700 }}>
                                        {formatMoney(report.daily.refundsIssued)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Platform Fees</div>
                                    <div style={{ color: '#a78bfa', fontSize: '1.5rem', fontWeight: 700 }}>
                                        {formatMoney(report.daily.platformFees)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Weekly Summary */}
                    {period === 'weekly' && (
                        <div className="finance-card">
                            <h3>📊 This Week</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Platform Revenue</div>
                                    <div style={{ color: '#4ade80', fontSize: '2rem', fontWeight: 700 }}>
                                        {formatMoney(report.weekly.platformRevenue)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Supplier Earnings</div>
                                    <div style={{ color: '#60a5fa', fontSize: '2rem', fontWeight: 700 }}>
                                        {formatMoney(report.weekly.supplierEarnings)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Transactions</div>
                                    <div style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>
                                        {report.weekly.totalTransactions.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Monthly Breakdown */}
                    {period === 'monthly' && (
                        <>
                            <div className="finance-card">
                                <h3>🌍 Revenue by Country</h3>
                                <table className="finance-table">
                                    <thead>
                                        <tr>
                                            <th>Country</th>
                                            <th>Revenue</th>
                                            <th>Platform Fees</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.monthly.byCountry.map((item) => (
                                            <tr key={item.country}>
                                                <td>{item.country === 'NG' ? '🇳🇬 Nigeria' : '🇧🇩 Bangladesh'}</td>
                                                <td className="money-positive">{formatMoney(item.revenue)}</td>
                                                <td>{formatMoney(item.fees)}</td>
                                            </tr>
                                        ))}
                                        {report.monthly.byCountry.length === 0 && (
                                            <tr><td colSpan={3} style={{ textAlign: 'center', color: '#64748b' }}>No data</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="finance-card">
                                <h3>📂 Revenue by Category</h3>
                                <table className="finance-table">
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Revenue</th>
                                            <th>Platform Fees</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.monthly.byCategory.map((item) => (
                                            <tr key={item.category}>
                                                <td>{item.category}</td>
                                                <td className="money-positive">{formatMoney(item.revenue)}</td>
                                                <td>{formatMoney(item.fees)}</td>
                                            </tr>
                                        ))}
                                        {report.monthly.byCategory.length === 0 && (
                                            <tr><td colSpan={3} style={{ textAlign: 'center', color: '#64748b' }}>No data</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Export */}
            <div className="finance-card">
                <h3>📥 Export</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="finance-btn finance-btn-primary" disabled>
                        Export CSV (Coming Soon)
                    </button>
                    <button className="finance-btn" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8' }} disabled>
                        Export PDF (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
}
