// app/(ops)/ops/logistics/[orderId]/page.tsx - Manage Shipment
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ShipmentDetail {
    id: string;
    orderId: string;
    type: string;
    status: string;
    carrierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedPickup?: string;
    actualPickup?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    pickupAddress?: string;
    deliveryAddress: string;
    recipientName?: string;
    recipientPhone?: string;
    shippingCost?: number;
    specialInstructions?: string;
    deliveryConfirmed: boolean;
    confirmedByBuyer: boolean;
    confirmedByOps: boolean;
    events: Array<{
        id: string;
        status: string;
        location?: string;
        note?: string;
        timestamp: string;
    }>;
    proofOfDelivery: Array<{
        id: string;
        type: string;
        fileUrl: string;
        isValid: boolean;
        uploadedAt: string;
    }>;
    order?: {
        productName: string;
        quantity: number;
        buyer: { name?: string; email: string };
        supplier: { businessName: string };
    };
}

const STATUS_FLOW = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const STATUS_LABELS: Record<string, string> = {
    PENDING: '📦 Pending',
    PICKED_UP: '🚚 Picked Up',
    IN_TRANSIT: '🛣️ In Transit',
    OUT_FOR_DELIVERY: '📍 Out for Delivery',
    DELIVERED: '✅ Delivered',
    FAILED: '❌ Failed',
    RETURNED: '↩️ Returned',
};

export default function ManageShipmentPage() {
    const params = useParams();
    const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        carrierName: '',
        trackingNumber: '',
        estimatedDelivery: '',
        specialInstructions: '',
    });

    const fetchShipment = async () => {
        try {
            const res = await fetch(`/api/ops/logistics/${params.orderId}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setShipment(data.shipment);
                if (data.shipment) {
                    setFormData({
                        carrierName: data.shipment.carrierName || '',
                        trackingNumber: data.shipment.trackingNumber || '',
                        estimatedDelivery: data.shipment.estimatedDelivery?.split('T')[0] || '',
                        specialInstructions: data.shipment.specialInstructions || '',
                    });
                }
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipment();
    }, [params.orderId]);

    const updateStatus = async (newStatus: string) => {
        const note = prompt('Add a note for this status update:');
        const location = prompt('Current location (optional):');

        setUpdating(true);
        try {
            const res = await fetch(`/api/ops/logistics/${params.orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus, note, location }),
            });
            if (res.ok) {
                fetchShipment();
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUpdating(false);
        }
    };

    const saveDetails = async () => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/ops/logistics/${params.orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setEditMode(false);
                fetchShipment();
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUpdating(false);
        }
    };

    const confirmDelivery = async () => {
        if (!confirm('Confirm delivery as OPS? This requires POD to be uploaded.')) return;

        setUpdating(true);
        try {
            const res = await fetch(`/api/ops/logistics/${params.orderId}/confirm`, {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                alert('Delivery confirmed. Finance can now release payout.');
                fetchShipment();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to confirm');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-slate-400">Loading shipment...</div>;
    }

    if (!shipment) {
        return (
            <div className="p-6">
                <Link href="/ops/logistics" className="text-blue-400 hover:underline text-sm">
                    ← Back to Logistics
                </Link>
                <div className="mt-8 text-center">
                    <p className="text-slate-500 mb-4">No shipment found for this order.</p>
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={async () => {
                            const res = await fetch(`/api/ops/logistics/${params.orderId}`, {
                                method: 'POST',
                                credentials: 'include',
                            });
                            if (res.ok) {
                                fetchShipment();
                            }
                        }}
                    >
                        📦 Create Shipment
                    </button>
                </div>
            </div>
        );
    }

    const currentStepIndex = STATUS_FLOW.indexOf(shipment.status);

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link href="/ops/logistics" className="text-blue-400 hover:underline text-sm">
                    ← Back to Logistics
                </Link>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        📦 Shipment Management
                    </h1>
                    <p className="text-slate-400 font-mono">Order: {shipment.orderId}</p>
                </div>
                <span className={`px-4 py-2 rounded-lg font-medium ${shipment.status === 'DELIVERED'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {STATUS_LABELS[shipment.status]}
                </span>
            </div>

            {/* Progress Timeline */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Delivery Timeline</h3>
                <div className="flex items-center justify-between">
                    {STATUS_FLOW.map((step, idx) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${idx < currentStepIndex ? 'bg-green-500 text-white' :
                                    idx === currentStepIndex ? 'bg-blue-500 text-white' :
                                        'bg-slate-700 text-slate-400'
                                }`}>
                                {idx < currentStepIndex ? '✓' : STATUS_LABELS[step]?.split(' ')[0]}
                            </div>
                            {idx < STATUS_FLOW.length - 1 && (
                                <div className={`w-16 h-1 ${idx < currentStepIndex ? 'bg-green-500' : 'bg-slate-700'}`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    {STATUS_FLOW.map((step) => (
                        <span key={step} className="text-center w-10">{step.replace(/_/g, ' ')}</span>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Shipment Details */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium">Shipment Details</h3>
                        <button
                            className="text-blue-400 text-sm hover:underline"
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {editMode ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Carrier Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                    value={formData.carrierName}
                                    onChange={(e) => setFormData({ ...formData, carrierName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Tracking Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                                    value={formData.trackingNumber}
                                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Estimated Delivery</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                    value={formData.estimatedDelivery}
                                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Special Instructions</label>
                                <textarea
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                    rows={2}
                                    value={formData.specialInstructions}
                                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                                />
                            </div>
                            <button
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                onClick={saveDetails}
                                disabled={updating}
                            >
                                {updating ? 'Saving...' : 'Save Details'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Carrier</span>
                                <span className="text-white">{shipment.carrierName || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Tracking</span>
                                <span className="text-blue-400 font-mono">{shipment.trackingNumber || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">ETA</span>
                                <span className="text-white">
                                    {shipment.estimatedDelivery
                                        ? new Date(shipment.estimatedDelivery).toLocaleDateString()
                                        : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Type</span>
                                <span className="text-white">{shipment.type.replace(/_/g, ' ')}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-700">
                                <span className="text-slate-400">Delivery Address</span>
                                <p className="text-white mt-1">{shipment.deliveryAddress}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Update */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Update Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {STATUS_FLOW.map((status) => (
                            <button
                                key={status}
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${shipment.status === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                disabled={updating || shipment.status === status}
                                onClick={() => updateStatus(status)}
                            >
                                {STATUS_LABELS[status]}
                            </button>
                        ))}
                        <button
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-red-700/50 text-red-300 hover:bg-red-700/70"
                            disabled={updating}
                            onClick={() => updateStatus('FAILED')}
                        >
                            ❌ Mark Failed
                        </button>
                    </div>
                </div>

                {/* Proof of Delivery */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Proof of Delivery</h3>
                    {shipment.proofOfDelivery.length === 0 ? (
                        <p className="text-slate-500 text-sm mb-4">No POD uploaded yet</p>
                    ) : (
                        <div className="space-y-2 mb-4">
                            {shipment.proofOfDelivery.map((pod) => (
                                <div key={pod.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <span className="text-white text-sm">{pod.type}</span>
                                        <a href={pod.fileUrl} target="_blank" className="ml-2 text-blue-400 text-xs hover:underline">
                                            View →
                                        </a>
                                    </div>
                                    {pod.isValid ? (
                                        <span className="text-green-400 text-xs">✓ Verified</span>
                                    ) : (
                                        <span className="text-yellow-400 text-xs">⏳ Pending</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-slate-500 text-xs">POD upload available via supplier/carrier interface</p>
                </div>

                {/* Delivery Confirmation */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Delivery Confirmation</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Status</span>
                            {shipment.deliveryConfirmed ? (
                                <span className="text-green-400">✓ Confirmed</span>
                            ) : (
                                <span className="text-yellow-400">⏳ Pending Confirmation</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Buyer Confirmed</span>
                            <span className={shipment.confirmedByBuyer ? 'text-green-400' : 'text-slate-500'}>
                                {shipment.confirmedByBuyer ? '✓ Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Ops Verified</span>
                            <span className={shipment.confirmedByOps ? 'text-green-400' : 'text-slate-500'}>
                                {shipment.confirmedByOps ? '✓ Yes' : 'No'}
                            </span>
                        </div>
                    </div>

                    {shipment.status === 'DELIVERED' && !shipment.confirmedByOps && (
                        <button
                            className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            onClick={confirmDelivery}
                            disabled={updating || shipment.proofOfDelivery.length === 0}
                        >
                            ✓ Confirm Delivery (Ops)
                        </button>
                    )}

                    {shipment.proofOfDelivery.length === 0 && shipment.status === 'DELIVERED' && (
                        <p className="text-red-400 text-xs mt-2">
                            ⚠️ Cannot confirm without Proof of Delivery
                        </p>
                    )}

                    {shipment.deliveryConfirmed && (
                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ Payment NOT released yet. Finance must approve payout.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Event History */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mt-6">
                <h3 className="text-white font-medium mb-4">Event History</h3>
                {shipment.events.length === 0 ? (
                    <p className="text-slate-500 text-sm">No events recorded</p>
                ) : (
                    <div className="space-y-3">
                        {shipment.events.map((event) => (
                            <div key={event.id} className="flex items-start gap-4 p-3 bg-slate-900/50 rounded-lg">
                                <div className="text-xl">{STATUS_LABELS[event.status]?.split(' ')[0]}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="text-white font-medium">{STATUS_LABELS[event.status]}</span>
                                        <span className="text-slate-500 text-xs">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    {event.location && <p className="text-slate-400 text-sm">📍 {event.location}</p>}
                                    {event.note && <p className="text-slate-400 text-sm">💬 {event.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
