// app/(admin)/admin/finance/payouts/page.tsx - Payouts Management (SVG icons)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from '@/components/icons';

interface PayoutRecord {
    id: string;
    accountId: string;
    accountName: string;
    amount: number;
    status: string;
    bankName: string;
    accountNumber: string;
    createdAt: string;
    processedAt?: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
    PENDING_APPROVAL: { label: 'Pending Approval', variant: 'warning' },
    APPROVED: { label: 'Approved', variant: 'success' },
    PROCESSING: { label: 'Processing', variant: 'default' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    FAILED: { label: 'Failed', variant: 'danger' },
    REJECTED: { label: 'Rejected', variant: 'danger' },
};

// Mock data
const MOCK_PAYOUTS: PayoutRecord[] = [
    { id: "pay-001", accountId: "acc-001", accountName: "Lagos Packaging Co.", amount: 25000000, status: "PENDING_APPROVAL", bankName: "GTBank", accountNumber: "0123456789", createdAt: "2025-01-15" },
    { id: "pay-002", accountId: "acc-002", accountName: "Dhaka Textile Factory", amount: 45000000, status: "PENDING_APPROVAL", bankName: "First Bank", accountNumber: "9876543210", createdAt: "2025-01-14" },
    { id: "pay-003", accountId: "acc-003", accountName: "Ikeja Supplies", amount: 12000000, status: "APPROVED", bankName: "Access Bank", accountNumber: "1357924680", createdAt: "2025-01-13", processedAt: "2025-01-14" },
    { id: "pay-004", accountId: "acc-004", accountName: "StudioX Photography", amount: 8500000, status: "COMPLETED", bankName: "Zenith Bank", accountNumber: "2468013579", createdAt: "2025-01-10", processedAt: "2025-01-11" },
];

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState<PayoutRecord[]>(MOCK_PAYOUTS);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('PENDING_APPROVAL');

    useEffect(() => {
        if (statusFilter) {
            setPayouts(MOCK_PAYOUTS.filter(p => p.status === statusFilter));
        } else {
            setPayouts(MOCK_PAYOUTS);
        }
    }, [statusFilter]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const handleAction = async (payoutId: string, action: 'approve' | 'reject') => {
        const reason = prompt('Reason for this action (required):');
        if (!reason) return;
        alert(`${action === 'approve' ? 'Approved' : 'Rejected'} payout ${payoutId}`);
    };

    const pendingTotal = MOCK_PAYOUTS.filter(p => p.status === 'PENDING_APPROVAL')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="bd-h1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Icons.Bank size={28} /> Payouts Management
                    </h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>Approve and process supplier payouts</p>
                </div>
                <Link href="/admin/finance/dashboard">
                    <Button variant="soft">Back to Finance</Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Bank size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Pending Approval</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-warning))' }}>
                                    {formatMoney(pendingTotal)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Check size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Pending Count</div>
                                <div style={{ fontSize: 24, fontWeight: 900 }}>
                                    {MOCK_PAYOUTS.filter(p => p.status === 'PENDING_APPROVAL').length}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.TrendingUp size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Today Released</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-success))' }}>
                                    ₦3.2M
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Status Filters */}
            <div className="bd-row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <Badge
                        key={key}
                        variant={statusFilter === key ? val.variant : 'default'}
                        style={{ cursor: 'pointer', padding: '8px 16px' }}
                        onClick={() => setStatusFilter(key)}
                    >
                        {val.label}
                    </Badge>
                ))}
                <Badge
                    variant={!statusFilter ? 'success' : 'default'}
                    style={{ cursor: 'pointer', padding: '8px 16px' }}
                    onClick={() => setStatusFilter('')}
                >
                    All
                </Badge>
            </div>

            {/* Payouts Table */}
            <Card>
                <CardHeader>
                    <div className="bd-row" style={{ justifyContent: 'space-between' }}>
                        <div className="bd-h3">Payout Requests</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>{payouts.length} records</div>
                    </div>
                </CardHeader>
                <CardBody>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 32, opacity: 0.7 }}>Loading payouts...</div>
                    ) : payouts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 32, opacity: 0.5 }}>No payouts found</div>
                    ) : (
                        <DataTable
                            columns={[
                                { key: 'supplier', label: 'Supplier' },
                                { key: 'amount', label: 'Amount' },
                                { key: 'bank', label: 'Bank Details' },
                                { key: 'status', label: 'Status' },
                                { key: 'date', label: 'Requested' },
                                { key: 'actions', label: 'Actions' },
                            ]}
                            rows={payouts.map((payout) => ({
                                supplier: (
                                    <div style={{ fontWeight: 700 }}>{payout.accountName}</div>
                                ),
                                amount: <span style={{ fontWeight: 700, color: 'hsl(var(--bd-success))' }}>{formatMoney(payout.amount)}</span>,
                                bank: (
                                    <div>
                                        <div>{payout.bankName}</div>
                                        <div className="bd-small" style={{ opacity: 0.7, fontFamily: 'monospace' }}>{payout.accountNumber}</div>
                                    </div>
                                ),
                                status: (
                                    <Badge variant={STATUS_CONFIG[payout.status]?.variant || 'default'}>
                                        {STATUS_CONFIG[payout.status]?.label || payout.status}
                                    </Badge>
                                ),
                                date: <span className="bd-small">{payout.createdAt}</span>,
                                actions: (
                                    <div className="bd-row" style={{ gap: 8 }}>
                                        {payout.status === 'PENDING_APPROVAL' && (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleAction(payout.id, 'approve')}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleAction(payout.id, 'reject')}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </div>
                                ),
                            }))}
                        />
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
