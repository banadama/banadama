import Link from 'next/link';

export const metadata = {
    title: 'Supplier Hub - Banadama',
    description: 'Manage your products, RFQs, orders, and wallet',
};

export default function SupplierHubPage() {
    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div style={{ backgroundColor: '#3d5c4f', padding: '24px', borderRadius: 12 }} className="text-center">
                <h1 className="text-3xl font-bold" style={{ color: '#ffffff' }}>
                    Welcome to Supplier Studio
                </h1>
                <p className="text-lg mt-3" style={{ color: '#e6efe9' }}>
                    Manage your products, respond to RFQs, and grow your business
                </p>
            </div>

            {/* Quick Links Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Products */}
                <Link href="/supplier/products">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 hover:bg-slate-800/80 transition-colors cursor-pointer">
                        <div className="text-3xl mb-3">📦</div>
                        <h2 className="text-xl font-semibold text-slate-100">Products</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Add, edit, and manage your product listings
                        </p>
                        <span className="text-xs text-emerald-400 hover:text-emerald-300 mt-4 inline-block font-medium">
                            Go to Products →
                        </span>
                    </div>
                </Link>

                {/* RFQs */}
                <Link href="/supplier/rfqs">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 hover:bg-slate-800/80 transition-colors cursor-pointer">
                        <div className="text-3xl mb-3">📋</div>
                        <h2 className="text-xl font-semibold text-slate-100">RFQ Responses</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            View and respond to buyer requests for quotes
                        </p>
                        <span className="text-xs text-emerald-400 hover:text-emerald-300 mt-4 inline-block font-medium">
                            View RFQs →
                        </span>
                    </div>
                </Link>

                {/* Orders */}
                <Link href="/supplier/orders">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 hover:bg-slate-800/80 transition-colors cursor-pointer">
                        <div className="text-3xl mb-3">🛒</div>
                        <h2 className="text-xl font-semibold text-slate-100">Orders</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Track purchase orders and fulfillment status
                        </p>
                        <span className="text-xs text-emerald-400 hover:text-emerald-300 mt-4 inline-block font-medium">
                            View Orders →
                        </span>
                    </div>
                </Link>

                {/* Wallet */}
                <Link href="/supplier/wallet">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 hover:bg-slate-800/80 transition-colors cursor-pointer">
                        <div className="text-3xl mb-3">💰</div>
                        <h2 className="text-xl font-semibold text-slate-100">Wallet</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Manage your earnings, balance, and payouts
                        </p>
                        <span className="text-xs text-emerald-400 hover:text-emerald-300 mt-4 inline-block font-medium">
                            Go to Wallet →
                        </span>
                    </div>
                </Link>

                {/* Factory */}
                <Link href="/supplier/factory">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 hover:bg-slate-800/80 transition-colors cursor-pointer">
                        <div className="text-3xl mb-3">🏭</div>
                        <h2 className="text-xl font-semibold text-slate-100">Factory</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Manage your factory profile and capabilities
                        </p>
                        <span className="text-xs text-emerald-400 hover:text-emerald-300 mt-4 inline-block font-medium">
                            Go to Factory →
                        </span>
                    </div>
                </Link>

                {/* Dashboard */}
                <Link href="/supplier/studio">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 hover:bg-slate-800/80 transition-colors cursor-pointer">
                        <div className="text-3xl mb-3">📊</div>
                        <h2 className="text-xl font-semibold text-slate-100">Dashboard</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            View your sales stats, activity, and insights
                        </p>
                        <span className="text-xs text-emerald-400 hover:text-emerald-300 mt-4 inline-block font-medium">
                            View Dashboard →
                        </span>
                    </div>
                </Link>
            </div>

            {/* Info Section */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Getting Started</h2>
                <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                        <span className="text-emerald-400 font-bold mt-0.5">1.</span>
                        <span><strong>Complete Your Profile</strong> — Set up your factory profile with capabilities and certifications</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-emerald-400 font-bold mt-0.5">2.</span>
                        <span><strong>Add Products</strong> — List your products with accurate descriptions, pricing, and images</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-emerald-400 font-bold mt-0.5">3.</span>
                        <span><strong>Respond to RFQs</strong> — Engage with buyers by responding to requests for quotes</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-emerald-400 font-bold mt-0.5">4.</span>
                        <span><strong>Fulfill Orders</strong> — Process orders and track shipments from your orders page</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-emerald-400 font-bold mt-0.5">5.</span>
                        <span><strong>Manage Payouts</strong> — Request and track payouts in your wallet</span>
                    </li>
                </ul>
            </div>

            {/* CTA Section */}
            <div className="text-center py-4">
                <Link
                    href="/supplier/studio"
                    className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold transition-all"
                    style={{ backgroundColor: '#3d5c4f', color: '#ffffff' }}
                >
                    Go to Dashboard →
                </Link>
            </div>
        </div>
    );
}
