// app/(admin)/admin/settings/page.tsx - Site Settings Page
'use client';

import { useState, useEffect } from 'react';

interface SiteSetting {
    id: string;
    key: string;
    value: unknown;
    category?: string;
    description?: string;
    updatedAt: string;
    updatedByAdmin?: {
        id: string;
        email: string;
    };
}

// Default settings to show
const DEFAULT_SETTINGS = [
    { key: 'PLATFORM_FEE_PERCENT', category: 'fees', description: 'Platform fee as percentage', defaultValue: 5 },
    { key: 'SERVICE_FEE_BASIC', category: 'fees', description: 'Service fee for basic tier (kobo)', defaultValue: 50000 },
    { key: 'SERVICE_FEE_PREMIUM', category: 'fees', description: 'Service fee for premium tier (kobo)', defaultValue: 100000 },
    { key: 'ESCROW_HOLD_DAYS', category: 'rules', description: 'Days to hold funds in escrow after delivery', defaultValue: 3 },
    { key: 'MIN_ORDER_VALUE', category: 'rules', description: 'Minimum order value (kobo)', defaultValue: 500000 },
    { key: 'ALLOWED_COUNTRIES', category: 'countries', description: 'Allowed country codes (JSON array)', defaultValue: '["NG", "BD"]' },
    { key: 'DEFAULT_CURRENCY', category: 'platform', description: 'Default currency code', defaultValue: 'NGN' },
    { key: 'SUPPORT_EMAIL', category: 'platform', description: 'Support email address', defaultValue: 'support@banadama.com' },
    { key: 'AFFILIATE_COMMISSION_RATE', category: 'affiliate', description: 'Default affiliate commission rate', defaultValue: 0.05 },
    { key: 'MAX_RFQ_QUANTITY', category: 'rules', description: 'Maximum RFQ quantity allowed', defaultValue: 100000 },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [editedValues, setEditedValues] = useState<Record<string, string>>({});

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/site-settings', { credentials: 'include' });
            const data = await res.json();
            setSettings(data.settings || []);

            // Initialize edited values
            const values: Record<string, string> = {};
            data.settings?.forEach((s: SiteSetting) => {
                values[s.key] = typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value);
            });
            setEditedValues(values);
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const saveSetting = async (key: string) => {
        const rawValue = editedValues[key];
        if (rawValue === undefined) return;

        setSaving(key);
        try {
            // Try to parse as JSON, otherwise use as string
            let value: unknown;
            try {
                value = JSON.parse(rawValue);
            } catch {
                value = rawValue;
            }

            const defaultSetting = DEFAULT_SETTINGS.find((s) => s.key === key);

            const res = await fetch('/api/admin/site-settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    key,
                    value,
                    description: defaultSetting?.description,
                    category: defaultSetting?.category,
                }),
            });

            if (res.ok) {
                fetchSettings();
            }
        } catch (err) {
            console.error('Error saving setting:', err);
        } finally {
            setSaving(null);
        }
    };

    // Group settings by category
    const groupedSettings: Record<string, typeof DEFAULT_SETTINGS> = {};
    DEFAULT_SETTINGS.forEach((setting) => {
        const cat = setting.category || 'other';
        if (!groupedSettings[cat]) groupedSettings[cat] = [];
        groupedSettings[cat].push(setting);
    });

    const getSettingValue = (key: string, defaultValue: unknown) => {
        const setting = settings.find((s) => s.key === key);
        if (setting) {
            return typeof setting.value === 'object' ? JSON.stringify(setting.value) : String(setting.value);
        }
        return typeof defaultValue === 'object' ? JSON.stringify(defaultValue) : String(defaultValue);
    };

    const categoryLabels: Record<string, string> = {
        fees: 'Platform Fees',
        rules: 'Business Rules',
        countries: 'Countries & Regions',
        platform: 'Platform Settings',
        affiliate: 'Affiliate Settings',
        other: 'Other',
    };

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Site Settings</h1>
            </div>

            {loading ? (
                <div className="studio-card" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Loading settings...
                </div>
            ) : (
                Object.entries(groupedSettings).map(([category, categorySettings]) => (
                    <div key={category} className="studio-card">
                        <h3>{categoryLabels[category] || category}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {categorySettings.map((setting) => {
                                const currentValue = editedValues[setting.key] ?? getSettingValue(setting.key, setting.defaultValue);
                                const isSaving = saving === setting.key;
                                const dbSetting = settings.find((s) => s.key === setting.key);

                                return (
                                    <div
                                        key={setting.key}
                                        style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            borderRadius: '0.5rem',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500, color: 'white', fontSize: '0.9rem' }}>
                                                {setting.description}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace' }}>
                                                {setting.key}
                                            </div>
                                            {dbSetting?.updatedByAdmin && (
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                    Last updated by {dbSetting.updatedByAdmin.email}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                className="studio-input"
                                                value={currentValue}
                                                onChange={(e) =>
                                                    setEditedValues({ ...editedValues, [setting.key]: e.target.value })
                                                }
                                                onBlur={() => saveSetting(setting.key)}
                                                onKeyDown={(e) => e.key === 'Enter' && saveSetting(setting.key)}
                                                style={{ width: '200px' }}
                                                disabled={isSaving}
                                            />
                                            {isSaving && (
                                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Saving...</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}

            {/* Add Custom Setting */}
            <div className="studio-card">
                <h3>Add Custom Setting</h3>
                <CustomSettingForm onCreated={fetchSettings} />
            </div>
        </div>
    );
}

function CustomSettingForm({ onCreated }: { onCreated: () => void }) {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('other');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let parsedValue: unknown;
            try {
                parsedValue = JSON.parse(value);
            } catch {
                parsedValue = value;
            }

            const res = await fetch('/api/admin/site-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ key, value: parsedValue, description, category }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create setting');
            }

            setKey('');
            setValue('');
            setDescription('');
            onCreated();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    Key
                </label>
                <input
                    type="text"
                    className="studio-input"
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                    placeholder="CUSTOM_KEY"
                    required
                />
            </div>
            <div style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    Value
                </label>
                <input
                    type="text"
                    className="studio-input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Value or JSON"
                    required
                />
            </div>
            <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    Description
                </label>
                <input
                    type="text"
                    className="studio-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this setting for?"
                />
            </div>
            <div style={{ flex: '0 0 120px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    Category
                </label>
                <select
                    className="studio-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="fees">Fees</option>
                    <option value="rules">Rules</option>
                    <option value="countries">Countries</option>
                    <option value="platform">Platform</option>
                    <option value="affiliate">Affiliate</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <button type="submit" className="studio-btn studio-btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Setting'}
                </button>
            </div>
            {error && (
                <div style={{ width: '100%', color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>
            )}
        </form>
    );
}
