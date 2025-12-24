// app/(factory)/factory/production/[orderId]/page.tsx - Production Management
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ProductionDetail {
    id: string;
    orderId: string;
    productName: string;
    quantity: number;
    status: string;
    expectedStartDate?: string;
    actualStartDate?: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    producedQuantity: number;
    defectQuantity: number;
    progressPhotos: string[];
    updates: Array<{ status: string; note: string; timestamp: string }>;
    qcPassed?: boolean;
    qcNotes?: string;
}

const STATUS_FLOW = ['NOT_STARTED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY_TO_SHIP', 'SHIPPED'];

const STATUS_INFO: Record<string, { icon: string; label: string; color: string }> = {
    NOT_STARTED: { icon: '⏳', label: 'Not Started', color: 'bg-slate-500' },
    IN_PRODUCTION: { icon: '🏭', label: 'In Production', color: 'bg-purple-500' },
    QUALITY_CHECK: { icon: '🔍', label: 'Quality Check', color: 'bg-yellow-500' },
    READY_TO_SHIP: { icon: '✅', label: 'Ready to Ship', color: 'bg-green-500' },
    SHIPPED: { icon: '🚚', label: 'Shipped', color: 'bg-blue-500' },
};

export default function ProductionManagementPage() {
    const params = useParams();
    const router = useRouter();
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [production, setProduction] = useState<ProductionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [updateNote, setUpdateNote] = useState('');
    const [producedQty, setProducedQty] = useState(0);

    const fetchProduction = async () => {
        try {
            const res = await fetch(`/api/factory/production/${params.orderId}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setProduction(data);
                setProducedQty(data.producedQuantity || 0);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduction();
    }, [params.orderId]);

    const getNextStatus = (): string | null => {
        if (!production) return null;
        const idx = STATUS_FLOW.indexOf(production.status);
        if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
        return STATUS_FLOW[idx + 1];
    };

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/factory/production/${params.orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    status: newStatus,
                    note: updateNote,
                    producedQuantity: producedQty,
                }),
            });
            if (res.ok) {
                setUpdateNote('');
                fetchProduction();
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

        // In production, upload to cloud storage
        const fakeUrl = URL.createObjectURL(file);

        try {
            const res = await fetch(`/api/factory/production/${params.orderId}/photo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ photoUrl: fakeUrl }),
            });
            if (res.ok) {
                fetchProduction();
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Loading...</div>;
    }

    if (!production) {
        return (
            <div className="p-8 text-center">
                <span className="text-4xl">❌</span>
                <p className="text-slate-400 mt-4">Production record not found</p>
            </div>
        );
    }

    const nextStatus = getNextStatus();
    const currentIdx = STATUS_FLOW.indexOf(production.status);

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="text-slate-400 hover:text-white"
                >
                    ← Back
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">🏭 Production Management</h1>
                    <p className="text-slate-400">{production.productName}</p>
                </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Production Status</h3>
                <div className="flex items-center justify-between">
                    {STATUS_FLOW.map((status, idx) => {
                        const info = STATUS_INFO[status];
                        const isComplete = idx <= currentIdx;
                        const isCurrent = status === production.status;
                        return (
                            <div key={status} className="flex-1 flex items-center">
                                <div className={`flex flex-col items-center ${isCurrent ? 'scale-110' : ''}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isComplete ? info.color : 'bg-slate-700'
                                        } ${isCurrent ? 'ring-4 ring-white/20' : ''}`}>
                                        {info.icon}
                                    </div>
                                    <span className={`text-xs mt-2 ${isCurrent ? 'text-white font-medium' : 'text-slate-500'}`}>
                                        {info.label}
                                    </span>
                                </div>
                                {idx < STATUS_FLOW.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 ${idx < currentIdx ? 'bg-green-500' : 'bg-slate-700'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Production Details */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">📊 Production Details</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Order Quantity</span>
                            <span className="text-white font-medium">{production.quantity.toLocaleString()} units</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Produced</span>
                            <span className="text-green-400 font-medium">{production.producedQuantity.toLocaleString()} units</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Defects</span>
                            <span className="text-red-400 font-medium">{production.defectQuantity} units</span>
                        </div>
                        {production.expectedEndDate && (
                            <div className="flex justify-between">
                                <span className="text-slate-400">Expected Completion</span>
                                <span className="text-white">{new Date(production.expectedEndDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-white">{Math.round((production.producedQuantity / production.quantity) * 100)}%</span>
                        </div>
                        <div className="bg-slate-900 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-green-500"
                                style={{ width: `${Math.min(100, (production.producedQuantity / production.quantity) * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Update Status */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">🔄 Update Status</h3>

                    {production.status === 'SHIPPED' ? (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                            <span className="text-green-400">✅ Production Complete & Shipped</span>
                        </div>
                    ) : (
                        <>
                            {/* Produced Quantity Input */}
                            {production.status === 'IN_PRODUCTION' && (
                                <div className="mb-4">
                                    <label className="block text-slate-400 text-sm mb-2">Units Produced</label>
                                    <input
                                        type="number"
                                        value={producedQty}
                                        onChange={(e) => setProducedQty(parseInt(e.target.value) || 0)}
                                        max={production.quantity}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                            )}

                            {/* Note */}
                            <div className="mb-4">
                                <label className="block text-slate-400 text-sm mb-2">Update Note (optional)</label>
                                <textarea
                                    value={updateNote}
                                    onChange={(e) => setUpdateNote(e.target.value)}
                                    placeholder="Add notes about this update..."
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white resize-none"
                                    rows={2}
                                />
                            </div>

                            {/* Action Button */}
                            {nextStatus && (
                                <button
                                    className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-purple-700"
                                    onClick={() => updateStatus(nextStatus)}
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : `→ Move to ${STATUS_INFO[nextStatus].label}`}
                                </button>
                            )}
                        </>
                    )}

                    {/* Photo Upload */}
                    <div className="mt-4">
                        <input
                            type="file"
                            ref={photoInputRef}
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handlePhotoUpload}
                        />
                        <button
                            className="w-full py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600"
                            onClick={() => photoInputRef.current?.click()}
                        >
                            📷 Upload Progress Photo
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Photos */}
            {production.progressPhotos.length > 0 && (
                <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">📸 Progress Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {production.progressPhotos.map((url, idx) => (
                            <img key={idx} src={url} alt={`Progress ${idx + 1}`} className="rounded-lg aspect-square object-cover" />
                        ))}
                    </div>
                </div>
            )}

            {/* Update History */}
            <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">📜 Update History</h3>
                {production.updates.length === 0 ? (
                    <p className="text-slate-500">No updates yet</p>
                ) : (
                    <div className="space-y-3">
                        {production.updates.map((u, i) => (
                            <div key={i} className="flex gap-3">
                                <div className={`w-3 h-3 rounded-full mt-1 ${i === 0 ? 'bg-green-500' : 'bg-slate-600'}`} />
                                <div>
                                    <div className="text-white text-sm">{u.status}</div>
                                    {u.note && <div className="text-slate-400 text-xs">{u.note}</div>}
                                    <div className="text-slate-500 text-xs">{new Date(u.timestamp).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
