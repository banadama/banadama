// app/(admin)/admin/studio/factories/[id]/page.tsx - Admin Factory Detail
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface FactoryDetail {
    id: string;
    factoryName: string;
    factoryType?: string;
    country: string;
    city?: string;
    address?: string;
    yearEstablished?: number;
    monthlyCapacityUnits?: number;
    minOrderQuantity?: number;
    standardLeadTimeDays?: number;
    certifications: string[];
    verificationStatus: string;
    hasGreenTick: boolean;
    enabledForInternational: boolean;
    enabledForBuyNow: boolean;
    adminNotes?: string;
    complianceDocs: Array<{
        id: string;
        docType: string;
        docName: string;
        isVerified: boolean;
        expiryDate?: string;
    }>;
    capabilities: Array<{
        categoryName: string;
        minOrderQuantity: number;
        leadTimeDays: number;
    }>;
}

export default function AdminFactoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [factory, setFactory] = useState<FactoryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [notes, setNotes] = useState('');

    const fetchFactory = async () => {
        try {
            const res = await fetch(`/api/admin/factories/${params.id}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setFactory(data);
                setNotes(data.adminNotes || '');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFactory();
    }, [params.id]);

    const handleAction = async (action: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/factories/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action, adminNotes: notes }),
            });
            if (res.ok) {
                fetchFactory();
                alert(`Factory ${action} successful!`);
            } else {
                const data = await res.json();
                alert(data.error || 'Action failed');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUpdating(false);
        }
    };

    const toggleSetting = async (field: string, value: boolean) => {
        setUpdating(true);
        try {
            await fetch(`/api/admin/factories/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action: 'update', [field]: value }),
            });
            fetchFactory();
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Loading...</div>;
    }

    if (!factory) {
        return <div className="p-8 text-center text-red-400">Factory not found</div>;
    }

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="text-slate-400 hover:text-white">
                    ← Back
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">🏭 {factory.factoryName}</h1>
                    <p className="text-slate-400">{factory.factoryType || 'Manufacturing Factory'}</p>
                </div>
            </div>

            {/* Verification Status */}
            <div className={`rounded-xl p-6 mb-6 ${factory.hasGreenTick
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-yellow-500/10 border border-yellow-500/30'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {factory.hasGreenTick ? (
                            <>
                                <span className="text-4xl">🟢</span>
                                <div>
                                    <div className="text-green-400 font-medium text-lg">Verified Factory</div>
                                    <div className="text-slate-400 text-sm">Green tick granted</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-4xl">⏳</span>
                                <div>
                                    <div className="text-yellow-400 font-medium text-lg">{factory.verificationStatus}</div>
                                    <div className="text-slate-400 text-sm">Verification pending</div>
                                </div>
                            </>
                        )}
                    </div>
                    {!factory.hasGreenTick && factory.verificationStatus !== 'REJECTED' && (
                        <button
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-green-700"
                            onClick={() => handleAction('grant_green_tick')}
                            disabled={updating}
                        >
                            🟢 Grant Green Tick
                        </button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Factory Info */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">📋 Factory Information</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Country</span>
                            <span className="text-white">{factory.country === 'BD' ? '🇧🇩 Bangladesh' : '🇳🇬 Nigeria'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">City</span>
                            <span className="text-white">{factory.city || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Address</span>
                            <span className="text-white">{factory.address || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Year Established</span>
                            <span className="text-white">{factory.yearEstablished || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Monthly Capacity</span>
                            <span className="text-white">{factory.monthlyCapacityUnits?.toLocaleString() || '-'} units</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Default MOQ</span>
                            <span className="text-white">{factory.minOrderQuantity?.toLocaleString() || '-'} units</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Default Lead Time</span>
                            <span className="text-white">{factory.standardLeadTimeDays || '-'} days</span>
                        </div>
                    </div>
                </div>

                {/* Admin Controls */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">🔧 Admin Controls</h3>

                    {/* Toggles */}
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-white">International Trade</div>
                                <div className="text-slate-500 text-sm">Allow cross-border fulfillment</div>
                            </div>
                            <button
                                className={`w-14 h-7 rounded-full relative ${factory.enabledForInternational ? 'bg-green-600' : 'bg-slate-600'
                                    }`}
                                onClick={() => toggleSetting('enabledForInternational', !factory.enabledForInternational)}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${factory.enabledForInternational ? 'right-1' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-white">Buy Now (Samples)</div>
                                <div className="text-slate-500 text-sm">Enable sample purchases</div>
                            </div>
                            <button
                                className={`w-14 h-7 rounded-full relative ${factory.enabledForBuyNow ? 'bg-green-600' : 'bg-slate-600'
                                    }`}
                                onClick={() => toggleSetting('enabledForBuyNow', !factory.enabledForBuyNow)}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${factory.enabledForBuyNow ? 'right-1' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="mb-4">
                        <label className="block text-slate-400 text-sm mb-2">Admin Notes</label>
                        <textarea
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white resize-none"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Internal notes about this factory..."
                        />
                        <button
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                            onClick={() => handleAction('update')}
                            disabled={updating}
                        >
                            Save Notes
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-6 pt-4 border-t border-slate-700">
                        {factory.verificationStatus !== 'SUSPENDED' ? (
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                onClick={() => handleAction('suspend')}
                                disabled={updating}
                            >
                                Suspend Factory
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                onClick={() => handleAction('activate')}
                                disabled={updating}
                            >
                                Reactivate Factory
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Compliance Documents */}
            <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">📄 Compliance Documents</h3>
                {factory.complianceDocs.length === 0 ? (
                    <p className="text-slate-500">No documents uploaded</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {factory.complianceDocs.map((doc) => (
                            <div key={doc.id} className="bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span>📄</span>
                                    <span className="text-white">{doc.docName}</span>
                                </div>
                                <div className="text-slate-500 text-sm mb-2">{doc.docType}</div>
                                <div className="flex items-center justify-between">
                                    {doc.isVerified ? (
                                        <span className="text-green-400 text-xs">✓ Verified</span>
                                    ) : (
                                        <span className="text-yellow-400 text-xs">⏳ Pending</span>
                                    )}
                                    {doc.expiryDate && (
                                        <span className="text-slate-500 text-xs">
                                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Capabilities */}
            <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">⚙️ Production Capabilities</h3>
                {factory.capabilities.length === 0 ? (
                    <p className="text-slate-500">No capabilities defined</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                        {factory.capabilities.map((cap, i) => (
                            <div key={i} className="bg-slate-900 rounded-lg p-4">
                                <div className="text-white font-medium mb-2">{cap.categoryName}</div>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">MOQ</span>
                                        <span className="text-white">{cap.minOrderQuantity.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Lead Time</span>
                                        <span className="text-white">{cap.leadTimeDays} days</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
