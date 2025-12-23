// app/(mobile)/mobile/buyer/orders/page.tsx - Buyer Orders (Mobile)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface Order {
    id: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    hasTracking: boolean;
}

const STATUS_ICONS: Record<string, string> = {
    PENDING: '⏳',
    CONFIRMED: '✓',
    IN_PRODUCTION: '🏭',
    SHIPPED: '🚚',
    DELIVERED: '✅',
    CANCELLED: '❌',
};

export default function BuyerOrdersMobile() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/buyer/orders', { credentials: 'include' });
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
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div>
            <MobileHeader title="My Orders" />

            <div className="p-4">
                {loading ? (
                    <div className="text-center text-slate-400 py-8">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                        <span className="text-4xl">🛒</span>
                        <p className="text-slate-500 mt-4">No orders yet</p>
                        <Link href="/mobile/buyer/marketplace">
                            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl">
                                Browse Products
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <Link key={order.id} href={`/mobile/buyer/orders/${order.id}`}>
                                <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{STATUS_ICONS[order.status] || '📦'}</span>
                                            <span className="text-white font-medium">{order.status.replace(/_/g, ' ')}</span>
                                        </div>
                                        {order.hasTracking && (
                                            <span className="text-blue-400 text-xs">📍 Track</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-300">{order.productName}</div>
                                    <div className="text-xs text-slate-500">{order.quantity} units</div>
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
