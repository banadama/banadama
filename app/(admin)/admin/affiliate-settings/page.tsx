// app/(admin)/admin/studio/affiliate-settings/page.tsx - Affiliate Program Settings
'use client';

import { useState, useEffect } from 'react';

interface AffiliateSettings {
    defaultCommissionRate: number;
    categoryRates: Record<string, number>;
    minimumPayout: number;
    blockSelfReferral: boolean;
    cookieDuration: number;
    isEnabled: boolean;
    requireApproval: boolean;
}

export default function AffiliateSettingsPage() {
    const [settings, setSettings] = useState<AffiliateSettings>({
        defaultCommissionRate: 0.05,
        categoryRates: {},
        minimumPayout: 500000,
        blockSelfReferral: true,
        cookieDuration: 30,
        isEnabled: true,
        requireApproval: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newCategory, setNewCategory] = useState({ slug: '', rate: 5 });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/affiliate-settings', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        ...settings,
                        ...data,
                        categoryRates: data.categoryRates || {},
                    });
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/affiliate-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                alert('Settings saved successfully');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save settings');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setSaving(false);
        }
    };

    const addCategoryRate = () => {
        if (!newCategory.slug) return;
        setSettings({
            ...settings,
            categoryRates: {
                ...settings.categoryRates,
                [newCategory.slug]: newCategory.rate / 100,
            },
        });
        setNewCategory({ slug: '', rate: 5 });
    };

    const removeCategoryRate = (slug: string) => {
        const { [slug]: _, ...rest } = settings.categoryRates;
        setSettings({ ...settings, categoryRates: rest });
    };

    if (loading) {
        return <div className="p-6 text-center text-slate-400">Loading settings...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Affiliate Program Settings</h1>
                    <p className="text-slate-400">Configure commissions and program rules</p>
                </div>
                <button
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : '💾 Save Settings'}
                </button>
            </div>

            {/* Program Status */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Program Status</h3>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-emerald-500"
                            checked={settings.isEnabled}
                            onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
                        />
                        <span className="text-white">Affiliate Program Enabled</span>
                    </label>
                </div>
                <div className="mt-4 flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-emerald-500"
                            checked={settings.requireApproval}
                            onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                        />
                        <span className="text-white">Require Admin Approval</span>
                    </label>
                </div>
            </div>

            {/* Commission Rates */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Commission Rates</h3>

                {/* Default Rate */}
                <div className="mb-6">
                    <label className="block text-slate-400 text-sm mb-2">Default Commission Rate (%)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="50"
                            className="w-32 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            value={settings.defaultCommissionRate * 100}
                            onChange={(e) => setSettings({ ...settings, defaultCommissionRate: parseFloat(e.target.value) / 100 })}
                        />
                        <span className="text-slate-400">% of order value</span>
                    </div>
                </div>

                {/* Category-specific Rates */}
                <div>
                    <label className="block text-slate-400 text-sm mb-2">Category-Specific Rates</label>

                    {Object.entries(settings.categoryRates).length > 0 && (
                        <div className="mb-4 space-y-2">
                            {Object.entries(settings.categoryRates).map(([slug, rate]) => (
                                <div key={slug} className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg">
                                    <span className="text-white flex-1">{slug}</span>
                                    <span className="text-purple-400">{((rate as number) * 100).toFixed(1)}%</span>
                                    <button
                                        className="text-red-400 hover:text-red-300"
                                        onClick={() => removeCategoryRate(slug)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            placeholder="Category slug (e.g., fashion-fabrics)"
                            value={newCategory.slug}
                            onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                        />
                        <input
                            type="number"
                            step="0.1"
                            className="w-20 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            value={newCategory.rate}
                            onChange={(e) => setNewCategory({ ...newCategory, rate: parseFloat(e.target.value) })}
                        />
                        <span className="text-slate-400 self-center">%</span>
                        <button
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            onClick={addCategoryRate}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Payout Settings */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Payout Settings</h3>

                <div className="mb-6">
                    <label className="block text-slate-400 text-sm mb-2">Minimum Payout (₦)</label>
                    <input
                        type="number"
                        className="w-48 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        value={settings.minimumPayout / 100}
                        onChange={(e) => setSettings({ ...settings, minimumPayout: parseFloat(e.target.value) * 100 })}
                    />
                </div>
            </div>

            {/* Security */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Security</h3>

                <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-emerald-500"
                            checked={settings.blockSelfReferral}
                            onChange={(e) => setSettings({ ...settings, blockSelfReferral: e.target.checked })}
                        />
                        <span className="text-white">Block Self-Referrals</span>
                    </label>
                    <p className="text-slate-500 text-sm mt-1 ml-8">Prevent affiliates from earning on their own purchases</p>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm mb-2">Cookie Duration (days)</label>
                    <input
                        type="number"
                        min="1"
                        max="365"
                        className="w-32 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        value={settings.cookieDuration}
                        onChange={(e) => setSettings({ ...settings, cookieDuration: parseInt(e.target.value) })}
                    />
                    <p className="text-slate-500 text-sm mt-1">How long affiliate attribution is tracked</p>
                </div>
            </div>

            {/* Warning */}
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 text-sm">
                    💡 <strong>Note:</strong> Commission is only awarded after delivery confirmation.
                    Finance team approval is required for all payouts.
                </p>
            </div>
        </div>
    );
}
