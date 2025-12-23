"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
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
    deliveryCity?: string;
    supplier?: { businessName: string };
    pricingSnapshot?: any;
}

const ORDER_STEPS = ["PENDING", "PROCESSING", "IN_PRODUCTION", "READY_TO_SHIP", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const getTimelineSteps = () => {
        if (!order) return [];
        const currentIndex = ORDER_STEPS.indexOf(order.status);

        return ORDER_STEPS.map((step, index) => ({
            label: step.replace(/_/g, " "),
            status: index < currentIndex ? "completed" as const :
                index === currentIndex ? "current" as const : "pending" as const,
        }));
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
                <Link href="/buyer/orders" className="text-sm text-emerald-400 hover:text-emerald-300">
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <Link href="/buyer/orders" className="text-sm text-emerald-400 hover:text-emerald-300">
                        ← Back to Orders
                    </Link>
                    <h1 className="text-2xl font-semibold text-slate-50 mt-4">
                        Order {order.id.slice(0, 8)}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <StatusBadge status={order.status} size="md" />
                    </div>
                </div>
                <Link
                    href={`/buyer/orders/${params.id}/tracking`}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-blue-400 transition-colors"
                >
                    📍 Track Order
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Details */}
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
                                <dt className="text-slate-400">Total Price</dt>
                                <dd className="text-emerald-400 font-medium mt-1">₦{order.totalPrice.toLocaleString()}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Status</dt>
                                <dd className="mt-1"><StatusBadge status={order.status} /></dd>
                            </div>
                        </dl>
                    </div>

                    {/* Delivery Info */}
                    {(order.deliveryAddress || order.deliveryCity) && (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                            <h3 className="font-medium text-slate-100 mb-4">Delivery Information</h3>
                            <p className="text-sm text-slate-300">{order.deliveryAddress}</p>
                            {order.deliveryCity && <p className="text-sm text-slate-400">{order.deliveryCity}</p>}
                        </div>
                    )}

                    {/* Supplier Info */}
                    {order.supplier && (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                            <h3 className="font-medium text-slate-100 mb-2">Supplier</h3>
                            <p className="text-sm text-slate-300">{order.supplier.businessName}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar - Timeline */}
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
