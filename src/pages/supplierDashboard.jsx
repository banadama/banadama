import React from 'react';

export default function SupplierDashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Supplier Dashboard</h1>
                    <p className="text-slate-400">Manage your products and purchase orders</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-lg">
                        <div className="text-4xl mb-2">📋</div>
                        <div className="text-3xl font-bold">8</div>
                        <div className="text-sm opacity-90">Active POs</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-3xl font-bold text-sky-400">45</div>
                        <div className="text-sm text-slate-400">Products Listed</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">💰</div>
                        <div className="text-3xl font-bold text-green-400">₦3.2M</div>
                        <div className="text-sm text-slate-400">Monthly Revenue</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">⭐</div>
                        <div className="text-3xl font-bold text-yellow-400">4.8</div>
                        <div className="text-sm text-slate-400">Rating</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Purchase Orders */}
                    <div className="col-span-2 bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Purchase Orders from Banadama</h2>
                            <span className="text-sm text-slate-400">Last 30 days</span>
                        </div>
                        <div className="space-y-3">
                            {[
                                { id: 'PO-2401', product: 'Cotton T-Shirts', qty: 500, amount: '₦350,000', status: 'Processing' },
                                { id: 'PO-2402', product: 'Denim Jeans', qty: 300, amount: '₦520,000', status: 'Shipped' },
                                { id: 'PO-2403', product: 'Polo Shirts', qty: 400, amount: '₦280,000', status: 'New' },
                            ].map((po) => (
                                <div key={po.id} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{po.product}</div>
                                            <div className="text-sm text-slate-400">
                                                {po.id} • Qty: {po.qty}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-green-400">{po.amount}</div>
                                            <div className={`text-xs px-2 py-1 rounded-full inline-block ${po.status === 'Shipped' ? 'bg-green-500/20 text-green-400' :
                                                    po.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {po.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Catalog */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <h2 className="text-xl font-semibold mb-4">Product Catalog</h2>
                        <div className="space-y-3 mb-4">
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-slate-400">Total Products</div>
                                <div className="text-2xl font-bold">45</div>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-slate-400">In Stock</div>
                                <div className="text-2xl font-bold text-green-400">38</div>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-slate-400">Low Stock</div>
                                <div className="text-2xl font-bold text-yellow-400">7</div>
                            </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg text-sm font-medium transition-colors">
                            + Add New Product
                        </button>
                    </div>
                </div>

                {/* Credit Line Info */}
                <div className="mt-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Credit Line (Kayan Bashi)</h3>
                            <p className="text-sm text-slate-400">Available credit from Banadama</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-purple-400">₦500,000</div>
                            <div className="text-sm text-slate-400">Available</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
