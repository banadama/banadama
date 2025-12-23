// app/(admin)/admin/finance/dashboard/page.tsx - Finance Dashboard (SVG icons)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/icons';

interface FinanceStats {
    totalEscrowLocked: number;
    totalPendingPayouts: number;
    totalPendingRefunds: number;
    todayReleased: number;
    todayRefunded: number;
    platformBalance: number;
    platformFees: number;
}

export default function FinanceDashboardPage() {
    const [stats, setStats] = useState<FinanceStats>({
        totalEscrowLocked: 4520000000,
        totalPendingPayouts: 1250000000,
        totalPendingRefunds: 85000000,
        todayReleased: 320000000,
        todayRefunded: 45000000,
        platformBalance: 125000000,
        platformFees: 8500000,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/finance/stats', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div>
                <h1 className="bd-h1">Finance Dashboard</h1>
                <p className="bd-p" style={{ opacity: 0.7 }}>Escrow, Payouts, Refunds & Platform Revenue</p>
            </div>

            {/* Authority Warning */}
            <Card style={{ background: 'hsl(var(--bd-muted))' }}>
                <CardBody className="bd-row" style={{ gap: 16, alignItems: 'center' }}>
                    <Icons.Lock size={24} />
                    <div>
                        <div style={{ fontWeight: 700 }}>FINANCE_ADMIN Authority</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>
                            Only FINANCE_ADMIN can release escrow, approve payouts, and issue refunds.
                            All actions are logged in the audit trail.
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Stats Grid */}
            <div className="bd-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                <Link href="/admin/finance/escrow">
                    <Card style={{ cursor: 'pointer' }}>
                        <CardBody>
                            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Icons.Lock size={24} />
                                <span style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-warning))' }}>
                                    {loading ? '...' : formatMoney(stats.totalEscrowLocked)}
                                </span>
                            </div>
                            <div className="bd-small" style={{ opacity: 0.7, marginTop: 8 }}>Escrow Locked</div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/admin/finance/payouts">
                    <Card style={{ cursor: 'pointer' }}>
                        <CardBody>
                            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Icons.Bank size={24} />
                                <span style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-brand-2))' }}>
                                    {loading ? '...' : formatMoney(stats.totalPendingPayouts)}
                                </span>
                            </div>
                            <div className="bd-small" style={{ opacity: 0.7, marginTop: 8 }}>Pending Payouts</div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/admin/finance/refunds">
                    <Card style={{ cursor: 'pointer' }}>
                        <CardBody>
                            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Icons.Receipt size={24} />
                                <span style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-danger))' }}>
                                    {loading ? '...' : formatMoney(stats.totalPendingRefunds)}
                                </span>
                            </div>
                            <div className="bd-small" style={{ opacity: 0.7, marginTop: 8 }}>Pending Refunds</div>
                        </CardBody>
                    </Card>
                </Link>

                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Icons.Check size={24} />
                            <span style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-success))' }}>
                                {loading ? '...' : formatMoney(stats.todayReleased)}
                            </span>
                        </div>
                        <div className="bd-small" style={{ opacity: 0.7, marginTop: 8 }}>Released Today</div>
                    </CardBody>
                </Card>

                <Link href="/admin/finance/reports">
                    <Card style={{ cursor: 'pointer' }}>
                        <CardBody>
                            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Icons.TrendingUp size={24} />
                                <span style={{ fontSize: 24, fontWeight: 900 }}>
                                    {loading ? '...' : formatMoney(stats.platformFees)}
                                </span>
                            </div>
                            <div className="bd-small" style={{ opacity: 0.7, marginTop: 8 }}>Platform Fees (MTD)</div>
                        </CardBody>
                    </Card>
                </Link>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <div className="bd-h3">Quick Actions</div>
                </CardHeader>
                <CardBody>
                    <div className="bd-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        <Link href="/admin/finance/escrow?status=LOCKED">
                            <Button variant="soft" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icons.Lock size={16} /> Review Locked Escrow
                            </Button>
                        </Link>
                        <Link href="/admin/finance/payouts?status=PENDING_APPROVAL">
                            <Button variant="primary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icons.Bank size={16} /> Approve Payouts
                            </Button>
                        </Link>
                        <Link href="/admin/finance/refunds?status=PENDING_REVIEW">
                            <Button variant="danger" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icons.Receipt size={16} /> Process Refunds
                            </Button>
                        </Link>
                        <Link href="/admin/finance/reports">
                            <Button variant="soft" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icons.TrendingUp size={16} /> View Reports
                            </Button>
                        </Link>
                    </div>
                </CardBody>
            </Card>

            {/* Role Permissions */}
            <div className="bd-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 8, alignItems: 'center', marginBottom: 12 }}>
                            <Icons.ShieldAdmin size={20} />
                            <div className="bd-h3">ADMIN</div>
                        </div>
                        <ul className="bd-small" style={{ opacity: 0.8, paddingLeft: 20, lineHeight: 1.8 }}>
                            <li>Sets fee rules</li>
                            <li>Configures escrow policy</li>
                            <li style={{ color: 'hsl(var(--bd-danger))' }}>Cannot release payouts</li>
                        </ul>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 8, alignItems: 'center', marginBottom: 12 }}>
                            <Icons.Settings size={20} />
                            <div className="bd-h3">OPS</div>
                        </div>
                        <ul className="bd-small" style={{ opacity: 0.8, paddingLeft: 20, lineHeight: 1.8 }}>
                            <li>Views orders & delivery</li>
                            <li>Recommends payout/hold</li>
                            <li style={{ color: 'hsl(var(--bd-danger))' }}>Cannot release funds</li>
                        </ul>
                    </CardBody>
                </Card>

                <Card style={{ borderColor: 'hsl(var(--bd-success))' }}>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 8, alignItems: 'center', marginBottom: 12 }}>
                            <Icons.Bank size={20} style={{ color: 'hsl(var(--bd-success))' }} />
                            <div className="bd-h3" style={{ color: 'hsl(var(--bd-success))' }}>FINANCE_ADMIN</div>
                        </div>
                        <ul className="bd-small" style={{ paddingLeft: 20, lineHeight: 1.8 }}>
                            <li style={{ color: 'hsl(var(--bd-success))' }}>Approves payouts</li>
                            <li style={{ color: 'hsl(var(--bd-success))' }}>Releases escrow</li>
                            <li style={{ color: 'hsl(var(--bd-success))' }}>Issues refunds</li>
                            <li style={{ color: 'hsl(var(--bd-success))' }}>Manages wallets</li>
                        </ul>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
