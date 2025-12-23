// app/(admin)/admin/finance/ledger/page.tsx - Finance Ledger (SVG icons)
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from '@/components/icons';

interface LedgerEntry {
    id: string;
    date: string;
    type: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
    reference: string;
}

// Mock data
const MOCK_LEDGER: LedgerEntry[] = [
    { id: "led-001", date: "2025-01-15 14:32:00", type: "ESCROW_LOCK", description: "Order #ord-12345 escrow locked", debit: 0, credit: 25000000, balance: 125000000, reference: "ESC-001" },
    { id: "led-002", date: "2025-01-15 12:15:00", type: "ESCROW_RELEASE", description: "Order #ord-11111 escrow released", debit: 15000000, credit: 0, balance: 100000000, reference: "ESC-002" },
    { id: "led-003", date: "2025-01-15 10:00:00", type: "PLATFORM_FEE", description: "Platform fee from Order #ord-11111", debit: 0, credit: 300000, balance: 115000000, reference: "FEE-001" },
    { id: "led-004", date: "2025-01-14 16:45:00", type: "PAYOUT", description: "Supplier payout - Lagos Packaging", debit: 45000000, credit: 0, balance: 114700000, reference: "PAY-001" },
    { id: "led-005", date: "2025-01-14 14:30:00", type: "REFUND", description: "Buyer refund - Order #ord-99999", debit: 8500000, credit: 0, balance: 159700000, reference: "REF-001" },
];

const TYPE_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
    ESCROW_LOCK: { label: 'Escrow Lock', variant: 'success' },
    ESCROW_RELEASE: { label: 'Escrow Release', variant: 'default' },
    PLATFORM_FEE: { label: 'Platform Fee', variant: 'success' },
    PAYOUT: { label: 'Payout', variant: 'warning' },
    REFUND: { label: 'Refund', variant: 'danger' },
    ADJUSTMENT: { label: 'Adjustment', variant: 'default' },
};

export default function LedgerPage() {
    const [entries] = useState<LedgerEntry[]>(MOCK_LEDGER);
    const [typeFilter, setTypeFilter] = useState('');

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const filteredEntries = typeFilter
        ? entries.filter(e => e.type === typeFilter)
        : entries;

    const totalCredits = entries.reduce((sum, e) => sum + e.credit, 0);
    const totalDebits = entries.reduce((sum, e) => sum + e.debit, 0);

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="bd-h1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Icons.Receipt size={28} /> Finance Ledger
                    </h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>Complete transaction history and audit trail</p>
                </div>
                <div className="bd-row" style={{ gap: 12 }}>
                    <Button variant="soft" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icons.Document size={16} /> Export
                    </Button>
                    <Link href="/admin/finance/dashboard">
                        <Button variant="soft">Back to Finance</Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.TrendingUp size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Total Credits</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-success))' }}>
                                    {formatMoney(totalCredits)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Bank size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Total Debits</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-danger))' }}>
                                    {formatMoney(totalDebits)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Wallet size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Current Balance</div>
                                <div style={{ fontSize: 24, fontWeight: 900 }}>
                                    {formatMoney(entries[0]?.balance || 0)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Receipt size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Transactions</div>
                                <div style={{ fontSize: 24, fontWeight: 900 }}>
                                    {entries.length}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Type Filters */}
            <div className="bd-row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Badge
                    variant={!typeFilter ? 'success' : 'default'}
                    style={{ cursor: 'pointer', padding: '8px 16px' }}
                    onClick={() => setTypeFilter('')}
                >
                    All
                </Badge>
                {Object.entries(TYPE_CONFIG).map(([key, val]) => (
                    <Badge
                        key={key}
                        variant={typeFilter === key ? val.variant : 'default'}
                        style={{ cursor: 'pointer', padding: '8px 16px' }}
                        onClick={() => setTypeFilter(key)}
                    >
                        {val.label}
                    </Badge>
                ))}
            </div>

            {/* Ledger Table */}
            <Card>
                <CardHeader>
                    <div className="bd-row" style={{ justifyContent: 'space-between' }}>
                        <div className="bd-h3">Transaction History</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>{filteredEntries.length} entries</div>
                    </div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={[
                            { key: 'date', label: 'Date' },
                            { key: 'type', label: 'Type' },
                            { key: 'description', label: 'Description' },
                            { key: 'debit', label: 'Debit' },
                            { key: 'credit', label: 'Credit' },
                            { key: 'balance', label: 'Balance' },
                            { key: 'ref', label: 'Reference' },
                        ]}
                        rows={filteredEntries.map((entry) => ({
                            date: <span className="bd-small" style={{ fontFamily: 'monospace' }}>{entry.date}</span>,
                            type: (
                                <Badge variant={TYPE_CONFIG[entry.type]?.variant || 'default'}>
                                    {TYPE_CONFIG[entry.type]?.label || entry.type}
                                </Badge>
                            ),
                            description: <span className="bd-small" style={{ opacity: 0.8 }}>{entry.description}</span>,
                            debit: entry.debit ? (
                                <span style={{ color: 'hsl(var(--bd-danger))' }}>-{formatMoney(entry.debit)}</span>
                            ) : '-',
                            credit: entry.credit ? (
                                <span style={{ color: 'hsl(var(--bd-success))' }}>+{formatMoney(entry.credit)}</span>
                            ) : '-',
                            balance: <span style={{ fontWeight: 700 }}>{formatMoney(entry.balance)}</span>,
                            ref: <span className="bd-small" style={{ fontFamily: 'monospace' }}>{entry.reference}</span>,
                        }))}
                    />
                </CardBody>
            </Card>

            {/* Info Note */}
            <Card style={{ background: 'hsl(var(--bd-muted))' }}>
                <CardBody className="bd-row" style={{ gap: 12 }}>
                    <Icons.Shield size={20} />
                    <div className="bd-small">
                        Ledger entries are immutable and cannot be deleted.
                        All financial transactions are permanently recorded for audit compliance.
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
