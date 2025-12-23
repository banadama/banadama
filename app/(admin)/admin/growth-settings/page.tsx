// app/(admin)/admin/studio/growth-settings/page.tsx - Growth Mode Settings
'use client';

import { useState, useEffect } from 'react';

interface GrowthSettings {
    growthModeEnabled: boolean;
    supplierOnboardCommission: number;
    firstOrderCommission: number;
    orderCommissionRate: number;
    ordersRequiredToUnlock: number;
    minimumPayout: number;
    blockSelfOnboard: boolean;
}

export default function GrowthSettingsPage() {
    const [settings, setSettings] = useState<GrowthSettings>({
        growthModeEnabled: true,
        supplierOnboardCommission: 50000,
        firstOrderCommission: 100000,
        orderCommissionRate: 0.005,
        ordersRequiredToUnlock: 1,
        minimumPayout: 500000,
        blockSelfOnboard: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/growth/settings', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setSettings({ ...settings, ...data });
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/growth/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                alert('Settings saved');
            } else {
                alert('Failed to save');
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
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">🌱 Growth Mode Settings</h1>
                    <p className="text-slate-400">Configure field agent commissions and rules</p>
                </div>
                <button
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : '💾 Save Settings'}
                </button>
            </div>

            {/* Enable/Disable */}
            <div className={`rounded-xl p-6 mb-6 ${settings.growthModeEnabled
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-slate-800 border border-slate-700'
                }`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-white font-medium">Growth Mode</h3>
                        <p className="text-slate-400 text-sm">Enable field agent onboarding system</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-6 h-6 accent-green-500"
                            checked={settings.growthModeEnabled}
                            onChange={(e) => setSettings({ ...settings, growthModeEnabled: e.target.checked })}
                        />
                        <span className={`ml-3 font-medium ${settings.growthModeEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                            {settings.growthModeEnabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </label>
                </div>
            </div>

            {/* Commission Settings */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">💰 Commission Rates</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">
                            Supplier Onboard Bonus (₦)
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            value={settings.supplierOnboardCommission / 100}
                            onChange={(e) => setSettings({
                                ...settings,
                                supplierOnboardCommission: parseFloat(e.target.value) * 100
                            })}
                        />
                        <p className="text-slate-500 text-xs mt-1">Paid when supplier completes required orders</p>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">
                            First Order Bonus (₦)
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            value={settings.firstOrderCommission / 100}
                            onChange={(e) => setSettings({
                                ...settings,
                                firstOrderCommission: parseFloat(e.target.value) * 100
                            })}
                        />
                        <p className="text-slate-500 text-xs mt-1">Bonus when supplier gets first completed order</p>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">
                            Order Commission Rate (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            value={settings.orderCommissionRate * 100}
                            onChange={(e) => setSettings({
                                ...settings,
                                orderCommissionRate: parseFloat(e.target.value) / 100
                            })}
                        />
                        <p className="text-slate-500 text-xs mt-1">Percentage of each completed order value</p>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">
                            Orders Required to Unlock
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            value={settings.ordersRequiredToUnlock}
                            onChange={(e) => setSettings({
                                ...settings,
                                ordersRequiredToUnlock: parseInt(e.target.value)
                            })}
                        />
                        <p className="text-slate-500 text-xs mt-1">Completed orders needed to unlock onboard commission</p>
                    </div>
                </div>
            </div>

            {/* Payout Settings */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">💸 Payout Settings</h3>
                <div>
                    <label className="block text-slate-400 text-sm mb-2">
                        Minimum Payout (₦)
                    </label>
                    <input
                        type="number"
                        className="w-48 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        value={settings.minimumPayout / 100}
                        onChange={(e) => setSettings({
                            ...settings,
                            minimumPayout: parseFloat(e.target.value) * 100
                        })}
                    />
                </div>
            </div>

            {/* Security */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">🔒 Security</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-5 h-5 accent-red-500"
                        checked={settings.blockSelfOnboard}
                        onChange={(e) => setSettings({ ...settings, blockSelfOnboard: e.target.checked })}
                    />
                    <span className="text-white">Block Self-Onboarding</span>
                </label>
                <p className="text-slate-500 text-sm mt-1 ml-8">
                    Agents cannot onboard themselves as suppliers (fraud prevention)
                </p>
            </div>

            {/* Info */}
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-400 font-medium mb-2">📋 Commission Flow</h4>
                <ol className="text-slate-400 text-sm space-y-1 list-decimal list-inside">
                    <li>Agent onboards supplier</li>
                    <li>Earning created as PENDING</li>
                    <li>Supplier completes {settings.ordersRequiredToUnlock} order(s)</li>
                    <li>Earning status → UNLOCKED</li>
                    <li>Agent requests withdrawal</li>
                    <li>Finance approves payout</li>
                </ol>
            </div>
        </div>
    );
}
