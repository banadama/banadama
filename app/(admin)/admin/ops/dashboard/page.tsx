// app/(ops)/ops/dashboard/page.tsx
import Link from "next/link";

// Mock data for ops dashboard
const MOCK_STATS = {
    pendingRfqs: 8,
    pendingVerifications: 3,
    activeOrders: 15,
    disputesPending: 2,
    todaysPayouts: 450000,
    unreadMessages: 12,
};

const MOCK_PENDING_RFQS = [
    { id: "RFQ-001", buyer: "John Doe", product: "Custom T-Shirts", quantity: 500, createdAt: "2h ago" },
    { id: "RFQ-002", buyer: "Adamu Store", product: "Packaging Boxes", quantity: 1000, createdAt: "4h ago" },
    { id: "RFQ-003", buyer: "BDTrade Ltd", product: "Cotton Fabric", quantity: 200, createdAt: "6h ago" },
];

const MOCK_PENDING_VERIFICATIONS = [
    { id: "V-001", name: "Lagos Textiles Factory", type: "SUPPLIER", submittedAt: "1d ago" },
    { id: "V-002", name: "Amina Photography", type: "CREATOR", submittedAt: "2d ago" },
    { id: "V-003", name: "BD Packaging Co", type: "SUPPLIER", submittedAt: "3d ago" },
];

const MOCK_ACTIVE_ORDERS = [
    { id: "ORD-001", buyer: "John Doe", supplier: "Lagos Textiles", status: "PROCESSING", total: 75000 },
    { id: "ORD-002", buyer: "Adamu Store", supplier: "BD Packaging", status: "SHIPPED", total: 250000 },
];

export default function OpsDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">
                    🎛️ Operations Control Center
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Monitor RFQs, orders, suppliers, and platform health
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <Link
                    href="/ops/rfqs"
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors"
                >
                    <p className="text-xs text-slate-400">Pending RFQs</p>
                    <p className="text-2xl font-semibold text-amber-400 mt-1">
                        {MOCK_STATS.pendingRfqs}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Needs assignment</p>
                </Link>

                <Link
                    href="/ops/verifications"
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors"
                >
                    <p className="text-xs text-slate-400">Verifications</p>
                    <p className="text-2xl font-semibold text-orange-400 mt-1">
                        {MOCK_STATS.pendingVerifications}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Pending review</p>
                </Link>

                <Link
                    href="/ops/orders"
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors"
                >
                    <p className="text-xs text-slate-400">Active Orders</p>
                    <p className="text-2xl font-semibold text-blue-400 mt-1">
                        {MOCK_STATS.activeOrders}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">In progress</p>
                </Link>

                <Link
                    href="/ops/disputes"
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors"
                >
                    <p className="text-xs text-slate-400">Disputes</p>
                    <p className="text-2xl font-semibold text-red-400 mt-1">
                        {MOCK_STATS.disputesPending}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Needs action</p>
                </Link>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Today&apos;s Payouts</p>
                    <p className="text-2xl font-semibold text-emerald-400 mt-1">
                        ₦{MOCK_STATS.todaysPayouts.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Ready to release</p>
                </div>

                <Link
                    href="/ops/messages"
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors"
                >
                    <p className="text-xs text-slate-400">Messages</p>
                    <p className="text-2xl font-semibold text-purple-400 mt-1">
                        {MOCK_STATS.unreadMessages}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Unread</p>
                </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending RFQs */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                        <h2 className="font-medium text-slate-100">📝 Pending RFQs</h2>
                        <Link href="/ops/rfqs" className="text-xs text-emerald-400 hover:text-emerald-300">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {MOCK_PENDING_RFQS.map((rfq) => (
                            <div key={rfq.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-slate-100">{rfq.product}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {rfq.buyer} • Qty: {rfq.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">{rfq.createdAt}</p>
                                        <span className="text-xs text-slate-500">{rfq.id}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-emerald-400 transition-colors">
                                        Assign Supplier
                                    </button>
                                    <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-600 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Verifications */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                        <h2 className="font-medium text-slate-100">✓ Pending Verifications</h2>
                        <Link href="/ops/verifications" className="text-xs text-emerald-400 hover:text-emerald-300">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {MOCK_PENDING_VERIFICATIONS.map((v) => (
                            <div key={v.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-slate-100">{v.name}</p>
                                        <p className="text-xs text-slate-400 mt-1">{v.type}</p>
                                    </div>
                                    <p className="text-xs text-slate-500">{v.submittedAt}</p>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-emerald-400 transition-colors">
                                        Approve
                                    </button>
                                    <button className="rounded-lg border border-red-700 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                                        Reject
                                    </button>
                                    <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-600 transition-colors">
                                        Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Orders Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <h2 className="font-medium text-slate-100">🛒 Active Orders</h2>
                    <Link href="/ops/orders" className="text-xs text-emerald-400 hover:text-emerald-300">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Order ID</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Buyer</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Supplier</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium">Total</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {MOCK_ACTIVE_ORDERS.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 text-slate-200">{order.id}</td>
                                    <td className="px-4 py-3 text-slate-300">{order.buyer}</td>
                                    <td className="px-4 py-3 text-slate-300">{order.supplier}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${order.status === "PROCESSING"
                                                ? "bg-blue-500/20 text-blue-400"
                                                : "bg-emerald-500/20 text-emerald-400"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                                        ₦{order.total.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-xs text-slate-400 hover:text-slate-200">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h2 className="font-medium text-slate-100 mb-4">⚡ Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/ops/rfqs"
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                    >
                        📝 Process RFQs
                    </Link>
                    <Link
                        href="/ops/verifications"
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                        ✓ Review Verifications
                    </Link>
                    <Link
                        href="/ops/suppliers"
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                        🏭 Manage Suppliers
                    </Link>
                    <Link
                        href="/ops/creators"
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                        🎨 Coordinate Creators
                    </Link>
                    <Link
                        href="/ops/payouts"
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                        💰 Process Payouts
                    </Link>
                </div>
            </div>
        </div>
    );
}
