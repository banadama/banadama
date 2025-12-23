"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    description?: string;
    createdAt: string;
    reference?: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try transactions endpoint first
            try {
                const data = await apiGet<any>("/api/wallet/transactions");
                setTransactions(data.transactions || []);
            } catch {
                // Fallback to wallet endpoint which includes recent transactions
                const walletData = await apiGet<any>("/api/wallet");
                setTransactions(walletData.recentTransactions || []);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <Link href="/buyer/wallet" className="text-sm text-emerald-400 hover:text-emerald-300">
                    ← Back to Wallet
                </Link>
                <h1 className="text-2xl font-semibold text-slate-50 mt-4">Transaction History</h1>
                <p className="text-sm text-slate-400 mt-1">All your wallet transactions</p>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <p className="text-slate-400">Loading transactions...</p>
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {transactions.length === 0 ? (
                        <div className="text-center py-12 rounded-xl border border-slate-800 bg-slate-900/40">
                            <div className="text-4xl mb-4">💸</div>
                            <p className="text-slate-400">No transactions yet</p>
                            <p className="text-xs text-slate-500 mt-1">Your transaction history will appear here</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Date</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Description</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Type</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Status</th>
                                        <th className="text-right text-xs text-slate-400 font-medium px-4 py-3">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3 text-sm text-slate-400">{formatDate(tx.createdAt)}</td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-slate-100">{tx.description || "—"}</p>
                                                {tx.reference && <p className="text-xs text-slate-500">{tx.reference}</p>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs rounded-full px-2 py-0.5 bg-slate-700 text-slate-300">
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs rounded-full px-2 py-0.5 ${tx.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-400" :
                                                        tx.status === "PENDING" ? "bg-amber-500/20 text-amber-400" :
                                                            tx.status === "FAILED" ? "bg-red-500/20 text-red-400" :
                                                                "bg-slate-500/20 text-slate-400"
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`font-medium ${tx.amount >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                                    {tx.amount >= 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
