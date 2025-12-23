// app/(admin)/admin/studio/countries/page.tsx - Country Management
'use client';

import { useState, useEffect } from 'react';

interface TradeCountry {
    id: string;
    code: string;
    name: string;
    region?: string;
    status: string;
    allowBuyNow: boolean;
    allowRfq: boolean;
    requireDocsReview: boolean;
    requireBlueTick: boolean;
    highValueThreshold?: number;
    shippingMethods: string[];
    createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
    ENABLED: 'bg-green-500/20 text-green-400',
    DISABLED: 'bg-red-500/20 text-red-400',
    PENDING: 'bg-yellow-500/20 text-yellow-400',
};

const REGIONS = ['AFRICA', 'EUROPE', 'ASIA', 'AMERICAS', 'MIDDLE_EAST', 'OCEANIA'];

export default function CountriesPage() {
    const [countries, setCountries] = useState<TradeCountry[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newCountry, setNewCountry] = useState({ code: '', name: '', region: 'EUROPE' });

    const fetchCountries = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/admin/trade/countries?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setCountries(data.countries || []);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, [statusFilter]);

    const handleStatusChange = async (countryId: string, newStatus: string) => {
        const reason = newStatus === 'DISABLED' ? prompt('Reason for disabling:') : undefined;

        try {
            const res = await fetch(`/api/admin/trade/countries/${countryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus, reason }),
            });
            if (res.ok) {
                fetchCountries();
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleAddCountry = async () => {
        if (!newCountry.code || !newCountry.name) {
            alert('Code and Name required');
            return;
        }

        try {
            const res = await fetch('/api/admin/trade/countries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newCountry),
            });
            if (res.ok) {
                setShowAdd(false);
                setNewCountry({ code: '', name: '', region: 'EUROPE' });
                fetchCountries();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to add country');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">🗺️ Country Management</h1>
                    <p className="text-slate-400">Enable countries for international buying</p>
                </div>
                <button
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    onClick={() => setShowAdd(!showAdd)}
                >
                    ➕ Add Country
                </button>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                    ⚠️ <strong>BUY-ONLY mode:</strong> Enabled countries can BUY from NG/BD suppliers.
                    They CANNOT sell on the platform.
                </p>
            </div>

            {/* Add Country Form */}
            {showAdd && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-medium mb-4">Add New Country</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Country Code (ISO)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white uppercase"
                                placeholder="US"
                                maxLength={2}
                                value={newCountry.code}
                                onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Country Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                placeholder="United States"
                                value={newCountry.name}
                                onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Region</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                value={newCountry.region}
                                onChange={(e) => setNewCountry({ ...newCountry, region: e.target.value })}
                            >
                                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                onClick={handleAddCountry}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">
                        New countries are added as DISABLED. Enable manually after review.
                    </p>
                </div>
            )}

            {/* Status Filters */}
            <div className="flex gap-2 mb-6">
                {['', 'ENABLED', 'DISABLED', 'PENDING'].map((s) => (
                    <button
                        key={s}
                        className={`px-4 py-2 rounded-lg text-sm ${statusFilter === s ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setStatusFilter(s)}
                    >
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {/* Countries Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading countries...</div>
                ) : countries.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No countries configured</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Country</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Region</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Buy Now</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">RFQ</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Docs Review</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {countries.map((country) => (
                                <tr key={country.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{country.name}</div>
                                        <div className="text-sm text-slate-500">{country.code}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-300">{country.region || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[country.status]}`}>
                                            {country.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {country.allowBuyNow ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {country.allowRfq ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {country.requireDocsReview ? <span className="text-yellow-400">Required</span> : <span className="text-slate-500">No</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex gap-1 justify-center">
                                            {country.status !== 'ENABLED' && (
                                                <button
                                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                                                    onClick={() => handleStatusChange(country.id, 'ENABLED')}
                                                >
                                                    Enable
                                                </button>
                                            )}
                                            {country.status !== 'DISABLED' && (
                                                <button
                                                    className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                                                    onClick={() => handleStatusChange(country.id, 'DISABLED')}
                                                >
                                                    Disable
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
