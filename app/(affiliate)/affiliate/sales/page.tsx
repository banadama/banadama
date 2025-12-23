// app/(affiliate)/affiliate/sales/page.tsx - Affiliate Sales Tracking
'use client';

import { useState, useEffect } from 'react';

interface AffiliateSale {
    id: string;
    orderId: string;
    orderAmount: number;
    commissionRate: number;
    commissionAmount: number;
    status: string;
    orderCreatedAt: string;
    deliveryConfirmedAt?: string;
    link?: {
        name?: string;
        trackingCode: string;
    };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending Delivery', color: 'text-yellow-400 bg-yellow-500/20' },
    ESCROW_LOCKED: { label: 'In Escrow', color: 'text-blue-400 bg-blue-500/20' },
    DELIVERED: { label: 'Delivered ✓', color: 'text-green-400 bg-green-500/20' },
    PAID: { label: 'Paid Out', color: 'text-purple-400 bg-purple-500/20' },
    CANCELLED: { label: 'Cancelled', color: 'text-red-400 bg-red-500/20' },
    DISPUTED: { label: 'Disputed', color: 'text-orange-400 bg-orange-500/20' },
};

export default function AffiliateSalesPage() {
    const [sales, setSales] = useState<AffiliateSale[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchSales = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/affiliate/sales?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setSales(data.sales || []);
            }
        } catch (err) {
            console.error('Error fetching sales:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [statusFilter]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Sales</h1>
                <p className="text-slate-400">Track orders from your affiliate links</p>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {[
                    { value: '', label: 'All' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'DELIVERED', label: 'Delivered' },
                    { value: 'PAID', label: 'Paid' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                ].map((opt) => (
                    <button
                        key={opt.value}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === opt.value
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        onClick={() => setStatusFilter(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Sales Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-400 text-sm">
                    💡 <strong>Commission is earned only after delivery confirmation.</strong>
                    Orders marked as "Delivered" will be credited to your pending earnings.
                </p>
            </div>

            {/* Sales Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading sales...</div>
                ) : sales.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No sales yet. Share your links to start earning!</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Order</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Link</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Order Amount</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Rate</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Commission</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-mono text-sm text-slate-300">
                                        {sale.orderId.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        {sale.link?.name || sale.link?.trackingCode || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-white">
                                        {formatMoney(sale.orderAmount)}
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-300">
                                        {(sale.commissionRate * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4 text-right text-purple-400 font-medium">
                                        {formatMoney(sale.commissionAmount)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[sale.status]?.color || 'bg-slate-500/20 text-slate-400'}`}>
                                            {STATUS_LABELS[sale.status]?.label || sale.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                        {new Date(sale.orderCreatedAt).toLocaleDateString()}
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
