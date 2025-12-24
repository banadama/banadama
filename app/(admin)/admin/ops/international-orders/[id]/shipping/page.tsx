// app/(ops)/ops/international-orders/[id]/shipping/page.tsx - Shipping Management
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Shipment {
    id?: string;
    method: string;
    carrier: string;
    trackingNumber: string;
    estimatedDeparture: string;
    estimatedArrival: string;
    originPort: string;
    destinationPort: string;
    deliveryAddress: string;
    shippingCost: number;
    specialInstructions: string;
    currentLocation: string;
}

const SHIPPING_METHODS = ['AIR', 'SEA', 'ROAD', 'COURIER'];

export default function ShippingManagementPage() {
    const params = useParams();
    const [shipment, setShipment] = useState<Shipment>({
        method: 'AIR',
        carrier: '',
        trackingNumber: '',
        estimatedDeparture: '',
        estimatedArrival: '',
        originPort: '',
        destinationPort: '',
        deliveryAddress: '',
        shippingCost: 0,
        specialInstructions: '',
        currentLocation: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchShipment = async () => {
            try {
                const res = await fetch(`/api/ops/international-orders/${params.id}/shipping`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.shipment) {
                        setShipment({
                            ...shipment,
                            ...data.shipment,
                            shippingCost: data.shipment.shippingCost || 0,
                        });
                    }
                    if (data.deliveryAddress) {
                        setShipment((s) => ({ ...s, deliveryAddress: data.deliveryAddress }));
                    }
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchShipment();
    }, [params.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/ops/international-orders/${params.id}/shipping`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(shipment),
            });
            if (res.ok) {
                alert('Shipping details saved!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setSaving(false);
        }
    };

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    if (loading) {
        return <div className="p-6 text-center text-slate-400">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link href={`/ops/international-orders/${params.id}`} className="text-blue-400 hover:underline text-sm">
                    ← Back to Order
                </Link>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">🚢 Shipping Management</h1>
                    <p className="text-slate-400">Arrange and track international shipping</p>
                </div>
                <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : '💾 Save'}
                </button>
            </div>

            {/* Note */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                    ⚠️ <strong>Phase 1 - Manual Mode:</strong> Enter shipping details manually.
                    No external courier API integration yet.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Shipping Method */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Shipping Method</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Method</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={shipment.method}
                                onChange={(e) => setShipment({ ...shipment, method: e.target.value })}
                            >
                                {SHIPPING_METHODS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Carrier</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                placeholder="e.g., DHL, Maersk"
                                value={shipment.carrier}
                                onChange={(e) => setShipment({ ...shipment, carrier: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Tracking Number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                                placeholder="Enter tracking number"
                                value={shipment.trackingNumber}
                                onChange={(e) => setShipment({ ...shipment, trackingNumber: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Timeline</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Estimated Departure</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={shipment.estimatedDeparture?.split('T')[0] || ''}
                                onChange={(e) => setShipment({ ...shipment, estimatedDeparture: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Estimated Arrival</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={shipment.estimatedArrival?.split('T')[0] || ''}
                                onChange={(e) => setShipment({ ...shipment, estimatedArrival: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Current Location</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                placeholder="e.g., Lagos Port, In Transit"
                                value={shipment.currentLocation}
                                onChange={(e) => setShipment({ ...shipment, currentLocation: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Ports */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Ports & Address</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Origin Port/Airport</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                placeholder="e.g., Lagos (LOS)"
                                value={shipment.originPort}
                                onChange={(e) => setShipment({ ...shipment, originPort: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Destination Port/Airport</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                placeholder="e.g., New York (JFK)"
                                value={shipment.destinationPort}
                                onChange={(e) => setShipment({ ...shipment, destinationPort: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Delivery Address</label>
                            <textarea
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                rows={3}
                                value={shipment.deliveryAddress}
                                onChange={(e) => setShipment({ ...shipment, deliveryAddress: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Costs & Notes */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Costs & Notes</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Shipping Cost (₦)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={shipment.shippingCost / 100}
                                onChange={(e) => setShipment({ ...shipment, shippingCost: parseFloat(e.target.value) * 100 })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Special Instructions</label>
                            <textarea
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                rows={3}
                                placeholder="Any special handling requirements..."
                                value={shipment.specialInstructions}
                                onChange={(e) => setShipment({ ...shipment, specialInstructions: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
