"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Request {
    id: string;
    title?: string;
    status: string;
    quantity: number;
    category?: string;
    createdAt: string;
    buyer?: { email?: string; user?: { email?: string } };
    supplier?: { businessName: string };
}

export default function OpsBuyerRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiGet<any>("/api/requests");
            setRequests(data.requests || []);
        } catch (err: any) {
            setError(err.message || "Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = statusFilter
        ? requests.filter((r) => r.status === statusFilter)
        : requests;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-50">Buyer RFQ Queue</h1>
                    <p className="text-sm text-slate-400 mt-1">Review and process buyer requests</p>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex gap-2">
                {["", "PENDING", "ASSIGNED", "QUOTED", "CONFIRMED"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${statusFilter === status
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        {status || "All"}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="text-center py-12">
                    <p className="text-slate-400">Loading requests...</p>
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12 rounded-xl border border-slate-800 bg-slate-900/40">
                            <p className="text-slate-400">No requests found</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">ID / Title</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Buyer</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Category</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Qty</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Supplier</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Status</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Date</th>
                                        <th className="text-right text-xs text-slate-400 font-medium px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-medium text-slate-100">{req.title || req.id.slice(0, 8)}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-400">
                                                {req.buyer?.user?.email || req.buyer?.email || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-400">{req.category || "—"}</td>
                                            <td className="px-4 py-3 text-sm text-slate-300">{req.quantity}</td>
                                            <td className="px-4 py-3 text-sm text-slate-400">
                                                {req.supplier?.businessName || <span className="text-amber-400">Not assigned</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-400">{formatDate(req.createdAt)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/ops/buyer-requests/${req.id}`}
                                                    className="text-sm text-emerald-400 hover:text-emerald-300"
                                                >
                                                    Review →
                                                </Link>
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
