import React from 'react';

export default function ManufacturerDashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Manufacturer Dashboard</h1>
                    <p className="text-slate-400">Manage production and bulk orders</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-lg">
                        <div className="text-4xl mb-2">🏭</div>
                        <div className="text-3xl font-bold">15</div>
                        <div className="text-sm opacity-90">Production Orders</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">⚙️</div>
                        <div className="text-3xl font-bold text-blue-400">85%</div>
                        <div className="text-sm text-slate-400">Capacity Utilized</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-3xl font-bold text-green-400">12,500</div>
                        <div className="text-sm text-slate-400">Units This Month</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <div className="text-4xl mb-2">💰</div>
                        <div className="text-3xl font-bold text-sky-400">₦8.5M</div>
                        <div className="text-sm text-slate-400">Monthly Revenue</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Production Queue */}
                    <div className="col-span-2 bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Production Queue</h2>
                            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors">
                                Schedule Production
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { id: 'PROD-001', product: 'Cotton T-Shirts', qty: 5000, deadline: '2 days', progress: 75 },
                                { id: 'PROD-002', product: 'Denim Jeans', qty: 3000, deadline: '5 days', progress: 40 },
                                { id: 'PROD-003', product: 'Polo Shirts', qty: 4000, deadline: '7 days', progress: 15 },
                            ].map((prod) => (
                                <div key={prod.id} className="p-4 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <div className="font-medium">{prod.product}</div>
                                            <div className="text-sm text-slate-400">
                                                {prod.id} • {prod.qty} units
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{prod.progress}% Complete</div>
                                            <div className="text-xs text-slate-400">Due in {prod.deadline}</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all"
                                            style={{ width: `${prod.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Capacity & Resources */}
                    <div className="space-y-6">
                        {/* Capacity */}
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
                            <h2 className="text-xl font-semibold mb-4">Production Capacity</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Current Load</span>
                                        <span className="font-medium">85%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-3">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-slate-800">
                                    <div className="text-sm text-slate-400 mb-2">Available Capacity</div>
                                    <div className="text-2xl font-bold text-green-400">15%</div>
                                    <div className="text-xs text-slate-400">~1,800 units/week</div>
                                </div>
                            </div>
                        </div>

                        {/* Raw Materials */}
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
                            <h2 className="text-xl font-semibold mb-4">Raw Materials</h2>
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Cotton</span>
                                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">In Stock</span>
                                    </div>
                                    <div className="text-lg font-semibold mt-1">2,500 kg</div>
                                </div>
                                <div className="p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Denim Fabric</span>
                                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Low</span>
                                    </div>
                                    <div className="text-lg font-semibold mt-1">800 m</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quality Metrics */}
                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <div className="text-sm text-slate-400 mb-1">Quality Pass Rate</div>
                        <div className="text-3xl font-bold text-green-400">98.5%</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <div className="text-sm text-slate-400 mb-1">On-Time Delivery</div>
                        <div className="text-3xl font-bold text-blue-400">95%</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <div className="text-sm text-slate-400 mb-1">Customer Satisfaction</div>
                        <div className="text-3xl font-bold text-yellow-400">4.9/5</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
