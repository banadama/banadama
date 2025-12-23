// app/(factory)/factory/capabilities/page.tsx - Factory Capabilities
'use client';

import { useState, useEffect } from 'react';

interface Capability {
    id: string;
    categorySlug: string;
    categoryName: string;
    minOrderQuantity: number;
    maxOrderQuantity?: number;
    leadTimeDays: number;
    pricePerUnitMin?: number;
    pricePerUnitMax?: number;
    notes?: string;
    isActive: boolean;
}

export default function FactoryCapabilitiesPage() {
    const [capabilities, setCapabilities] = useState<Capability[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        categorySlug: '',
        categoryName: '',
        minOrderQuantity: 100,
        maxOrderQuantity: '',
        leadTimeDays: 14,
        pricePerUnitMin: '',
        pricePerUnitMax: '',
        notes: '',
    });

    const fetchCapabilities = async () => {
        try {
            const res = await fetch('/api/factory/capabilities', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setCapabilities(data.capabilities || []);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCapabilities();
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch('/api/factory/capabilities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    maxOrderQuantity: formData.maxOrderQuantity ? parseInt(formData.maxOrderQuantity) : null,
                    pricePerUnitMin: formData.pricePerUnitMin ? parseInt(formData.pricePerUnitMin) * 100 : null,
                    pricePerUnitMax: formData.pricePerUnitMax ? parseInt(formData.pricePerUnitMax) * 100 : null,
                }),
            });
            if (res.ok) {
                setShowAddForm(false);
                setFormData({
                    categorySlug: '',
                    categoryName: '',
                    minOrderQuantity: 100,
                    maxOrderQuantity: '',
                    leadTimeDays: 14,
                    pricePerUnitMin: '',
                    pricePerUnitMax: '',
                    notes: '',
                });
                fetchCapabilities();
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const toggleActive = async (id: string, isActive: boolean) => {
        try {
            await fetch(`/api/factory/capabilities/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isActive: !isActive }),
            });
            fetchCapabilities();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const formatMoney = (kobo?: number) => kobo ? `₦${(kobo / 100).toLocaleString()}` : '-';

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">⚙️ Production Capabilities</h1>
                    <p className="text-slate-400">Define what your factory can produce</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setShowAddForm(true)}
                >
                    + Add Capability
                </button>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-400 text-sm">
                    💡 Capabilities help Ops assign the right RFQs to your factory based on category and MOQ.
                </p>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-medium mb-4">Add New Capability</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Category Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., T-Shirts"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={formData.categoryName}
                                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value, categorySlug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Category Slug</label>
                            <input
                                type="text"
                                placeholder="e.g., t-shirts"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={formData.categorySlug}
                                onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Minimum Order Qty *</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={formData.minOrderQuantity}
                                onChange={(e) => setFormData({ ...formData, minOrderQuantity: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Maximum Order Qty</label>
                            <input
                                type="number"
                                placeholder="Optional"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={formData.maxOrderQuantity}
                                onChange={(e) => setFormData({ ...formData, maxOrderQuantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Lead Time (days) *</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={formData.leadTimeDays}
                                onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Price Range (₦/unit)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                    value={formData.pricePerUnitMin}
                                    onChange={(e) => setFormData({ ...formData, pricePerUnitMin: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                    value={formData.pricePerUnitMax}
                                    onChange={(e) => setFormData({ ...formData, pricePerUnitMax: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-sm mb-1">Notes</label>
                            <textarea
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white resize-none"
                                rows={2}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            onClick={handleSave}
                        >
                            Save Capability
                        </button>
                        <button
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                            onClick={() => setShowAddForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Capabilities List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : capabilities.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">⚙️</span>
                    <p className="text-slate-400 mt-4">No capabilities defined yet</p>
                    <p className="text-slate-500 text-sm mt-2">Add your production capabilities to receive relevant RFQs</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {capabilities.map((cap) => (
                        <div
                            key={cap.id}
                            className={`bg-slate-800 border rounded-xl p-6 ${cap.isActive ? 'border-slate-700' : 'border-orange-500/30 opacity-75'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-white font-medium">{cap.categoryName}</h3>
                                    <span className="text-slate-500 text-sm">{cap.categorySlug}</span>
                                </div>
                                <button
                                    className={`px-3 py-1 rounded text-xs ${cap.isActive
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-orange-500/20 text-orange-400'
                                        }`}
                                    onClick={() => toggleActive(cap.id, cap.isActive)}
                                >
                                    {cap.isActive ? 'Active' : 'Paused'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500">MOQ</span>
                                    <div className="text-white">{cap.minOrderQuantity.toLocaleString()} units</div>
                                </div>
                                <div>
                                    <span className="text-slate-500">Lead Time</span>
                                    <div className="text-white">{cap.leadTimeDays} days</div>
                                </div>
                                <div>
                                    <span className="text-slate-500">Max Qty</span>
                                    <div className="text-white">{cap.maxOrderQuantity?.toLocaleString() || 'No limit'}</div>
                                </div>
                                <div>
                                    <span className="text-slate-500">Price Range</span>
                                    <div className="text-green-400">
                                        {formatMoney(cap.pricePerUnitMin)} - {formatMoney(cap.pricePerUnitMax)}
                                    </div>
                                </div>
                            </div>

                            {cap.notes && (
                                <p className="mt-3 text-slate-400 text-sm">{cap.notes}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
