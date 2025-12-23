// app/(mobile)/mobile/ops/logistics/[orderId]/page.tsx - Shipment Detail (Mobile)
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface ShipmentDetail {
    id: string;
    orderId: string;
    status: string;
    carrierName?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    deliveryAddress: string;
    productName: string;
    quantity: number;
    hasPod: boolean;
    events: Array<{ status: string; timestamp: string; note?: string }>;
}

const STATUS_FLOW = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function ShipmentDetailMobile() {
    const params = useParams();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchShipment = async () => {
        try {
            const res = await fetch(`/api/ops/logistics/${params.orderId}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setShipment(data.shipment);
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
        setUpdating(true);
        try {
            const res = await fetch(`/api/ops/logistics/${params.orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchShipment();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        // In production, upload to S3/Cloudinary
        // For now, simulate upload
        const fakeUrl = URL.createObjectURL(file);

        try {
            const res = await fetch(`/api/ops/logistics/${params.orderId}/pod`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type: 'PHOTO',
                    fileUrl: fakeUrl,
                    fileName: file.name,
                }),
            });
            if (res.ok) {
                alert('Proof of Delivery uploaded!');
                fetchShipment();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to upload');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUploading(false);
        }
    };

    const getNextStatus = () => {
        if (!shipment) return null;
        const idx = STATUS_FLOW.indexOf(shipment.status);
        if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
        return STATUS_FLOW[idx + 1];
    };

    if (loading) {
        return (
            <div>
                <MobileHeader title="Shipment" showBack backHref="/mobile/ops/logistics" />
                <div className="p-4 text-center text-slate-400">Loading...</div>
            </div>
        );
    }

    if (!shipment) {
        return (
            <div>
                <MobileHeader title="Shipment" showBack backHref="/mobile/ops/logistics" />
                <div className="p-4 text-center text-slate-500">Shipment not found</div>
            </div>
        );
    }

    const nextStatus = getNextStatus();

    return (
        <div>
            <MobileHeader title="Shipment Details" showBack backHref="/mobile/ops/logistics" />

            <div className="p-4 space-y-4">
                {/* Current Status */}
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <div className="text-4xl mb-2">
                        {shipment.status === 'DELIVERED' ? '✅' : '🚚'}
                    </div>
                    <div className="text-xl font-bold text-white">{shipment.status.replace(/_/g, ' ')}</div>
                </div>

                {/* Details */}
                <div className="bg-slate-800 rounded-xl p-4 space-y-3">
                    <div>
                        <div className="text-slate-400 text-xs">Product</div>
                        <div className="text-white">{shipment.productName} × {shipment.quantity}</div>
                    </div>
                    {shipment.carrierName && (
                        <div>
                            <div className="text-slate-400 text-xs">Carrier</div>
                            <div className="text-white">{shipment.carrierName}</div>
                        </div>
                    )}
                    {shipment.trackingNumber && (
                        <div>
                            <div className="text-slate-400 text-xs">Tracking #</div>
                            <div className="text-blue-400 font-mono">{shipment.trackingNumber}</div>
                        </div>
                    )}
                    <div>
                        <div className="text-slate-400 text-xs">Delivery Address</div>
                        <div className="text-white">{shipment.deliveryAddress}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {/* Update Status */}
                    {nextStatus && (
                        <button
                            className="w-full py-4 bg-orange-600 text-white rounded-xl font-medium text-lg disabled:opacity-50 active:bg-orange-700"
                            onClick={() => updateStatus(nextStatus)}
                            disabled={updating}
                        >
                            {updating ? 'Updating...' : `→ Mark as ${nextStatus.replace(/_/g, ' ')}`}
                        </button>
                    )}

                    {/* Upload POD */}
                    {shipment.status === 'DELIVERED' || shipment.status === 'OUT_FOR_DELIVERY' ? (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                            <button
                                className="w-full py-4 bg-green-600 text-white rounded-xl font-medium text-lg disabled:opacity-50 active:bg-green-700"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : '📷 Upload Proof of Delivery'}
                            </button>
                        </>
                    ) : null}

                    {shipment.hasPod && (
                        <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-xl text-center">
                            <span className="text-green-400">✓ POD Uploaded</span>
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div className="bg-slate-800 rounded-xl p-4">
                    <div className="text-white font-medium mb-3">Timeline</div>
                    {shipment.events.length === 0 ? (
                        <div className="text-slate-500 text-sm">No events yet</div>
                    ) : (
                        <div className="space-y-3">
                            {shipment.events.map((e, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className={`w-3 h-3 rounded-full mt-1 ${i === 0 ? 'bg-green-500' : 'bg-slate-600'}`} />
                                    <div>
                                        <div className="text-white text-sm">{e.status}</div>
                                        {e.note && <div className="text-slate-400 text-xs">{e.note}</div>}
                                        <div className="text-slate-500 text-xs">{new Date(e.timestamp).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
