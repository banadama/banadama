// app/(retail)/retail/wallet/page.tsx - Retail Wallet
"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from "@/components/icons";

interface Transaction {
    id: string;
    type: string;
    description: string;
    amount: number;
    date: string;
    status: string;
}

export default function RetailWalletPage() {
    const [balance] = useState(45000000);
    const [pending] = useState(12000000);

    const [transactions] = useState<Transaction[]>([
        { id: "1", type: "CREDIT", description: "Payment from Order #RET-001", amount: 8500000, date: "2025-01-15", status: "COMPLETED" },
        { id: "2", type: "CREDIT", description: "Payment from Order #RET-002", amount: 4500000, date: "2025-01-14", status: "COMPLETED" },
        { id: "3", type: "DEBIT", description: "Withdrawal to GTBank ***4567", amount: 25000000, date: "2025-01-12", status: "COMPLETED" },
        { id: "4", type: "CREDIT", description: "Payment from Order #RET-003", amount: 2000000, date: "2025-01-10", status: "COMPLETED" },
    ]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className="bd-h1">Wallet</h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>Manage your earnings and payouts</p>
                </div>
                <Button variant="primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icons.Bank size={16} /> Request Payout
                </Button>
            </div>

            {/* Balance Cards */}
            <div className="bd-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Wallet size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Available Balance</div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-success))" }}>
                                    {formatMoney(balance)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Lock size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Pending (Escrow)</div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-warning))" }}>
                                    {formatMoney(pending)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.TrendingUp size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>This Month</div>
                                <div style={{ fontSize: 28, fontWeight: 900 }}>
                                    {formatMoney(15000000)}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Transactions */}
            <Card>
                <CardHeader>
                    <div className="bd-row" style={{ justifyContent: "space-between" }}>
                        <div className="bd-h3">Transaction History</div>
                        <Button variant="ghost" size="sm">Export</Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={[
                            { key: "date", label: "Date" },
                            { key: "type", label: "Type" },
                            { key: "description", label: "Description" },
                            { key: "amount", label: "Amount" },
                            { key: "status", label: "Status" },
                        ]}
                        rows={transactions.map((tx) => ({
                            date: tx.date,
                            type: <Badge variant={tx.type === "CREDIT" ? "success" : "default"}>{tx.type}</Badge>,
                            description: tx.description,
                            amount: (
                                <span style={{
                                    fontWeight: 700,
                                    color: tx.type === "CREDIT" ? "hsl(var(--bd-success))" : "hsl(var(--bd-danger))"
                                }}>
                                    {tx.type === "CREDIT" ? "+" : "-"}{formatMoney(tx.amount)}
                                </span>
                            ),
                            status: <Badge variant="success">{tx.status}</Badge>,
                        }))}
                    />
                </CardBody>
            </Card>

            {/* Payout Info */}
            <Card style={{ background: "hsl(var(--bd-muted))" }}>
                <CardBody className="bd-row" style={{ gap: 12 }}>
                    <Icons.Bank size={20} />
                    <div className="bd-small">
                        Payouts are processed within 24-48 hours. Minimum payout amount is ₦10,000.
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
