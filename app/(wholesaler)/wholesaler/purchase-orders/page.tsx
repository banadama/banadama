"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Order {
    id: string;
    productName: string;
    quantity: number;
    totalPrice: number;
    status: string;
    createdAt: string;
}

export default function WholesalerPurchaseOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiGet<any>("/api/orders");
            setOrders(data.orders || []);
        } catch (err: any) {
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Purchase Orders</h1>
                <p className="text-sm text-slate-400 mt-1">Your assigned orders</p>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <p className="text-slate-400">Loading orders...</p>
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {orders.length === 0 ? (
                        <div className="text-center py-12 rounded-xl border border-slate-800 bg-slate-900/40">
                            <div className="text-4xl mb-4">📦</div>
                            <p className="text-slate-400">No orders yet</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Order ID</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Product</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Qty</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Status</th>
                                        <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Date</th>
                                        <th className="text-right text-xs text-slate-400 font-medium px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-slate-100">{order.id.slice(0, 8)}</td>
                                            <td className="px-4 py-3 text-sm text-slate-300">{order.productName}</td>
                                            <td className="px-4 py-3 text-sm text-slate-300">{order.quantity}</td>
                                            <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                                            <td className="px-4 py-3 text-sm text-slate-400">{formatDate(order.createdAt)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/wholesaler/purchase-orders/${order.id}`}
                                                    className="text-sm text-indigo-400 hover:text-indigo-300"
                                                >
                                                    Manage →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
