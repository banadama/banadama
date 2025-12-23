// app/(admin)/admin/studio/wholesalers/[id]/page.tsx - Admin Wholesaler Detail
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface WholesalerDetail {
    id: string;
    businessName: string;
    businessType?: string;
    country: string;
    city?: string;
    marketName?: string;
    address?: string;
    yearEstablished?: number;
    categories: string[];
    buyNowEnabled: boolean;
    rfqEnabled: boolean;
    defaultDeliverySpeed: string;
    verificationStatus: string;
    hasBlueTick: boolean;
    hasGreenTick: boolean;
    enabledForInternational: boolean;
    maxOrderValue?: number;
    fulfillmentRate?: number;
    avgDeliveryDays?: number;
    totalOrdersCompleted: number;
    adminNotes?: string;
    productsCount: number;
    inStockCount: number;
    lowStockCount: number;
}

export default function AdminWholesalerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [wholesaler, setWholesaler] = useState<WholesalerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [notes, setNotes] = useState('');

    const fetchWholesaler = async () => {
        try {
            const res = await fetch(`/api/admin/wholesalers/${params.id}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setWholesaler(data);
                setNotes(data.adminNotes || '');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWholesaler();
    }, [params.id]);

    const handleAction = async (action: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/wholesalers/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action, adminNotes: notes }),
            });
            if (res.ok) {
                fetchWholesaler();
                alert(`Action successful!`);
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
            await fetch(`/api/admin/wholesalers/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action: 'update', [field]: value }),
            });
            fetchWholesaler();
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Loading...</div>;
    }

    if (!wholesaler) {
        return <div className="p-8 text-center text-red-400">Wholesaler not found</div>;
    }

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="text-slate-400 hover:text-white">
                    ← Back
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">🏪 {wholesaler.businessName}</h1>
                    <p className="text-slate-400">{wholesaler.businessType === 'STRONG_RETAILER' ? 'Strong Retailer' : 'Wholesaler'}</p>
                </div>
            </div>

            {/* Verification Status */}
            <div className={`rounded-xl p-6 mb-6 ${wholesaler.hasGreenTick
                    ? 'bg-green-500/10 border border-green-500/30'
                    : wholesaler.hasBlueTick
                        ? 'bg-blue-500/10 border border-blue-500/30'
                        : 'bg-yellow-500/10 border border-yellow-500/30'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {wholesaler.hasGreenTick ? (
                            <>
                                <span className="text-4xl">🟢</span>
                                <div>
                                    <div className="text-green-400 font-medium text-lg">Premium Verified</div>
                                    <div className="text-slate-400 text-sm">Green tick granted</div>
                                </div>
                            </>
                        ) : wholesaler.hasBlueTick ? (
                            <>
                                <span className="text-4xl">🔵</span>
                                <div>
                                    <div className="text-blue-400 font-medium text-lg">Verified Wholesaler</div>
                                    <div className="text-slate-400 text-sm">Blue tick granted</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-4xl">⏳</span>
                                <div>
                                    <div className="text-yellow-400 font-medium text-lg">{wholesaler.verificationStatus}</div>
                                    <div className="text-slate-400 text-sm">Verification pending</div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {!wholesaler.hasBlueTick && (
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700"
                                onClick={() => handleAction('grant_blue_tick')}
                                disabled={updating}
                            >
                                🔵 Grant Blue Tick
                            </button>
                        )}
                        {wholesaler.hasBlueTick && !wholesaler.hasGreenTick && (
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-green-700"
                                onClick={() => handleAction('grant_green_tick')}
                                disabled={updating}
                            >
                                🟢 Upgrade to Green
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Wholesaler Info */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">📋 Business Information</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Country</span>
                            <span className="text-white">{wholesaler.country === 'NG' ? '🇳🇬 Nigeria' : '🇧🇩 Bangladesh'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">City</span>
                            <span className="text-white">{wholesaler.city || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Market</span>
                            <span className="text-white">{wholesaler.marketName || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Year Established</span>
                            <span className="text-white">{wholesaler.yearEstablished || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Categories</span>
                            <span className="text-white">{wholesaler.categories.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Delivery Speed</span>
                            <span className="text-white">{wholesaler.defaultDeliverySpeed}</span>
                        </div>
                    </div>
                </div>

                {/* Performance */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">📊 Performance</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Total Orders</span>
                            <span className="text-white">{wholesaler.totalOrdersCompleted}</span>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Fulfillment Rate</span>
                                <span className="text-green-400">{wholesaler.fulfillmentRate ? `${(wholesaler.fulfillmentRate * 100).toFixed(0)}%` : '-'}</span>
                            </div>
                            {wholesaler.fulfillmentRate && (
                                <div className="bg-slate-900 rounded-full h-2 overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${wholesaler.fulfillmentRate * 100}%` }} />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Avg Delivery Days</span>
                            <span className="text-white">{wholesaler.avgDeliveryDays?.toFixed(1) || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Products Listed</span>
                            <span className="text-white">{wholesaler.productsCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">In Stock</span>
                            <span className="text-green-400">{wholesaler.inStockCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Low Stock</span>
                            <span className="text-orange-400">{wholesaler.lowStockCount}</span>
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
                                className={`w-14 h-7 rounded-full relative ${wholesaler.enabledForInternational ? 'bg-green-600' : 'bg-slate-600'
                                    }`}
                                onClick={() => toggleSetting('enabledForInternational', !wholesaler.enabledForInternational)}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${wholesaler.enabledForInternational ? 'right-1' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-white">RFQ Enabled</div>
                                <div className="text-slate-500 text-sm">Accept RFQ requests (optional)</div>
                            </div>
                            <button
                                className={`w-14 h-7 rounded-full relative ${wholesaler.rfqEnabled ? 'bg-green-600' : 'bg-slate-600'
                                    }`}
                                onClick={() => toggleSetting('rfqEnabled', !wholesaler.rfqEnabled)}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${wholesaler.rfqEnabled ? 'right-1' : 'left-1'
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
                            placeholder="Internal notes..."
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
                        {wholesaler.verificationStatus !== 'SUSPENDED' ? (
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                onClick={() => handleAction('suspend')}
                                disabled={updating}
                            >
                                Suspend Wholesaler
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                onClick={() => handleAction('activate')}
                                disabled={updating}
                            >
                                Reactivate
                            </button>
                        )}
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">📦 Categories</h3>
                    {wholesaler.categories.length === 0 ? (
                        <p className="text-slate-500">No categories defined</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {wholesaler.categories.map((cat, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
