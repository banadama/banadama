// app/(admin)/admin/studio/pricing/page.tsx - Pricing & Commission Rules Page
'use client';

import { useState, useEffect } from 'react';

interface PricingRule {
    id: string;
    scope: string;
    scopeValue?: string;
    ruleType: string;
    feeType: string;
    feeValue: number;
    minOrderValue?: number;
    maxOrderValue?: number;
    isActive: boolean;
    priority: number;
    description?: string;
    createdAt: string;
}

const SCOPES = [
    { value: 'global', label: 'Global (All Orders)' },
    { value: 'category', label: 'Category-Based' },
    { value: 'country', label: 'Country-Based' },
    { value: 'account', label: 'Account-Specific' },
];

const RULE_TYPES = [
    { value: 'platform_fee', label: 'Platform Fee' },
    { value: 'buyer_fee', label: 'Buyer Fee' },
    { value: 'supplier_fee', label: 'Supplier Fee' },
    { value: 'commission', label: 'Commission' },
];

export default function PricingPage() {
    const [rules, setRules] = useState<PricingRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/pricing', { credentials: 'include' });
            const data = await res.json();
            setRules(data.rules || []);
        } catch (err) {
            console.error('Error fetching rules:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const toggleRule = async (id: string, isActive: boolean) => {
        try {
            await fetch('/api/admin/pricing', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id, isActive }),
            });
            fetchRules();
        } catch (err) {
            console.error('Error toggling rule:', err);
        }
    };

    const deleteRule = async (id: string) => {
        if (!confirm('Delete this pricing rule?')) return;
        try {
            await fetch(`/api/admin/pricing?id=${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            fetchRules();
        } catch (err) {
            console.error('Error deleting rule:', err);
        }
    };

    // Group rules by scope
    const groupedRules: Record<string, PricingRule[]> = {};
    rules.forEach((rule) => {
        const key = rule.scope;
        if (!groupedRules[key]) groupedRules[key] = [];
        groupedRules[key].push(rule);
    });

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Pricing & Commission Rules</h1>
                <button className="studio-btn studio-btn-primary" onClick={() => setShowCreate(true)}>
                    + Add Rule
                </button>
            </div>

            {/* Help Text */}
            <div className="studio-card" style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    <strong>How it works:</strong> Rules are applied in order of priority (highest first).
                    More specific rules (category/country/account) override global rules when both apply.
                </div>
            </div>

            {loading ? (
                <div className="studio-card" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Loading rules...
                </div>
            ) : rules.length === 0 ? (
                <div className="studio-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No pricing rules defined. Add your first rule.
                </div>
            ) : (
                <>
                    {Object.entries(groupedRules).map(([scope, scopeRules]) => (
                        <div key={scope} className="studio-card">
                            <h3 style={{ marginBottom: '1rem' }}>
                                {SCOPES.find((s) => s.value === scope)?.label || scope}
                            </h3>
                            <table className="studio-table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Scope Value</th>
                                        <th>Fee</th>
                                        <th>Order Range</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scopeRules.map((rule) => (
                                        <tr key={rule.id}>
                                            <td>
                                                <span className="studio-badge studio-badge-blue">
                                                    {RULE_TYPES.find((t) => t.value === rule.ruleType)?.label || rule.ruleType}
                                                </span>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: '#64748b' }}>
                                                {rule.scopeValue || '-'}
                                            </td>
                                            <td>
                                                {rule.feeType === 'percentage'
                                                    ? `${rule.feeValue}%`
                                                    : `₦${(rule.feeValue / 100).toLocaleString()}`}
                                            </td>
                                            <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                {rule.minOrderValue || rule.maxOrderValue
                                                    ? `₦${(rule.minOrderValue || 0) / 100} - ₦${(rule.maxOrderValue || Infinity) / 100}`
                                                    : 'Any'}
                                            </td>
                                            <td>{rule.priority}</td>
                                            <td>
                                                {rule.isActive ? (
                                                    <span className="studio-badge studio-badge-green">Active</span>
                                                ) : (
                                                    <span className="studio-badge studio-badge-gray">Inactive</span>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="studio-btn studio-btn-secondary"
                                                        onClick={() => toggleRule(rule.id, !rule.isActive)}
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        {rule.isActive ? 'Disable' : 'Enable'}
                                                    </button>
                                                    <button
                                                        className="studio-btn studio-btn-secondary"
                                                        onClick={() => setEditingRule(rule)}
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="studio-btn studio-btn-danger"
                                                        onClick={() => deleteRule(rule.id)}
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </>
            )}

            {/* Create/Edit Modal */}
            {(showCreate || editingRule) && (
                <PricingRuleModal
                    rule={editingRule}
                    onClose={() => {
                        setShowCreate(false);
                        setEditingRule(null);
                    }}
                    onSaved={() => {
                        setShowCreate(false);
                        setEditingRule(null);
                        fetchRules();
                    }}
                />
            )}
        </div>
    );
}

function PricingRuleModal({
    rule,
    onClose,
    onSaved,
}: {
    rule: PricingRule | null;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [scope, setScope] = useState(rule?.scope || 'global');
    const [scopeValue, setScopeValue] = useState(rule?.scopeValue || '');
    const [ruleType, setRuleType] = useState(rule?.ruleType || 'platform_fee');
    const [feeType, setFeeType] = useState(rule?.feeType || 'percentage');
    const [feeValue, setFeeValue] = useState(String(rule?.feeValue || 5));
    const [priority, setPriority] = useState(String(rule?.priority || 0));
    const [description, setDescription] = useState(rule?.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...(rule && { id: rule.id }),
                scope,
                scopeValue: scopeValue || null,
                ruleType,
                feeType,
                feeValue: parseFloat(feeValue),
                priority: parseInt(priority),
                description,
            };

            const res = await fetch('/api/admin/pricing', {
                method: rule ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save rule');
            }

            onSaved();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                className="studio-card"
                style={{ maxWidth: '500px', width: '90%' }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>{rule ? 'Edit Pricing Rule' : 'Create Pricing Rule'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Scope *
                            </label>
                            <select className="studio-select" value={scope} onChange={(e) => setScope(e.target.value)}>
                                {SCOPES.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Scope Value
                            </label>
                            <input
                                type="text"
                                className="studio-input"
                                value={scopeValue}
                                onChange={(e) => setScopeValue(e.target.value)}
                                placeholder={scope === 'category' ? 'fashion-fabrics' : scope === 'country' ? 'NG' : ''}
                                disabled={scope === 'global'}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Rule Type *
                            </label>
                            <select className="studio-select" value={ruleType} onChange={(e) => setRuleType(e.target.value)}>
                                {RULE_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Fee Type *
                            </label>
                            <select className="studio-select" value={feeType} onChange={(e) => setFeeType(e.target.value)}>
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed (Kobo)</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Fee Value *
                            </label>
                            <input
                                type="number"
                                className="studio-input"
                                value={feeValue}
                                onChange={(e) => setFeeValue(e.target.value)}
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Priority
                            </label>
                            <input
                                type="number"
                                className="studio-input"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Description
                        </label>
                        <input
                            type="text"
                            className="studio-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                        />
                    </div>
                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="studio-btn studio-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="studio-btn studio-btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : rule ? 'Update Rule' : 'Create Rule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
