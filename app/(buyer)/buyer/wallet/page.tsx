"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

interface Wallet {
    balance: number;
    lockedBalance: number;
    availableBalance: number;
    currency: string;
    status: string;
}

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    description?: string;
    createdAt: string;
}

export default function BuyerWalletPage() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchWallet();
    }, []);

    const fetchWallet = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiGet<any>("/api/wallet");
            setWallet(data.wallet);
            setTransactions(data.recentTransactions || []);
        } catch (err: any) {
            setError(err.message || "Failed to load wallet");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-slate-400">Loading wallet...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Wallet</h1>
                <p className="text-sm text-slate-400 mt-1">Manage your funds and transactions</p>
            </div>

            {/* Balance Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                    <p className="text-sm text-slate-300">Available Balance</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-2">
                        ₦{(wallet?.availableBalance || 0).toLocaleString()}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <p className="text-sm text-slate-400">Total Balance</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-2">
                        ₦{(wallet?.balance || 0).toLocaleString()}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <p className="text-sm text-slate-400">Locked (In Escrow)</p>
                    <p className="text-2xl font-semibold text-amber-400 mt-2">
                        ₦{(wallet?.lockedBalance || 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-wrap gap-3">
                    <button
                        disabled
                        className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-400 cursor-not-allowed"
                    >
                        + Fund Wallet (Coming Soon)
                    </button>
                    <Link
                        href="/buyer/wallet/transactions"
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                        View All Transactions
                    </Link>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <h2 className="font-medium text-slate-100">Recent Transactions</h2>
                    <Link href="/buyer/wallet/transactions" className="text-xs text-emerald-400 hover:text-emerald-300">
                        View All
                    </Link>
                </div>
                <div className="divide-y divide-slate-800">
                    {transactions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">No transactions yet</div>
                    ) : (
                        transactions.slice(0, 5).map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-100">{tx.description || tx.type}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-medium ${tx.amount >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        {tx.amount >= 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                                    </p>
                                    <span className={`text-xs rounded-full px-2 py-0.5 ${tx.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-400" :
                                            tx.status === "PENDING" ? "bg-amber-500/20 text-amber-400" :
                                                "bg-slate-500/20 text-slate-400"
                                        }`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
