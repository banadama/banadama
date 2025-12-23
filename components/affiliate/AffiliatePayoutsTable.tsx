"use client";

import { AffiliatePayout, PayoutStatus } from "@/types/affiliate";
import { formatCurrency } from "@/config/affiliate";

interface AffiliatePayoutsTableProps {
    payouts: AffiliatePayout[];
    loading?: boolean;
    onRefresh?: () => void;
}

export function AffiliatePayoutsTable({
    payouts,
    loading,
    onRefresh,
}: AffiliatePayoutsTableProps) {
    if (loading) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="h-6 w-32 animate-pulse rounded bg-slate-700"></div>
                <div className="mt-4 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded bg-slate-800"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (payouts.length === 0) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                <p className="text-sm text-slate-400">No payout requests yet</p>
                <p className="mt-1 text-xs text-slate-500">
                    Request a payout when you reach the minimum threshold
                </p>
            </div>
        );
    }

    const getStatusColor = (status: PayoutStatus) => {
        switch (status) {
            case PayoutStatus.PAID:
                return "bg-emerald-500/10 text-emerald-400";
            case PayoutStatus.APPROVED:
            case PayoutStatus.PROCESSING:
                return "bg-blue-500/10 text-blue-400";
            case PayoutStatus.PENDING:
                return "bg-yellow-500/10 text-yellow-400";
            case PayoutStatus.REJECTED:
                return "bg-red-500/10 text-red-400";
            default:
                return "bg-slate-500/10 text-slate-400";
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
                <h3 className="font-semibold text-slate-100">Payout History</h3>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Refresh
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-slate-800 bg-slate-900/80">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                                Request Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                                Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                                Payment Method
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                                Processed Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                                Reference
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {payouts.map((payout) => (
                            <tr
                                key={payout.id}
                                className="hover:bg-slate-800/50 transition-colors"
                            >
                                <td className="px-4 py-3 text-sm text-slate-300">
                                    {formatDate(payout.requestedAt)}
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-sm font-medium text-slate-100">
                                        {formatCurrency(payout.amount)}
                                    </p>
                                    <p className="text-xs text-slate-500">{payout.currency}</p>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-300">
                                    {payout.paymentMethod || "—"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                                            payout.status
                                        )}`}
                                    >
                                        {payout.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-300">
                                    {payout.paidAt
                                        ? formatDate(payout.paidAt)
                                        : payout.approvedAt
                                            ? formatDate(payout.approvedAt)
                                            : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    {payout.transactionRef ? (
                                        <p className="text-xs font-mono text-slate-400">
                                            {payout.transactionRef}
                                        </p>
                                    ) : (
                                        <span className="text-sm text-slate-500">—</span>
                                    )}
                                    {payout.rejectionReason && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {payout.rejectionReason}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
