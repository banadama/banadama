// app/(ops)/ops/international-orders/[id]/page.tsx - Manage International Order
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface InternationalOrderDetail {
    id: string;
    orderId: string;
    buyerCountryCode: string;
    status: string;
    originalCurrency: string;
    originalAmount: number;
    convertedAmount: number;
    fxRate: number;
    supplierGreenTick: boolean;
    buyerBlueTick: boolean;
    opsNotes?: string;
    createdAt: string;
    order?: {
        productName: string;
        quantity: number;
        deliveryAddress: string;
        buyer: { email: string; name?: string };
        supplier: { businessName: string };
    };
    documents: Array<{
        id: string;
        type: string;
        name: string;
        status: string;
        fileUrl: string;
    }>;
    shipment?: {
        method: string;
        carrier?: string;
        trackingNumber?: string;
        estimatedArrival?: string;
        currentLocation?: string;
    };
}

const STATUS_FLOW = [
    'PENDING_REVIEW',
    'DOCS_REQUIRED',
    'DOCS_SUBMITTED',
    'DOCS_APPROVED',
    'SHIPPING_ARRANGED',
    'IN_TRANSIT',
    'CUSTOMS_CLEARANCE',
    'DELIVERED',
    'COMPLETED',
];

export default function ManageInternationalOrderPage() {
    const params = useParams();
    const [order, setOrder] = useState<InternationalOrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/ops/international-orders/${params.id}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    const updateStatus = async (newStatus: string) => {
        const notes = prompt('Add notes (optional):');

        try {
            const res = await fetch(`/api/ops/international-orders/${params.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus, notes }),
            });
            if (res.ok) {
                fetchOrder();
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const formatMoney = (amount: number, currency: string) => {
        if (currency === 'NGN') return `₦${(amount / 100).toLocaleString()}`;
        return `${currency} ${(amount / 100).toLocaleString()}`;
    };

    if (loading) {
        return <div className="p-6 text-center text-slate-400">Loading order...</div>;
    }

    if (!order) {
        return <div className="p-6 text-center text-slate-500">Order not found</div>;
    }

    const currentStepIndex = STATUS_FLOW.indexOf(order.status);

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link href="/ops/international-orders" className="text-blue-400 hover:underline text-sm">
                    ← Back to Orders
                </Link>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        🌍 International Order
                    </h1>
                    <p className="text-slate-400 font-mono">{order.orderId}</p>
                </div>
                <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium">
                    {order.status.replace(/_/g, ' ')}
                </span>
            </div>

            {/* Progress Timeline */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Order Timeline</h3>
                <div className="flex items-center justify-between overflow-x-auto">
                    {STATUS_FLOW.slice(0, -1).map((step, idx) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${idx < currentStepIndex ? 'bg-green-500 text-white' :
                                    idx === currentStepIndex ? 'bg-blue-500 text-white' :
                                        'bg-slate-700 text-slate-400'
                                }`}>
                                {idx < currentStepIndex ? '✓' : idx + 1}
                            </div>
                            {idx < STATUS_FLOW.length - 2 && (
                                <div className={`w-12 h-1 ${idx < currentStepIndex ? 'bg-green-500' : 'bg-slate-700'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    {STATUS_FLOW.slice(0, -1).map((step) => (
                        <span key={step} className="truncate max-w-[80px]">
                            {step.replace(/_/g, ' ').toLowerCase()}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Order Details */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Order Details</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Product</span>
                            <span className="text-white">{order.order?.productName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Quantity</span>
                            <span className="text-white">{order.order?.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Buyer Country</span>
                            <span className="text-white">{order.buyerCountryCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Amount</span>
                            <span className="text-white">{formatMoney(order.originalAmount, order.originalCurrency)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Converted</span>
                            <span className="text-green-400">{formatMoney(order.convertedAmount, 'NGN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">FX Rate</span>
                            <span className="text-slate-300">1 {order.originalCurrency} = ₦{order.fxRate}</span>
                        </div>
                    </div>
                </div>

                {/* Verification Status */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Verification</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Supplier</span>
                            {order.supplierGreenTick ? (
                                <span className="text-green-400">🟢 GREEN TICK</span>
                            ) : (
                                <span className="text-red-400">❌ Not Verified</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Buyer</span>
                            {order.buyerBlueTick ? (
                                <span className="text-blue-400">🔵 BLUE TICK</span>
                            ) : (
                                <span className="text-yellow-400">⚠️ Unverified</span>
                            )}
                        </div>
                        {!order.supplierGreenTick && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                                <p className="text-red-400 text-xs">
                                    ⚠️ Supplier must have GREEN TICK for international orders
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium">Trade Documents</h3>
                        <Link href={`/ops/international-orders/${order.id}/documents`}>
                            <button className="text-blue-400 text-sm hover:underline">Manage →</button>
                        </Link>
                    </div>
                    {order.documents.length === 0 ? (
                        <p className="text-slate-500 text-sm">No documents uploaded</p>
                    ) : (
                        <div className="space-y-2">
                            {order.documents.map((doc) => (
                                <div key={doc.id} className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                                    <div>
                                        <div className="text-white text-sm">{doc.name}</div>
                                        <div className="text-xs text-slate-500">{doc.type}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${doc.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                            doc.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {doc.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Shipping */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium">Shipping</h3>
                        <Link href={`/ops/international-orders/${order.id}/shipping`}>
                            <button className="text-blue-400 text-sm hover:underline">Manage →</button>
                        </Link>
                    </div>
                    {order.shipment ? (
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Method</span>
                                <span className="text-white">{order.shipment.method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Carrier</span>
                                <span className="text-white">{order.shipment.carrier || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Tracking</span>
                                <span className="text-blue-400 font-mono">{order.shipment.trackingNumber || '-'}</span>
                            </div>
                            {order.shipment.currentLocation && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Location</span>
                                    <span className="text-white">{order.shipment.currentLocation}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">Shipping not arranged yet</p>
                    )}
                </div>
            </div>

            {/* Status Actions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mt-6">
                <h3 className="text-white font-medium mb-4">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                    {currentStepIndex >= 0 && currentStepIndex < STATUS_FLOW.length - 2 && (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={() => updateStatus(STATUS_FLOW[currentStepIndex + 1])}
                        >
                            Move to: {STATUS_FLOW[currentStepIndex + 1].replace(/_/g, ' ')}
                        </button>
                    )}
                    {order.status === 'DELIVERED' && (
                        <div className="text-yellow-400 text-sm">
                            ⚠️ Finance must release payout to mark as COMPLETED
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
