// app/(admin)/admin/studio/accounts/[id]/controls/page.tsx - Account Freeze & Limit Controls Page
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface AccountControls {
    id: string;
    name: string;
    isFrozen: boolean;
    frozenAt?: string;
    frozenByAdminId?: string;
    freezeReason?: string;
    canCreateOrders: boolean;
    canRespondToRfq: boolean;
    canWithdraw: boolean;
    canListProducts: boolean;
    limitNotes?: string;
    limitExpiresAt?: string;
    isActive: boolean;
}

export default function AccountControlsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [controls, setControls] = useState<AccountControls | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [freezeReason, setFreezeReason] = useState('');
    const [limitNotes, setLimitNotes] = useState('');

    // Granular limits
    const [canCreateOrders, setCanCreateOrders] = useState(true);
    const [canRespondToRfq, setCanRespondToRfq] = useState(true);
    const [canWithdraw, setCanWithdraw] = useState(true);
    const [canListProducts, setCanListProducts] = useState(true);

    const fetchControls = async () => {
        try {
            const res = await fetch(`/api/admin/accounts/${id}/controls`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setControls(data.controls);

            // Initialize form state
            setCanCreateOrders(data.controls.canCreateOrders);
            setCanRespondToRfq(data.controls.canRespondToRfq);
            setCanWithdraw(data.controls.canWithdraw);
            setCanListProducts(data.controls.canListProducts);
            setLimitNotes(data.controls.limitNotes || '');
        } catch (err) {
            console.error('Error fetching controls:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchControls();
    }, [id]);

    const handleAction = async (action: string) => {
        setSaving(true);
        try {
            const body: Record<string, unknown> = { action };

            if (action === 'freeze') {
                body.freezeReason = freezeReason || 'Frozen by admin';
            } else if (action === 'limit') {
                body.canCreateOrders = canCreateOrders;
                body.canRespondToRfq = canRespondToRfq;
                body.canWithdraw = canWithdraw;
                body.canListProducts = canListProducts;
                body.limitNotes = limitNotes;
            }

            const res = await fetch(`/api/admin/accounts/${id}/controls`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchControls();
                setFreezeReason('');
                alert(`Account ${action} successful`);
            }
        } catch (err) {
            console.error('Error updating controls:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                Loading account controls...
            </div>
        );
    }

    if (!controls) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2 style={{ color: '#ef4444' }}>Account not found</h2>
                <Link href="/admin/studio/accounts">
                    <button className="studio-btn studio-btn-secondary">Back to Accounts</button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="studio-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href={`/admin/studio/accounts/${id}`}>
                        <button className="studio-btn studio-btn-secondary">← Back</button>
                    </Link>
                    <h1 className="studio-title">Account Controls</h1>
                </div>
            </div>

            {/* Account Info */}
            <div className="studio-card">
                <h3>{controls.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <span style={{ color: '#94a3b8', marginRight: '0.5rem' }}>Status:</span>
                        {controls.isFrozen ? (
                            <span className="studio-badge studio-badge-red">❄️ FROZEN</span>
                        ) : controls.isActive ? (
                            <span className="studio-badge studio-badge-green">✓ Active</span>
                        ) : (
                            <span className="studio-badge studio-badge-gray">Inactive</span>
                        )}
                    </div>
                </div>
                {controls.isFrozen && controls.freezeReason && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>
                        <strong style={{ color: '#f87171' }}>Freeze Reason:</strong>
                        <div style={{ color: 'white', marginTop: '0.25rem' }}>{controls.freezeReason}</div>
                    </div>
                )}
            </div>

            {/* Freeze Controls */}
            <div className="studio-card">
                <h3>❄️ Account Freeze</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                    Freezing an account disables ALL actions. Use this for disputes, suspicious behavior, or compliance issues.
                </p>

                {!controls.isFrozen ? (
                    <div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Freeze Reason
                            </label>
                            <input
                                type="text"
                                className="studio-input"
                                value={freezeReason}
                                onChange={(e) => setFreezeReason(e.target.value)}
                                placeholder="Why is this account being frozen?"
                            />
                        </div>
                        <button
                            className="studio-btn studio-btn-danger"
                            onClick={() => handleAction('freeze')}
                            disabled={saving}
                        >
                            {saving ? 'Freezing...' : '❄️ Freeze Account'}
                        </button>
                    </div>
                ) : (
                    <button
                        className="studio-btn studio-btn-primary"
                        onClick={() => handleAction('unfreeze')}
                        disabled={saving}
                    >
                        {saving ? 'Unfreezing...' : '✓ Unfreeze Account'}
                    </button>
                )}
            </div>

            {/* Granular Limits */}
            {!controls.isFrozen && (
                <div className="studio-card">
                    <h3>🔒 Granular Limits</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                        Apply specific restrictions without fully freezing the account.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                background: canCreateOrders ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={canCreateOrders}
                                onChange={(e) => setCanCreateOrders(e.target.checked)}
                            />
                            <div>
                                <div style={{ color: 'white', fontWeight: 500 }}>Can Create Orders</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Allow placing new orders</div>
                            </div>
                        </label>

                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                background: canRespondToRfq ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={canRespondToRfq}
                                onChange={(e) => setCanRespondToRfq(e.target.checked)}
                            />
                            <div>
                                <div style={{ color: 'white', fontWeight: 500 }}>Can Respond to RFQ</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Allow responding to quotes</div>
                            </div>
                        </label>

                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                background: canWithdraw ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={canWithdraw}
                                onChange={(e) => setCanWithdraw(e.target.checked)}
                            />
                            <div>
                                <div style={{ color: 'white', fontWeight: 500 }}>Can Withdraw</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Allow wallet withdrawals</div>
                            </div>
                        </label>

                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                background: canListProducts ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={canListProducts}
                                onChange={(e) => setCanListProducts(e.target.checked)}
                            />
                            <div>
                                <div style={{ color: 'white', fontWeight: 500 }}>Can List Products</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Allow adding new products</div>
                            </div>
                        </label>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Limit Notes
                        </label>
                        <input
                            type="text"
                            className="studio-input"
                            value={limitNotes}
                            onChange={(e) => setLimitNotes(e.target.value)}
                            placeholder="Internal notes about these limits"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="studio-btn studio-btn-primary"
                            onClick={() => handleAction('limit')}
                            disabled={saving}
                        >
                            {saving ? 'Applying...' : 'Apply Limits'}
                        </button>
                        <button
                            className="studio-btn studio-btn-secondary"
                            onClick={() => handleAction('unlimit')}
                            disabled={saving}
                        >
                            Remove All Limits
                        </button>
                    </div>
                </div>
            )}

            {/* Current Limits Summary */}
            {controls.limitNotes && (
                <div className="studio-card" style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
                    <h3>📋 Active Limit Notes</h3>
                    <div style={{ color: 'white' }}>{controls.limitNotes}</div>
                </div>
            )}
        </div>
    );
}
