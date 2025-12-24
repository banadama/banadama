// app/(wholesaler)/wholesaler/orders/page.tsx - Wholesaler Orders
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface WholesalerOrder {
    id: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    status: string;
    buyerName: string;
    createdAt: string;
    deliveryDeadline?: string;
}

const STATUS_ICONS: Record<string, string> = {
    PENDING: '⏳',
    CONFIRMED: '✓',
    PROCESSING: '📦',
    SHIPPED: '🚚',
    DELIVERED: '✅',
    CANCELLED: '❌',
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-blue-500/20 text-blue-400',
    PROCESSING: 'bg-purple-500/20 text-purple-400',
    SHIPPED: 'bg-orange-500/20 text-orange-400',
    DELIVERED: 'bg-green-500/20 text-green-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
};

export default function WholesalerOrdersPage() {
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<WholesalerOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(searchParams.get('status') || '');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const url = filter ? `/api/wholesaler/orders?status=${filter}` : '/api/wholesaler/orders';
                const res = await fetch(url, { credentials: 'include' });
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
        fetchOrders();
    }, [filter]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;
    const formatDate = (d: string) => new Date(d).toLocaleDateString();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">🛒 Orders</h1>
                <p className="text-slate-400">Manage incoming orders and fulfillment</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f ? `${STATUS_ICONS[f]} ${f}` : 'All Orders'}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : orders.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">🛒</span>
                    <p className="text-slate-400 mt-4">No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link key={order.id} href={`/wholesaler/orders/${order.id}`}>
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-medium">{order.productName}</h3>
                                        <p className="text-slate-500 text-sm">Buyer: {order.buyerName}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${STATUS_COLORS[order.status]}`}>
                                        <span>{STATUS_ICONS[order.status]}</span>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Quantity</span>
                                        <div className="text-white font-medium">{order.quantity.toLocaleString()} units</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Total Value</span>
                                        <div className="text-green-400 font-medium">{formatMoney(order.totalAmount)}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Order Date</span>
                                        <div className="text-white">{formatDate(order.createdAt)}</div>
                                    </div>
                                    {order.deliveryDeadline && (
                                        <div>
                                            <span className="text-slate-500">Delivery By</span>
                                            <div className="text-orange-400">{formatDate(order.deliveryDeadline)}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 text-right">
                                    <span className="text-blue-400 text-sm">View Details →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
