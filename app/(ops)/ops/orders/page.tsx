// app/(ops)/ops/orders/page.tsx - Order Tracking (OPS Execution)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
    id: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    status: string;
    buyerEmail: string;
    supplierName?: string;
    createdAt: string;
    expectedDelivery?: string;
}

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending', color: 'text-yellow-400 bg-yellow-500/20' },
    CONFIRMED: { label: 'Confirmed', color: 'text-blue-400 bg-blue-500/20' },
    PROCESSING: { label: 'Processing', color: 'text-purple-400 bg-purple-500/20' },
    SHIPPED: { label: 'Shipped', color: 'text-cyan-400 bg-cyan-500/20' },
    DELIVERED: { label: 'Delivered', color: 'text-green-400 bg-green-500/20' },
    CANCELLED: { label: 'Cancelled', color: 'text-red-400 bg-red-500/20' },
    DISPUTED: { label: 'Disputed', color: 'text-orange-400 bg-orange-500/20' },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PROCESSING');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/ops/orders?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/ops/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (err) {
            console.error('Error updating order:', err);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Order Tracking</h1>
                    <p className="text-slate-400">Monitor and update order status</p>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {Object.entries(ORDER_STATUS).map(([key, val]) => (
                    <button
                        key={key}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === key
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        onClick={() => setStatusFilter(key)}
                    >
                        {val.label}
                    </button>
                ))}
                <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!statusFilter
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    onClick={() => setStatusFilter('')}
                >
                    All
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No orders found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Order</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Buyer</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Supplier</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{order.productName}</div>
                                        <div className="text-sm text-slate-500">Qty: {order.quantity.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-green-400 font-medium">
                                        ₦{(order.totalAmount / 100).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{order.buyerEmail}</td>
                                    <td className="px-6 py-4 text-slate-300">{order.supplierName || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${ORDER_STATUS[order.status]?.color || 'bg-slate-500/20 text-slate-400'}`}>
                                            {ORDER_STATUS[order.status]?.label || order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {order.status === 'PROCESSING' && (
                                                <button
                                                    className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-600/30"
                                                    onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                                                >
                                                    Mark Shipped
                                                </button>
                                            )}
                                            {order.status === 'SHIPPED' && (
                                                <button
                                                    className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30"
                                                    onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                            <Link href={`/ops/orders/${order.id}`}>
                                                <button className="px-3 py-1 bg-slate-600/20 text-slate-400 rounded-lg text-sm hover:bg-slate-600/30">
                                                    Details
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Ops Authority Note */}
            <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-500">
                    <strong>Ops Authority:</strong> You can track orders and update status based on proof.
                    Payment releases and refunds require Admin/Finance approval.
                </p>
            </div>
        </div>
    );
}
