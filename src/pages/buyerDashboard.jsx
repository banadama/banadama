import React from 'react';

export default function BuyerDashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Buyer Dashboard</h1>
                    <p className="text-slate-400">Manage your bulk orders and requests</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-6 rounded-lg">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-3xl font-bold">12</div>
                        <div className="text-sm opacity-90">Active Orders</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">⏳</div>
                        <div className="text-3xl font-bold text-yellow-400">5</div>
                        <div className="text-sm text-slate-400">Pending Quotes</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">✅</div>
                        <div className="text-3xl font-bold text-green-400">48</div>
                        <div className="text-sm text-slate-400">Completed</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">💰</div>
                        <div className="text-3xl font-bold text-sky-400">₦2.4M</div>
                        <div className="text-sm text-slate-400">Total Spent</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Recent Requests */}
                    <div className="col-span-2 bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Recent Requests</h2>
                            <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg text-sm font-medium transition-colors">
                                + New Request
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { id: 'REQ-001', product: 'Cotton T-Shirts', qty: 500, status: 'Quoted', amount: '₦450,000' },
                                { id: 'REQ-002', product: 'Leather Shoes', qty: 200, status: 'Pending', amount: '₦1,200,000' },
                                { id: 'REQ-003', product: 'USB Cables', qty: 1000, status: 'Approved', amount: '₦180,000' },
                            ].map((request) => (
                                <div key={request.id} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{request.product}</div>
                                            <div className="text-sm text-slate-400">
                                                {request.id} • Qty: {request.qty}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-sky-400">{request.amount}</div>
                                            <div className={`text-xs px-2 py-1 rounded-full inline-block ${request.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                                    request.status === 'Quoted' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {request.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Service Plan */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <h2 className="text-xl font-semibold mb-4">Your Plan</h2>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-lg mb-4">
                            <div className="text-2xl font-bold mb-2">Premium</div>
                            <div className="text-sm opacity-90">₦1,000/month</div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <span className="text-green-400">✓</span>
                                <span>Priority Support</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-green-400">✓</span>
                                <span>24h Response Time</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-green-400">✓</span>
                                <span>High Sourcing Priority</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
                            Upgrade Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
