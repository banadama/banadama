import Link from 'next/link';

// Mock data for supplier dashboard
const MOCK_STATS = {
    products: 12,
    pendingRfqs: 3,
    activeOrders: 5,
    walletBalance: 450000,
    lockedBalance: 120000,
};

const MOCK_RECENT_RFQS = [
    { id: '1', product: 'Custom T-Shirts', quantity: 500, buyer: 'Buyer #123', status: 'PENDING', date: '2024-12-13' },
    { id: '2', product: 'Packaging Boxes', quantity: 1000, buyer: 'Buyer #456', status: 'QUOTED', date: '2024-12-12' },
];

const MOCK_RECENT_ORDERS = [
    { id: 'PO-001', product: 'Cotton Fabric', quantity: 200, total: 90000, status: 'PROCESSING', date: '2024-12-10' },
    { id: 'PO-002', product: 'Phone Cases', quantity: 500, total: 25000, status: 'SHIPPED', date: '2024-12-08' },
];

export default function SupplierDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div style={{ backgroundColor: '#3d5c4f', padding: '16px', borderRadius: 8 }}>
                <h1 className="text-2xl font-semibold" style={{ color: '#ffffff' }}>Supplier Dashboard</h1>
                <p className="text-sm mt-1" style={{ color: '#e6efe9' }}>
                    Manage your products, RFQs, and orders
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Products Listed</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-1">{MOCK_STATS.products}</p>
                    <Link href="/supplier/products" className="text-xs text-emerald-400 hover:text-emerald-300 mt-2 inline-block">
                        Manage Products →
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Pending RFQs</p>
                    <p className="text-2xl font-semibold text-amber-400 mt-1">{MOCK_STATS.pendingRfqs}</p>
                    <Link href="/supplier/rfqs" className="text-xs text-emerald-400 hover:text-emerald-300 mt-2 inline-block">
                        View RFQs →
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Active Orders</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-1">{MOCK_STATS.activeOrders}</p>
                    <Link href="/supplier/orders" className="text-xs text-emerald-400 hover:text-emerald-300 mt-2 inline-block">
                        View Orders →
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Wallet Balance</p>
                    <p className="text-2xl font-semibold text-emerald-400 mt-1">
                        ₦{MOCK_STATS.walletBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Locked: ₦{MOCK_STATS.lockedBalance.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending RFQs */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                        <h2 className="font-medium text-slate-100">Assigned RFQs</h2>
                        <Link href="/supplier/rfqs" className="text-xs text-emerald-400 hover:text-emerald-300">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {MOCK_RECENT_RFQS.map((rfq) => (
                            <div key={rfq.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-slate-100">{rfq.product}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Qty: {rfq.quantity} • {rfq.buyer}
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${rfq.status === 'PENDING'
                                            ? 'bg-amber-500/20 text-amber-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {rfq.status}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2">{rfq.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                        <h2 className="font-medium text-slate-100">Recent Purchase Orders</h2>
                        <Link href="/supplier/orders" className="text-xs text-emerald-400 hover:text-emerald-300">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {MOCK_RECENT_ORDERS.map((order) => (
                            <div key={order.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-slate-100">{order.id}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {order.product} • Qty: {order.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-emerald-400">
                                            ₦{order.total.toLocaleString()}
                                        </p>
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${order.status === 'PROCESSING'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-emerald-500/20 text-emerald-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2">{order.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h2 className="font-medium text-slate-100 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/supplier/products/new"
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                        style={{ backgroundColor: '#3d5c4f', color: '#ffffff' }}
                    >
                        <span>+</span> Add Product
                    </Link>
                    <Link
                        href="/supplier/rfqs"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                        📝 Respond to RFQ
                    </Link>
                    <Link
                        href="/supplier/wallet"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                        💰 Request Payout
                    </Link>
                </div>
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-500 text-center">
                💬 Need help? Chat with Banadama Ops via the Messages tab
            </p>
        </div>
    );
}
