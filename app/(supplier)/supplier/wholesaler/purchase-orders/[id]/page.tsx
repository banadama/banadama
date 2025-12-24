"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet, apiPatch } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StepTimeline } from "@/components/ui/StepTimeline";

interface OrderDetail {
    id: string;
    productName: string;
    quantity: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    deliveryAddress?: string;
}

const ORDER_STEPS = ["PROCESSING", "IN_PRODUCTION", "READY_TO_SHIP", "SHIPPED"];
const SUPPLIER_STATUSES = ["IN_PRODUCTION", "READY_TO_SHIP"];

export default function WholesalerOrderDetailPage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiGet<any>(`/api/orders/${params.id}`);
            setOrder(data.order || data);
        } catch (err: any) {
            setError(err.message || "Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (updating) return;

        setUpdating(true);
        try {
            // Use canonical endpoint: PATCH /api/orders/[id]/status
            await apiPatch(`/api/orders/${params.id}/status`, { status: newStatus });
            await fetchOrder();
        } catch (err: any) {
            setError(err.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const getTimelineSteps = () => {
        if (!order) return [];
        const currentIndex = ORDER_STEPS.indexOf(order.status);

        return ORDER_STEPS.map((step, index) => ({
            label: step.replace(/_/g, " "),
            status: index < currentIndex ? "completed" as const :
                index === currentIndex ? "current" as const : "pending" as const,
        }));
    };

    const getNextStatus = () => {
        if (!order) return null;
        if (order.status === "PROCESSING") return "IN_PRODUCTION";
        const currentIndex = SUPPLIER_STATUSES.indexOf(order.status);
        if (currentIndex >= 0 && currentIndex < SUPPLIER_STATUSES.length - 1) {
            return SUPPLIER_STATUSES[currentIndex + 1];
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-slate-400">Loading order...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error || "Order not found"}</p>
                </div>
                <Link href="/wholesaler/purchase-orders" className="text-sm text-indigo-400 hover:text-indigo-300">
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    const nextStatus = getNextStatus();

    return (
        <div className="space-y-6">
            <div>
                <Link href="/wholesaler/purchase-orders" className="text-sm text-indigo-400 hover:text-indigo-300">
                    ← Back to Orders
                </Link>
                <h1 className="text-2xl font-semibold text-slate-50 mt-4">Order {order.id.slice(0, 8)}</h1>
                <div className="flex items-center gap-3 mt-2">
                    <StatusBadge status={order.status} size="md" />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="font-medium text-slate-100 mb-4">Order Details</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-slate-400">Product</dt>
                                <dd className="text-slate-100 mt-1">{order.productName}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Quantity</dt>
                                <dd className="text-slate-100 mt-1">{order.quantity}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Total Value</dt>
                                <dd className="text-emerald-400 font-medium mt-1">₦{order.totalPrice.toLocaleString()}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Status</dt>
                                <dd className="mt-1"><StatusBadge status={order.status} /></dd>
                            </div>
                        </dl>
                    </div>

                    {nextStatus && (
                        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6">
                            <h3 className="font-medium text-indigo-400 mb-4">Update Status</h3>
                            <button
                                onClick={() => handleUpdateStatus(nextStatus)}
                                disabled={updating}
                                className="rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-slate-950 hover:bg-indigo-400 disabled:opacity-50"
                            >
                                {updating ? "Updating..." : `Mark as ${nextStatus.replace(/_/g, " ")}`}
                            </button>
                        </div>
                    )}

                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="font-medium text-slate-100 mb-2">Need Help?</h3>
                        <Link
                            href="/wholesaler/messages"
                            className="inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
                        >
                            💬 Message Ops
                        </Link>
                    </div>
                </div>

                <div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="font-medium text-slate-100 mb-4">Order Progress</h3>
                        <StepTimeline steps={getTimelineSteps()} />
                    </div>
                </div>
            </div>
        </div>
    );
}
