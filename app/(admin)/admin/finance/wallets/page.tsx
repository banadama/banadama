// app/(admin)/admin/finance/wallets/page.tsx - Wallet Management (SVG icons)
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from '@/components/icons';

interface WalletRecord {
    id: string;
    accountId: string;
    accountName: string;
    accountType: string;
    balance: number;
    pendingBalance: number;
    totalReceived: number;
    totalWithdrawn: number;
    status: string;
}

// Mock data
const MOCK_WALLETS: WalletRecord[] = [
    { id: "wal-001", accountId: "acc-001", accountName: "Lagos Packaging Co.", accountType: "COMPANY_WHOLESALER", balance: 45000000, pendingBalance: 12000000, totalReceived: 250000000, totalWithdrawn: 193000000, status: "ACTIVE" },
    { id: "wal-002", accountId: "acc-002", accountName: "Dhaka Textile Factory", accountType: "COMPANY_FACTORY", balance: 120000000, pendingBalance: 35000000, totalReceived: 850000000, totalWithdrawn: 695000000, status: "ACTIVE" },
    { id: "wal-003", accountId: "acc-003", accountName: "Ikeja Supplies", accountType: "COMPANY_RETAIL", balance: 8500000, pendingBalance: 3000000, totalReceived: 45000000, totalWithdrawn: 33500000, status: "ACTIVE" },
    { id: "wal-004", accountId: "acc-004", accountName: "StudioX Photography", accountType: "CREATOR_PHOTOGRAPHER", balance: 2500000, pendingBalance: 1500000, totalReceived: 15000000, totalWithdrawn: 11000000, status: "ACTIVE" },
    { id: "wal-005", accountId: "acc-005", accountName: "John Buyer", accountType: "BUYER", balance: 500000, pendingBalance: 0, totalReceived: 5000000, totalWithdrawn: 4500000, status: "ACTIVE" },
];

export default function WalletsPage() {
    const [wallets] = useState<WalletRecord[]>(MOCK_WALLETS);
    const [typeFilter, setTypeFilter] = useState('');

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const filteredWallets = typeFilter
        ? wallets.filter(w => w.accountType.includes(typeFilter))
        : wallets;

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const totalPending = wallets.reduce((sum, w) => sum + w.pendingBalance, 0);

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="bd-h1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Icons.Wallet size={28} /> Wallet Management
                    </h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>View and manage user wallet balances</p>
                </div>
                <Link href="/admin/finance/dashboard">
                    <Button variant="soft">Back to Finance</Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Wallet size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Total Balance</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-success))' }}>
                                    {formatMoney(totalBalance)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Lock size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Pending Balance</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'hsl(var(--bd-warning))' }}>
                                    {formatMoney(totalPending)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Users size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Active Wallets</div>
                                <div style={{ fontSize: 24, fontWeight: 900 }}>
                                    {wallets.length}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: 'center' }}>
                            <Icons.Product size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Suppliers</div>
                                <div style={{ fontSize: 24, fontWeight: 900 }}>
                                    {wallets.filter(w => w.accountType.includes('COMPANY')).length}
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
                <Badge
                    variant={typeFilter === 'BUYER' ? 'success' : 'default'}
                    style={{ cursor: 'pointer', padding: '8px 16px' }}
                    onClick={() => setTypeFilter('BUYER')}
                >
                    Buyers
                </Badge>
                <Badge
                    variant={typeFilter === 'COMPANY' ? 'success' : 'default'}
                    style={{ cursor: 'pointer', padding: '8px 16px' }}
                    onClick={() => setTypeFilter('COMPANY')}
                >
                    Suppliers
                </Badge>
                <Badge
                    variant={typeFilter === 'CREATOR' ? 'success' : 'default'}
                    style={{ cursor: 'pointer', padding: '8px 16px' }}
                    onClick={() => setTypeFilter('CREATOR')}
                >
                    Creators
                </Badge>
            </div>

            {/* Wallets Table */}
            <Card>
                <CardHeader>
                    <div className="bd-row" style={{ justifyContent: 'space-between' }}>
                        <div className="bd-h3">All Wallets</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>{filteredWallets.length} wallets</div>
                    </div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={[
                            { key: 'account', label: 'Account' },
                            { key: 'type', label: 'Type' },
                            { key: 'balance', label: 'Balance' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'total', label: 'Total Received' },
                            { key: 'actions', label: 'Actions' },
                        ]}
                        rows={filteredWallets.map((wallet) => ({
                            account: <div style={{ fontWeight: 700 }}>{wallet.accountName}</div>,
                            type: <Badge>{wallet.accountType.replace('COMPANY_', '').replace('CREATOR_', '')}</Badge>,
                            balance: <span style={{ fontWeight: 700, color: 'hsl(var(--bd-success))' }}>{formatMoney(wallet.balance)}</span>,
                            pending: <span style={{ color: 'hsl(var(--bd-warning))' }}>{formatMoney(wallet.pendingBalance)}</span>,
                            total: <span className="bd-small">{formatMoney(wallet.totalReceived)}</span>,
                            actions: (
                                <div className="bd-row" style={{ gap: 8 }}>
                                    <Button variant="soft" size="sm">View History</Button>
                                    <Button variant="ghost" size="sm">Details</Button>
                                </div>
                            ),
                        }))}
                    />
                </CardBody>
            </Card>
        </div>
    );
}
