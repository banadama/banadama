// app/(mobile)/mobile/ops/logistics/page.tsx - OPS Logistics (Mobile)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface Shipment {
    id: string;
    orderId: string;
    status: string;
    carrierName?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    productName: string;
    buyerName: string;
}

const STATUS_ICONS: Record<string, string> = {
    PENDING: '📦',
    PICKED_UP: '🚚',
    IN_TRANSIT: '🛣️',
    OUT_FOR_DELIVERY: '📍',
    DELIVERED: '✅',
    FAILED: '❌',
};

export default function OpsLogisticsMobile() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = filter ? `/api/ops/logistics?status=${filter}` : '/api/ops/logistics';
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setShipments(data.shipments || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filter]);

    return (
        <div>
            <MobileHeader title="Deliveries" />

            {/* Filter Tabs */}
            <div className="flex gap-2 px-4 py-3 bg-slate-800/50 overflow-x-auto">
                {['', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter === f ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f || 'All'}
                    </button>
                ))}
            </div>

            {/* Shipments List */}
            <div className="p-4">
                {loading ? (
                    <div className="text-center text-slate-400 py-8">Loading...</div>
                ) : shipments.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">No shipments found</div>
                ) : (
                    <div className="space-y-3">
                        {shipments.map((s) => (
                            <Link key={s.id} href={`/mobile/ops/logistics/${s.orderId}`}>
                                <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{STATUS_ICONS[s.status] || '📦'}</span>
                                            <span className="text-white font-medium">{s.status.replace(/_/g, ' ')}</span>
                                        </div>
                                        {s.trackingNumber && (
                                            <span className="text-xs text-blue-400 font-mono">{s.trackingNumber}</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-400">{s.productName}</div>
                                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                                        <span>👤 {s.buyerName}</span>
                                        {s.estimatedDelivery && (
                                            <span>ETA: {new Date(s.estimatedDelivery).toLocaleDateString()}</span>
                                        )}
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
