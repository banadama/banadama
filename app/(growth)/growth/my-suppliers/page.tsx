// app/(growth)/growth/my-suppliers/page.tsx - My Onboarded Suppliers
'use client';

import { useState, useEffect } from 'react';

interface GrowthSupplier {
    id: string;
    supplierId: string;
    supplier: {
        businessName: string;
        category?: string;
        verificationLevel?: string;
    };
    onboardedAt: string;
    activatedAt?: string;
    firstOrderAt?: string;
    firstCompletedOrderAt?: string;
    totalProducts: number;
    totalOrders: number;
    completedOrders: number;
}

export default function MySuppliersPage() {
    const [suppliers, setSuppliers] = useState<GrowthSupplier[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await fetch('/api/growth/my-suppliers', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setSuppliers(data.suppliers || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, []);

    const getStatus = (s: GrowthSupplier) => {
        if (s.completedOrders > 0) return { label: 'Active & Earning', color: 'bg-green-500/20 text-green-400' };
        if (s.totalOrders > 0) return { label: 'Has Orders', color: 'bg-blue-500/20 text-blue-400' };
        if (s.totalProducts > 0) return { label: 'Products Live', color: 'bg-purple-500/20 text-purple-400' };
        if (s.activatedAt) return { label: 'Activated', color: 'bg-yellow-500/20 text-yellow-400' };
        return { label: 'Pending', color: 'bg-slate-500/20 text-slate-400' };
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">🏭 My Suppliers</h1>
                <p className="text-slate-400">Suppliers you've onboarded to the platform</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{suppliers.length}</div>
                    <div className="text-slate-400 text-sm">Total Onboarded</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                        {suppliers.filter(s => s.completedOrders > 0).length}
                    </div>
                    <div className="text-slate-400 text-sm">Generating Earnings</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                        {suppliers.filter(s => s.completedOrders === 0).length}
                    </div>
                    <div className="text-slate-400 text-sm">Pending Activity</div>
                </div>
            </div>

            {/* Suppliers List */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading suppliers...</div>
                ) : suppliers.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No suppliers onboarded yet. Start by onboarding your first supplier!
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Supplier</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Products</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Orders</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Completed</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {suppliers.map((s) => {
                                const status = getStatus(s);
                                return (
                                    <tr key={s.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{s.supplier.businessName}</div>
                                            <div className="text-sm text-slate-500">{s.supplier.category}</div>
                                            <div className="text-xs text-slate-600">
                                                Onboarded {new Date(s.onboardedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-white">{s.totalProducts}</td>
                                        <td className="px-6 py-4 text-center text-white">{s.totalOrders}</td>
                                        <td className="px-6 py-4 text-center">
                                            {s.completedOrders > 0 ? (
                                                <span className="text-green-400 font-medium">{s.completedOrders}</span>
                                            ) : (
                                                <span className="text-slate-500">0</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {s.supplier.verificationLevel === 'GREEN' && <span className="text-green-400">🟢 Green</span>}
                                            {s.supplier.verificationLevel === 'BLUE' && <span className="text-blue-400">🔵 Blue</span>}
                                            {!s.supplier.verificationLevel && <span className="text-slate-500">None</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Reminder */}
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-400 text-sm">
                    💡 You earn commission when your suppliers complete orders.
                    Help them upload products and get their first sale!
                </p>
            </div>
        </div>
    );
}
