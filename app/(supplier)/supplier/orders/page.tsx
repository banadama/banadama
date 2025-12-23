import Link from "next/link";

// Mock purchase orders
const MOCK_ORDERS = [
    {
        id: "PO-001",
        buyer: "John Doe",
        product: "Custom T-Shirts with Logo",
        quantity: 500,
        unitPrice: 15000,
        total: 7500000,
        status: "PROCESSING",
        paymentStatus: "ESCROW",
        createdAt: "2024-12-13",
        deadline: "2024-12-20",
    },
    {
        id: "PO-002",
        buyer: "Adamu Store",
        product: "Cotton Fabric Roll",
        quantity: 200,
        unitPrice: 45000,
        total: 9000000,
        status: "READY_TO_SHIP",
        paymentStatus: "ESCROW",
        createdAt: "2024-12-10",
        deadline: "2024-12-17",
    },
    {
        id: "PO-003",
        buyer: "BDTrade Ltd",
        product: "Packaging Boxes",
        quantity: 1000,
        unitPrice: 2500,
        total: 2500000,
        status: "SHIPPED",
        paymentStatus: "ESCROW",
        trackingNumber: "NG1234567890",
        shippedAt: "2024-12-08",
    },
    {
        id: "PO-004",
        buyer: "Shop Nigeria",
        product: "Phone Cases",
        quantity: 500,
        unitPrice: 500,
        total: 250000,
        status: "DELIVERED",
        paymentStatus: "RELEASED",
        deliveredAt: "2024-12-05",
        paidOut: true,
    },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
    PROCESSING: { bg: "bg-blue-500/20", text: "text-blue-400" },
    READY_TO_SHIP: { bg: "bg-amber-500/20", text: "text-amber-400" },
    SHIPPED: { bg: "bg-purple-500/20", text: "text-purple-400" },
    DELIVERED: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
};

export default function SupplierOrdersPage() {
    const escrowTotal = MOCK_ORDERS
        .filter((o) => o.paymentStatus === "ESCROW")
        .reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Purchase Orders</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage orders and track payments
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Active Orders</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-1">
                        {MOCK_ORDERS.filter((o) => o.status !== "DELIVERED").length}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Ready to Ship</p>
                    <p className="text-2xl font-semibold text-amber-400 mt-1">
                        {MOCK_ORDERS.filter((o) => o.status === "READY_TO_SHIP").length}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">In Transit</p>
                    <p className="text-2xl font-semibold text-purple-400 mt-1">
                        {MOCK_ORDERS.filter((o) => o.status === "SHIPPED").length}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">🔒 In Escrow</p>
                    <p className="text-2xl font-semibold text-emerald-400 mt-1">
                        ₦{escrowTotal.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {MOCK_ORDERS.map((order) => {
                    const status = STATUS_STYLES[order.status];

                    return (
                        <div
                            key={order.id}
                            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-mono text-slate-300">{order.id}</span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${status.bg} ${status.text}`}>
                                            {order.status.replace("_", " ")}
                                        </span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${order.paymentStatus === "ESCROW"
                                                ? "bg-amber-500/20 text-amber-400"
                                                : "bg-emerald-500/20 text-emerald-400"
                                            }`}>
                                            {order.paymentStatus === "ESCROW" ? "🔒 Escrow" : "✓ Released"}
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-slate-100 mt-2">{order.product}</h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Buyer: {order.buyer} • Qty: {order.quantity.toLocaleString()}
                                    </p>

                                    {/* Timeline */}
                                    <div className="mt-3 text-xs text-slate-500">
                                        {order.status === "PROCESSING" && (
                                            <span>Deadline: {order.deadline}</span>
                                        )}
                                        {order.status === "SHIPPED" && (
                                            <span>Shipped: {order.shippedAt} • Tracking: {order.trackingNumber}</span>
                                        )}
                                        {order.status === "DELIVERED" && (
                                            <span>Delivered: {order.deliveredAt}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="shrink-0 text-right">
                                    <p className="text-xl font-semibold text-emerald-400">
                                        ₦{order.total.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {order.quantity} × ₦{order.unitPrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                                <Link
                                    href={`/supplier/orders/${order.id}`}
                                    className="rounded-lg border border-slate-700 px-4 py-1.5 text-xs text-slate-300 hover:border-slate-600 transition-colors"
                                >
                                    View Details
                                </Link>
                                {order.status === "PROCESSING" && (
                                    <button className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-medium text-slate-950 hover:bg-amber-400 transition-colors">
                                        Mark Ready to Ship
                                    </button>
                                )}
                                {order.status === "READY_TO_SHIP" && (
                                    <button className="rounded-lg bg-purple-500 px-4 py-1.5 text-xs font-medium text-slate-950 hover:bg-purple-400 transition-colors">
                                        Add Tracking & Ship
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Escrow Info */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                        <p className="text-sm font-medium text-emerald-300">Payment Protection</p>
                        <p className="text-xs text-emerald-200 mt-1">
                            Payment is held in escrow until the buyer confirms delivery.
                            Once confirmed, funds are released to your wallet automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
