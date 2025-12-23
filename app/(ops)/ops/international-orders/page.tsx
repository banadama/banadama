// app/(ops)/ops/international-orders/page.tsx - Ops International Orders
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InternationalOrder {
    id: string;
    orderId: string;
    buyerCountryCode: string;
    status: string;
    originalCurrency: string;
    originalAmount: number;
    convertedAmount: number;
    fxRate: number;
    supplierGreenTick: boolean;
    createdAt: string;
    order?: {
        productName: string;
        buyerEmail?: string;
        supplierName?: string;
    };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING_REVIEW: { label: 'Pending Review', color: 'bg-yellow-500/20 text-yellow-400' },
    DOCS_REQUIRED: { label: 'Docs Required', color: 'bg-orange-500/20 text-orange-400' },
    DOCS_SUBMITTED: { label: 'Docs Submitted', color: 'bg-blue-500/20 text-blue-400' },
    DOCS_APPROVED: { label: 'Docs Approved', color: 'bg-teal-500/20 text-teal-400' },
    SHIPPING_ARRANGED: { label: 'Shipping Arranged', color: 'bg-purple-500/20 text-purple-400' },
    IN_TRANSIT: { label: 'In Transit', color: 'bg-indigo-500/20 text-indigo-400' },
    CUSTOMS_CLEARANCE: { label: 'At Customs', color: 'bg-amber-500/20 text-amber-400' },
    DELIVERED: { label: 'Delivered', color: 'bg-green-500/20 text-green-400' },
    COMPLETED: { label: 'Completed', color: 'bg-green-600/20 text-green-500' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
    DISPUTED: { label: 'Disputed', color: 'bg-red-600/20 text-red-500' },
};

export default function OpsInternationalOrdersPage() {
    const [orders, setOrders] = useState<InternationalOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/ops/international-orders?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const formatMoney = (amount: number, currency: string) => {
        if (currency === 'NGN') return `₦${(amount / 100).toLocaleString()}`;
        return `${currency} ${(amount / 100).toLocaleString()}`;
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">🌍 International Orders</h1>
                <p className="text-slate-400">Manage cross-border orders, documents & shipping</p>
            </div>

            {/* Ops Authority Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🔧</span>
                    <div>
                        <div className="text-blue-400 font-medium">OPS AUTHORITY</div>
                        <div className="text-slate-400 text-sm">
                            You can: Coordinate documents, manage shipping, communicate with parties.
                            <br />
                            <span className="text-red-400">You CANNOT: Release payouts (Finance only)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['', 'PENDING_REVIEW', 'DOCS_REQUIRED', 'DOCS_SUBMITTED', 'SHIPPING_ARRANGED', 'IN_TRANSIT', 'DELIVERED'].map((s) => (
                    <button
                        key={s}
                        className={`px-3 py-2 rounded-lg text-sm ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setStatusFilter(s)}
                    >
                        {s ? STATUS_LABELS[s]?.label || s : 'All'}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No international orders</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Order</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Country</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Amount</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">FX Rate</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Supplier</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-sm text-white">{order.orderId.substring(0, 8)}...</div>
                                        <div className="text-xs text-slate-500">{order.order?.productName}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-lg">{getFlagEmoji(order.buyerCountryCode)}</span>
                                        <span className="ml-2 text-slate-300">{order.buyerCountryCode}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-white">{formatMoney(order.originalAmount, order.originalCurrency)}</div>
                                        <div className="text-xs text-slate-500">≈ {formatMoney(order.convertedAmount, 'NGN')}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-300">
                                        1 {order.originalCurrency} = ₦{order.fxRate.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {order.supplierGreenTick ? (
                                            <span className="text-green-400">🟢 Verified</span>
                                        ) : (
                                            <span className="text-yellow-400">⚠️ Unverified</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[order.status]?.color || 'bg-slate-500/20 text-slate-400'}`}>
                                            {STATUS_LABELS[order.status]?.label || order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link href={`/ops/international-orders/${order.id}`}>
                                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                                Manage
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
