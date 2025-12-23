// app/(mobile)/mobile/ops/dashboard/page.tsx - OPS Mobile Dashboard
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface OpsStats {
    pendingRfqs: number;
    activeOrders: number;
    pendingDeliveries: number;
    unreadMessages: number;
}

export default function OpsMobileDashboard() {
    const [stats, setStats] = useState<OpsStats>({
        pendingRfqs: 0,
        activeOrders: 0,
        pendingDeliveries: 0,
        unreadMessages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/mobile/ops/stats', { credentials: 'include' });
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <MobileHeader title="Ops Dashboard" />

            <div className="p-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Link href="/mobile/ops/rfqs">
                        <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                            <div className="text-3xl font-bold text-blue-400">{stats.pendingRfqs}</div>
                            <div className="text-slate-400 text-sm">Pending RFQs</div>
                        </div>
                    </Link>
                    <Link href="/mobile/ops/orders">
                        <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                            <div className="text-3xl font-bold text-green-400">{stats.activeOrders}</div>
                            <div className="text-slate-400 text-sm">Active Orders</div>
                        </div>
                    </Link>
                    <Link href="/mobile/ops/logistics">
                        <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                            <div className="text-3xl font-bold text-orange-400">{stats.pendingDeliveries}</div>
                            <div className="text-slate-400 text-sm">Deliveries</div>
                        </div>
                    </Link>
                    <Link href="/mobile/ops/messages">
                        <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                            <div className="text-3xl font-bold text-purple-400">{stats.unreadMessages}</div>
                            <div className="text-slate-400 text-sm">Messages</div>
                        </div>
                    </Link>
                </div>

                {/* Quick Actions */}
                <h3 className="text-white font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                    <Link href="/mobile/ops/rfqs?status=PENDING">
                        <div className="bg-blue-600 rounded-xl p-4 flex items-center justify-between active:bg-blue-700">
                            <span className="text-white font-medium">📋 Process RFQs</span>
                            <span className="text-white">→</span>
                        </div>
                    </Link>
                    <Link href="/mobile/ops/logistics?status=OUT_FOR_DELIVERY">
                        <div className="bg-orange-600 rounded-xl p-4 flex items-center justify-between active:bg-orange-700">
                            <span className="text-white font-medium">🚚 Update Deliveries</span>
                            <span className="text-white">→</span>
                        </div>
                    </Link>
                    <Link href="/mobile/ops/scan">
                        <div className="bg-green-600 rounded-xl p-4 flex items-center justify-between active:bg-green-700">
                            <span className="text-white font-medium">📷 Scan & Upload POD</span>
                            <span className="text-white">→</span>
                        </div>
                    </Link>
                </div>

                {/* Mode Notice */}
                <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-slate-400 text-sm text-center">
                        📱 <strong>Mobile Mode</strong> - Field execution enabled
                    </p>
                    <p className="text-slate-500 text-xs text-center mt-1">
                        Admin & Finance actions require web access
                    </p>
                </div>
            </div>
        </div>
    );
}
