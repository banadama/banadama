// app/(factory)/factory/orders/page.tsx - Factory Orders
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface FactoryOrder {
    id: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    productionStatus: string;
    expectedEndDate?: string;
    createdAt: string;
}

const STATUS_ICONS: Record<string, string> = {
    NOT_STARTED: '⏳',
    IN_PRODUCTION: '🏭',
    QUALITY_CHECK: '🔍',
    READY_TO_SHIP: '✅',
    SHIPPED: '🚚',
};

const STATUS_COLORS: Record<string, string> = {
    NOT_STARTED: 'bg-slate-500/20 text-slate-400',
    IN_PRODUCTION: 'bg-purple-500/20 text-purple-400',
    QUALITY_CHECK: 'bg-yellow-500/20 text-yellow-400',
    READY_TO_SHIP: 'bg-green-500/20 text-green-400',
    SHIPPED: 'bg-blue-500/20 text-blue-400',
};

export default function FactoryOrdersPage() {
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<FactoryOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(searchParams.get('status') || '');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const url = filter ? `/api/factory/orders?status=${filter}` : '/api/factory/orders';
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
                <h1 className="text-2xl font-bold text-white mb-2">📦 Production Orders</h1>
                <p className="text-slate-400">Manage production and update status</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['', 'NOT_STARTED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY_TO_SHIP', 'SHIPPED'].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${filter === f ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f ? (STATUS_ICONS[f] + ' ' + f.replace(/_/g, ' ')) : 'All Orders'}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : orders.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">📦</span>
                    <p className="text-slate-400 mt-4">No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link key={order.id} href={`/factory/production/${order.id}`}>
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-medium">{order.productName}</h3>
                                        <p className="text-slate-500 text-sm">{order.quantity.toLocaleString()} units</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${STATUS_COLORS[order.productionStatus]}`}>
                                        <span>{STATUS_ICONS[order.productionStatus]}</span>
                                        {order.productionStatus.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Total Value</span>
                                        <div className="text-green-400 font-medium">{formatMoney(order.totalAmount)}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Expected Completion</span>
                                        <div className="text-white">{order.expectedEndDate ? formatDate(order.expectedEndDate) : '-'}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Order Date</span>
                                        <div className="text-white">{formatDate(order.createdAt)}</div>
                                    </div>
                                </div>

                                <div className="mt-4 text-right">
                                    <span className="text-purple-400 text-sm">Update Production →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
