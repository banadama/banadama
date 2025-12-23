// app/(mobile)/mobile/supplier/dashboard/page.tsx - Supplier Mobile Dashboard
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface SupplierStats {
    pendingOrders: number;
    inProductionOrders: number;
    readyToShip: number;
    walletBalance: number;
    unreadMessages: number;
}

export default function SupplierMobileDashboard() {
    const [stats, setStats] = useState<SupplierStats>({
        pendingOrders: 0,
        inProductionOrders: 0,
        readyToShip: 0,
        walletBalance: 0,
        unreadMessages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/mobile/supplier/stats', { credentials: 'include' });
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

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div>
            <MobileHeader title="Supplier Dashboard" />

            <div className="p-4">
                {/* Wallet Balance */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-5 mb-4">
                    <div className="text-green-100 text-sm">Wallet Balance</div>
                    <div className="text-3xl font-bold text-white">{formatMoney(stats.walletBalance)}</div>
                    <div className="text-green-200 text-xs mt-1">Read-only on mobile</div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Link href="/mobile/supplier/orders?status=PENDING">
                        <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                            <div className="text-3xl font-bold text-yellow-400">{stats.pendingOrders}</div>
                            <div className="text-slate-400 text-sm">Pending</div>
                        </div>
                    </Link>
                    <Link href="/mobile/supplier/orders?status=IN_PRODUCTION">
                        <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                            <div className="text-3xl font-bold text-blue-400">{stats.inProductionOrders}</div>
                            <div className="text-slate-400 text-sm">In Production</div>
                        </div>
                    </Link>
                    <Link href="/mobile/supplier/orders?status=READY">
                        <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                            <div className="text-3xl font-bold text-green-400">{stats.readyToShip}</div>
                            <div className="text-slate-400 text-sm">Ready to Ship</div>
                        </div>
                    </Link>
                    <Link href="/mobile/supplier/messages">
                        <div className="bg-slate-800 rounded-xl p-4 active:bg-slate-700">
                            <div className="text-3xl font-bold text-purple-400">{stats.unreadMessages}</div>
                            <div className="text-slate-400 text-sm">Messages</div>
                        </div>
                    </Link>
                </div>

                {/* Quick Actions */}
                <h3 className="text-white font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                    <Link href="/mobile/supplier/orders">
                        <div className="bg-blue-600 rounded-xl p-4 flex items-center justify-between active:bg-blue-700">
                            <span className="text-white font-medium">📦 View All Orders</span>
                            <span className="text-white">→</span>
                        </div>
                    </Link>
                    <Link href="/mobile/supplier/upload-proof">
                        <div className="bg-green-600 rounded-xl p-4 flex items-center justify-between active:bg-green-700">
                            <span className="text-white font-medium">📷 Upload Production Photo</span>
                            <span className="text-white">→</span>
                        </div>
                    </Link>
                </div>

                {/* Notice */}
                <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-slate-400 text-sm text-center">
                        📱 <strong>Mobile Mode</strong> - Order updates & chat enabled
                    </p>
                    <p className="text-slate-500 text-xs text-center mt-1">
                        Wallet withdrawals require web access
                    </p>
                </div>
            </div>
        </div>
    );
}
