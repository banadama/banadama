// app/(admin)/admin/finance/escrow/page.tsx - Escrow Management (SVG icons)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from '@/components/icons';

interface EscrowRecord {
    id: string;
    orderId: string;
    buyerAccountId: string;
    supplierAccountId: string;
    totalAmount: number;
    releasedAmount: number;
    refundedAmount: number;
    platformFeeAmount: number;
    status: string;
    deliveryConfirmedAt?: string;
    createdAt: string;
    order?: {
        productName: string;
        buyerEmail?: string;
        supplierName?: string;
    };
}

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
    PENDING: { label: 'Pending Payment', variant: 'default' },
    LOCKED: { label: 'Locked', variant: 'warning' },
    PARTIAL_RELEASE: { label: 'Partial Release', variant: 'warning' },
    RELEASED: { label: 'Released', variant: 'success' },
    REFUNDED: { label: 'Refunded', variant: 'danger' },
    DISPUTED: { label: 'Disputed', variant: 'danger' },
};

// Mock data
const MOCK_ESCROWS: EscrowRecord[] = [
    {
        id: "esc-001",
        orderId: "ord-12345678",
        buyerAccountId: "acc-buyer-001",
        supplierAccountId: "acc-supplier-001",
        totalAmount: 25000000,
        releasedAmount: 0,
        refundedAmount: 0,
        platformFeeAmount: 500000,
        status: "LOCKED",
        deliveryConfirmedAt: "2025-01-15",
        createdAt: "2025-01-10",
        order: { productName: "Packaging Nylon Bags - 1000pcs", supplierName: "Lagos Packaging Co." }
    },
    {
        id: "esc-002",
        orderId: "ord-23456789",
        buyerAccountId: "acc-buyer-002",
        supplierAccountId: "acc-supplier-002",
        totalAmount: 45000000,
        releasedAmount: 0,
        refundedAmount: 0,
        platformFeeAmount: 900000,
        status: "LOCKED",
        createdAt: "2025-01-12",
        order: { productName: "Cotton T-Shirts - 500pcs", supplierName: "Dhaka Textile Factory" }
    },
    {
        id: "esc-003",
        orderId: "ord-34567890",
        buyerAccountId: "acc-buyer-003",
        supplierAccountId: "acc-supplier-003",
        totalAmount: 15000000,
        releasedAmount: 15000000,
        refundedAmount: 0,
        platformFeeAmount: 300000,
        status: "RELEASED",
        deliveryConfirmedAt: "2025-01-08",
        createdAt: "2025-01-01",
        order: { productName: "Adhesive Tape - 200 rolls", supplierName: "Ikeja Supplies" }
    },
];

export default function EscrowPage() {
    const [escrows, setEscrows] = useState<EscrowRecord[]>(MOCK_ESCROWS);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('LOCKED');

    const fetchEscrows = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/admin/finance/escrow?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setEscrows(data.escrows || MOCK_ESCROWS);
            }
        } catch (err) {
            console.error('Error fetching escrows:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Filter mock data based on status
        if (statusFilter) {
            setEscrows(MOCK_ESCROWS.filter(e => e.status === statusFilter));
        } else {
            setEscrows(MOCK_ESCROWS);
        }
    }, [statusFilter]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const handleAction = async (escrowId: string, action: string, amount?: number) => {
        const reason = prompt('Reason for this action (required):');
        if (!reason) return;

        try {
            const res = await fetch(`/api/admin/finance/escrow/${escrowId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action, amount, reason }),
            });

            if (res.ok) {
                alert('Action completed successfully');
                fetchEscrows();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to perform action');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="bd-h1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Icons.Lock size={28} /> Escrow Management
                    </h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>Lock, release, and manage escrowed funds</p>
                </div>
                <Link href="/admin/finance/dashboard">
                    <Button variant="soft">Back to Finance</Button>
                </Link>
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

            {/* Escrow Table */}
            <Card>
                <CardHeader>
                    <div className="bd-row" style={{ justifyContent: 'space-between' }}>
                        <div className="bd-h3">Escrow Records</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>{escrows.length} records</div>
                    </div>
                </CardHeader>
                <CardBody>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 32, opacity: 0.7 }}>Loading escrows...</div>
                    ) : escrows.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 32, opacity: 0.5 }}>No escrows found</div>
                    ) : (
                        <DataTable
                            columns={[
                                { key: 'order', label: 'Order' },
                                { key: 'amount', label: 'Amount' },
                                { key: 'released', label: 'Released' },
                                { key: 'status', label: 'Status' },
                                { key: 'delivery', label: 'Delivery' },
                                { key: 'actions', label: 'Actions' },
                            ]}
                            rows={escrows.map((escrow) => ({
                                order: (
                                    <div>
                                        <div style={{ fontFamily: 'monospace', fontSize: 12 }}>{escrow.orderId.substring(0, 12)}...</div>
                                        <div className="bd-small" style={{ opacity: 0.7 }}>{escrow.order?.productName}</div>
                                    </div>
                                ),
                                amount: <span style={{ fontWeight: 700, color: 'hsl(var(--bd-success))' }}>{formatMoney(escrow.totalAmount)}</span>,
                                released: formatMoney(escrow.releasedAmount),
                                status: (
                                    <Badge variant={STATUS_CONFIG[escrow.status]?.variant || 'default'}>
                                        {STATUS_CONFIG[escrow.status]?.label || escrow.status}
                                    </Badge>
                                ),
                                delivery: escrow.deliveryConfirmedAt ? (
                                    <span style={{ color: 'hsl(var(--bd-success))', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Icons.Check size={14} /> Confirmed
                                    </span>
                                ) : (
                                    <span style={{ opacity: 0.7 }}>Pending</span>
                                ),
                                actions: (
                                    <div className="bd-row" style={{ gap: 8 }}>
                                        {escrow.status === 'LOCKED' && escrow.deliveryConfirmedAt && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleAction(escrow.id, 'release')}
                                            >
                                                Release
                                            </Button>
                                        )}
                                        {escrow.status === 'LOCKED' && (
                                            <>
                                                <Button
                                                    variant="soft"
                                                    size="sm"
                                                    onClick={() => {
                                                        const amount = prompt('Partial release amount (kobo):');
                                                        if (amount) handleAction(escrow.id, 'partial_release', parseInt(amount));
                                                    }}
                                                >
                                                    Partial
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleAction(escrow.id, 'refund')}
                                                >
                                                    Refund
                                                </Button>
                                            </>
                                        )}
                                        <Link href={`/admin/finance/escrow/${escrow.id}`}>
                                            <Button variant="ghost" size="sm">Details</Button>
                                        </Link>
                                    </div>
                                ),
                            }))}
                        />
                    )}
                </CardBody>
            </Card>

            {/* Info Note */}
            <Card style={{ background: 'hsl(var(--bd-muted))' }}>
                <CardBody className="bd-row" style={{ gap: 12 }}>
                    <Icons.Shield size={20} />
                    <div className="bd-small">
                        Escrow funds are released only after delivery confirmation.
                        All release actions require FINANCE_ADMIN approval and are logged.
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
