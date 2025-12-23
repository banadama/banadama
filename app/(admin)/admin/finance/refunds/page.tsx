// app/(admin)/admin/finance/refunds/page.tsx - Refunds Management (SVG icons)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from '@/components/icons';

interface RefundRecord {
    id: string;
    orderId: string;
    buyerName: string;
    amount: number;
    reason: string;
    status: string;
    createdAt: string;
    processedAt?: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
    PENDING_REVIEW: { label: 'Pending Review', variant: 'warning' },
    APPROVED: { label: 'Approved', variant: 'success' },
    PROCESSING: { label: 'Processing', variant: 'default' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    REJECTED: { label: 'Rejected', variant: 'danger' },
};

// Mock data
const MOCK_REFUNDS: RefundRecord[] = [
    { id: "ref-001", orderId: "ord-12345", buyerName: "John Doe", amount: 5000000, reason: "Product damaged during shipping", status: "PENDING_REVIEW", createdAt: "2025-01-15" },
    { id: "ref-002", orderId: "ord-23456", buyerName: "Amina Bello", amount: 12000000, reason: "Order not delivered after 30 days", status: "PENDING_REVIEW", createdAt: "2025-01-14" },
    { id: "ref-003", orderId: "ord-34567", buyerName: "Chen Wei", amount: 3500000, reason: "Wrong product received", status: "APPROVED", createdAt: "2025-01-12", processedAt: "2025-01-13" },
    { id: "ref-004", orderId: "ord-45678", buyerName: "Mohammed Ali", amount: 8000000, reason: "Quality not as described", status: "COMPLETED", createdAt: "2025-01-10", processedAt: "2025-01-11" },
];

export default function RefundsPage() {
    const [refunds, setRefunds] = useState<RefundRecord[]>(MOCK_REFUNDS);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW');

    useEffect(() => {
        if (statusFilter) {
            setRefunds(MOCK_REFUNDS.filter(r => r.status === statusFilter));
        } else {
            setRefunds(MOCK_REFUNDS);
        }
    }, [statusFilter]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const handleAction = async (refundId: string, action: 'approve' | 'reject') => {
        const reason = prompt('Reason for this action (required):');
        if (!reason) return;
        alert(`${action === 'approve' ? 'Approved' : 'Rejected'} refund ${refundId}`);
    };

    const pendingTotal = MOCK_REFUNDS.filter(r => r.status === 'PENDING_REVIEW')
        .reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="bd-h1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Icons.Receipt size={28} /> Refunds Management
                    </h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>Review and process refund requests</p>
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
                            <Icons.Receipt size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Pending Review</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-danger))' }}>
                                    {formatMoney(pendingTotal)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Warning size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Pending Count</div>
                                <div style={{ fontSize: 24, fontWeight: 900 }}>
                                    {MOCK_REFUNDS.filter(r => r.status === 'PENDING_REVIEW').length}
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
                                <div className="bd-small" style={{ opacity: 0.7 }}>Processed Today</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-success))' }}>
                                    ₦450K
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

            {/* Refunds Table */}
            <Card>
                <CardHeader>
                    <div className="bd-row" style={{ justifyContent: 'space-between' }}>
                        <div className="bd-h3">Refund Requests</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>{refunds.length} records</div>
                    </div>
                </CardHeader>
                <CardBody>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 32, opacity: 0.7 }}>Loading refunds...</div>
                    ) : refunds.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 32, opacity: 0.5 }}>No refunds found</div>
                    ) : (
                        <DataTable
                            columns={[
                                { key: 'order', label: 'Order' },
                                { key: 'buyer', label: 'Buyer' },
                                { key: 'amount', label: 'Amount' },
                                { key: 'reason', label: 'Reason' },
                                { key: 'status', label: 'Status' },
                                { key: 'actions', label: 'Actions' },
                            ]}
                            rows={refunds.map((refund) => ({
                                order: <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{refund.orderId}</span>,
                                buyer: <div style={{ fontWeight: 700 }}>{refund.buyerName}</div>,
                                amount: <span style={{ fontWeight: 700, color: 'hsl(var(--bd-danger))' }}>{formatMoney(refund.amount)}</span>,
                                reason: <span className="bd-small" style={{ opacity: 0.8 }}>{refund.reason}</span>,
                                status: (
                                    <Badge variant={STATUS_CONFIG[refund.status]?.variant || 'default'}>
                                        {STATUS_CONFIG[refund.status]?.label || refund.status}
                                    </Badge>
                                ),
                                actions: (
                                    <div className="bd-row" style={{ gap: 8 }}>
                                        {refund.status === 'PENDING_REVIEW' && (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleAction(refund.id, 'approve')}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleAction(refund.id, 'reject')}
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
