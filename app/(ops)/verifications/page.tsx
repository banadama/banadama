// app/(ops)/verifications/page.tsx
"use client";

import {
    useAdminVerifications,
    VerificationWithUser,
} from "@/hooks/useAdminVerifications";

export default function OpsVerificationsPage() {
    const {
        items,
        loading,
        error,
        meta,
        query,
        setQuery,
        approve,
        reject,
    } = useAdminVerifications({ status: "PENDING", page: 1, pageSize: 20 });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-400">Loading verifications…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
                <p className="text-rose-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Verification Center</h1>
                    <p className="text-sm text-slate-400">
                        Review and approve verification requests from buyers, suppliers and creators.
                    </p>
                </div>
            </header>

            {/* Stats Cards */}
            <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Pending reviews</p>
                    <p className="mt-1 text-2xl font-semibold">
                        {items.filter((v) => v.status === "PENDING").length}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Approved</p>
                    <p className="mt-1 text-2xl font-semibold">
                        {items.filter((v) => v.status === "APPROVED").length}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Rejected</p>
                    <p className="mt-1 text-2xl font-semibold">
                        {items.filter((v) => v.status === "REJECTED").length}
                    </p>
                </div>
            </section>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <select
                    value={query.status || ""}
                    onChange={(e) =>
                        setQuery({
                            status: (e.target.value || undefined) as any,
                        })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                    <option value="">All statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>

                <select
                    value={query.role || ""}
                    onChange={(e) =>
                        setQuery({
                            role: (e.target.value || undefined) as any,
                        })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                    <option value="">All roles</option>
                    <option value="BUYER">Buyer</option>
                    <option value="FACTORY">Factory</option>
                    <option value="WHOLESALER">Wholesaler</option>
                    <option value="CREATOR">Creator</option>
                </select>
            </div>

            {/* Verifications Table */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-800 bg-slate-900/80">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-300">User</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-300">Role</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-300">Created</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((v: VerificationWithUser) => (
                            <tr key={v.id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-slate-100">
                                        {v.user.name || v.user.email || v.user.id}
                                    </div>
                                    <div className="text-xs text-slate-400">{v.user.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded-full bg-slate-700/50 px-2 py-1 text-xs font-medium text-slate-300">
                                        {v.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ${v.status === "APPROVED"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40"
                                                : v.status === "PENDING"
                                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/40"
                                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/40"
                                            }`}
                                    >
                                        {v.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-400">
                                    {new Date(v.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        {v.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => approve(v.id, "Looks valid")}
                                                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        reject(v.id, "Documents not clear", "Need better scan")
                                                    }
                                                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-500 transition"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {v.status !== "PENDING" && (
                                            <span className="text-xs text-slate-500">Reviewed</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                    No verifications found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                        Page {meta.page} of {meta.totalPages} • {meta.total} total
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={meta.page <= 1}
                            onClick={() => setQuery({ page: (meta.page || 1) - 1 })}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>
                        <button
                            disabled={meta.page >= meta.totalPages}
                            onClick={() => setQuery({ page: (meta.page || 1) + 1 })}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
