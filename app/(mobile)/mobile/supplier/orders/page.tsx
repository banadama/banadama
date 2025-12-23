// app/(mobile)/mobile/supplier/orders/page.tsx - Supplier Orders (Mobile)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface Order {
    id: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-blue-500/20 text-blue-400',
    IN_PRODUCTION: 'bg-purple-500/20 text-purple-400',
    READY: 'bg-green-500/20 text-green-400',
    SHIPPED: 'bg-orange-500/20 text-orange-400',
    DELIVERED: 'bg-emerald-500/20 text-emerald-400',
};

export default function SupplierOrdersMobile() {
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(searchParams.get('status') || '');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const url = filter ? `/api/supplier/orders?status=${filter}` : '/api/supplier/orders';
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

    return (
        <div>
            <MobileHeader title="My Orders" />

            {/* Filter Tabs */}
            <div className="flex gap-2 px-4 py-3 bg-slate-800/50 overflow-x-auto">
                {['', 'PENDING', 'IN_PRODUCTION', 'READY', 'SHIPPED'].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f || 'All'}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="p-4">
                {loading ? (
                    <div className="text-center text-slate-400 py-8">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">No orders found</div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <Link key={order.id} href={`/mobile/supplier/orders/${order.id}`}>
                                <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-white">{order.productName}</div>
                                        <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[order.status] || 'bg-slate-600 text-slate-300'}`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-400">{order.quantity} units</div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-green-400 font-medium">{formatMoney(order.totalAmount)}</span>
                                        <span className="text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
