"use client";

import { useState } from "react";
import Link from "next/link";

// Mock wallet data
const MOCK_WALLET = {
    availableBalance: 2500000,
    lockedBalance: 9500000,
    pendingPayout: 1500000,
    currency: "NGN",
};

const MOCK_TRANSACTIONS = [
    { id: "1", type: "ESCROW_RELEASE", amount: 2500000, reference: "PO-004", description: "Order delivered - payment released", date: "2024-12-05" },
    { id: "2", type: "WITHDRAWAL", amount: -1000000, reference: "WD-001", description: "Bank withdrawal", date: "2024-12-03", bankName: "GTBank" },
    { id: "3", type: "ESCROW_RELEASE", amount: 1500000, reference: "PO-003", description: "Order delivered - payment released", date: "2024-11-28" },
];

export default function SupplierWalletPage() {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-50">Wallet</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Track your earnings and payouts
                    </p>
                </div>
                <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                    Request Withdrawal
                </button>
            </div>

            {/* Balance Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                    <p className="text-xs text-slate-400">Available Balance</p>
                    <p className="text-3xl font-semibold text-emerald-400 mt-2">
                        ₦{MOCK_WALLET.availableBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Ready to withdraw
                    </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span>🔒</span> Locked (Escrow)
                    </p>
                    <p className="text-3xl font-semibold text-amber-400 mt-2">
                        ₦{MOCK_WALLET.lockedBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Pending delivery confirmation
                    </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                    <p className="text-xs text-slate-400">Pending Payout</p>
                    <p className="text-3xl font-semibold text-blue-400 mt-2">
                        ₦{MOCK_WALLET.pendingPayout.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Processing withdrawal
                    </p>
                </div>
            </div>

            {/* How Escrow Works */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                        <p className="text-sm font-medium text-emerald-300">How Escrow Works</p>
                        <p className="text-xs text-emerald-200 mt-1">
                            When a buyer pays for an order, funds are locked in escrow. Once the buyer confirms
                            delivery, the payment is automatically released to your available balance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <h2 className="font-medium text-slate-100">Recent Transactions</h2>
                    <Link
                        href="/supplier/wallet/history"
                        className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                        View All
                    </Link>
                </div>

                <div className="divide-y divide-slate-800">
                    {MOCK_TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${tx.type === "WITHDRAWAL" ? "bg-red-500/20" : "bg-emerald-500/20"
                                        }`}>
                                        {tx.type === "WITHDRAWAL" ? "📤" : "✅"}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-100 text-sm">{tx.description}</p>
                                        <p className="text-xs text-slate-500">{tx.date} • {tx.reference}</p>
                                    </div>
                                </div>
                                <p className={`font-semibold ${tx.amount > 0 ? "text-emerald-400" : "text-slate-300"
                                    }`}>
                                    {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-100">Request Withdrawal</h2>
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                className="text-slate-400 hover:text-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 rounded-lg bg-slate-800/50">
                                <p className="text-xs text-slate-400">Available Balance</p>
                                <p className="text-xl font-semibold text-emerald-400">
                                    ₦{MOCK_WALLET.availableBalance.toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-300">Withdrawal Amount (₦)</label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    max={MOCK_WALLET.availableBalance}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-300">Bank Account</label>
                                <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500">
                                    <option>GTBank - **** 1234</option>
                                    <option>+ Add new bank account</option>
                                </select>
                            </div>

                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                <p className="text-xs text-blue-300">
                                    ⏰ Withdrawals are processed within 24-48 hours
                                </p>
                            </div>

                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
