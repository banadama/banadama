// app/(admin)/admin/studio/disputes/[id]/page.tsx - Single Dispute Resolution Page
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Dispute {
    id: string;
    orderId: string;
    buyerId: string;
    supplierId: string;
    type: string;
    status: string;
    description: string;
    evidence?: Record<string, unknown>;
    resolutionType?: string;
    resolutionNotes?: string;
    resolvedAt?: string;
    resolvedByAdminId?: string;
    refundAmount?: number;
    supplierPenalty?: number;
    buyerCredit?: number;
    internalNotes?: string;
    createdAt: string;
}

const RESOLUTION_TYPES = [
    { value: 'FULL_REFUND', label: 'Full Refund to Buyer' },
    { value: 'PARTIAL_REFUND', label: 'Partial Refund' },
    { value: 'REPLACEMENT', label: 'Replacement Order' },
    { value: 'CREDIT', label: 'Store Credit' },
    { value: 'NO_ACTION', label: 'No Action (Supplier Favor)' },
    { value: 'OTHER', label: 'Other' },
];

export default function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Resolution form state
    const [resolutionType, setResolutionType] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [refundAmount, setRefundAmount] = useState('');
    const [supplierPenalty, setSupplierPenalty] = useState('');
    const [buyerCredit, setBuyerCredit] = useState('');
    const [internalNotes, setInternalNotes] = useState('');

    const fetchDispute = async () => {
        try {
            const res = await fetch(`/api/admin/disputes/${id}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Dispute not found');
            const data = await res.json();
            setDispute(data.dispute);
            setInternalNotes(data.dispute.internalNotes || '');
        } catch (err) {
            console.error('Error fetching dispute:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispute();
    }, [id]);

    const handleAction = async (action: string) => {
        if (action === 'resolve' && !resolutionType) {
            alert('Please select a resolution type');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/disputes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    action,
                    resolutionType,
                    resolutionNotes,
                    refundAmount: refundAmount ? parseInt(refundAmount) * 100 : null, // Convert to kobo
                    supplierPenalty: supplierPenalty ? parseInt(supplierPenalty) * 100 : null,
                    buyerCredit: buyerCredit ? parseInt(buyerCredit) * 100 : null,
                    internalNotes,
                }),
            });

            if (res.ok) {
                fetchDispute();
                if (action === 'resolve' || action === 'close') {
                    alert('Dispute resolved successfully');
                }
            }
        } catch (err) {
            console.error('Error updating dispute:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                Loading dispute...
            </div>
        );
    }

    if (!dispute) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2 style={{ color: '#ef4444' }}>Dispute not found</h2>
                <Link href="/admin/studio/disputes">
                    <button className="studio-btn studio-btn-secondary">Back to Disputes</button>
                </Link>
            </div>
        );
    }

    const isResolved = ['RESOLVED_BUYER_FAVOR', 'RESOLVED_SUPPLIER_FAVOR', 'RESOLVED_PARTIAL', 'CLOSED'].includes(dispute.status);

    return (
        <div>
            <div className="studio-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/studio/disputes">
                        <button className="studio-btn studio-btn-secondary">← Back</button>
                    </Link>
                    <h1 className="studio-title">Dispute Resolution</h1>
                </div>
            </div>

            {/* Dispute Details */}
            <div className="studio-card">
                <h3>Dispute Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Order ID</label>
                        <div style={{ color: 'white', fontFamily: 'monospace' }}>{dispute.orderId}</div>
                    </div>
                    <div>
                        <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Type</label>
                        <div><span className="studio-badge studio-badge-gray">{dispute.type}</span></div>
                    </div>
                    <div>
                        <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Status</label>
                        <div>
                            <span className={`studio-badge ${isResolved ? 'studio-badge-green' : 'studio-badge-red'}`}>
                                {dispute.status}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Created</label>
                        <div style={{ color: 'white' }}>{new Date(dispute.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Description</label>
                    <div style={{ color: 'white', marginTop: '0.25rem' }}>{dispute.description}</div>
                </div>
            </div>

            {/* Resolution Form (only if not resolved) */}
            {!isResolved && (
                <div className="studio-card">
                    <h3>Resolve Dispute</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <button
                            className="studio-btn studio-btn-secondary"
                            onClick={() => handleAction('investigate')}
                            disabled={saving || dispute.status === 'INVESTIGATING'}
                            style={{ marginRight: '0.5rem' }}
                        >
                            🔍 Mark as Investigating
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Resolution Type *
                            </label>
                            <select
                                className="studio-select"
                                value={resolutionType}
                                onChange={(e) => setResolutionType(e.target.value)}
                            >
                                <option value="">Select resolution...</option>
                                {RESOLUTION_TYPES.map((rt) => (
                                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Refund Amount (₦)
                            </label>
                            <input
                                type="number"
                                className="studio-input"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Supplier Penalty (₦)
                            </label>
                            <input
                                type="number"
                                className="studio-input"
                                value={supplierPenalty}
                                onChange={(e) => setSupplierPenalty(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                Buyer Credit (₦)
                            </label>
                            <input
                                type="number"
                                className="studio-input"
                                value={buyerCredit}
                                onChange={(e) => setBuyerCredit(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Resolution Notes (visible to parties)
                        </label>
                        <textarea
                            className="studio-input"
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            rows={3}
                            placeholder="Explain the resolution..."
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Internal Notes (admin only)
                        </label>
                        <textarea
                            className="studio-input"
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            rows={2}
                            placeholder="Private notes..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="studio-btn studio-btn-primary"
                            onClick={() => handleAction('resolve')}
                            disabled={saving || !resolutionType}
                        >
                            {saving ? 'Resolving...' : '✓ Resolve Dispute'}
                        </button>
                        <button
                            className="studio-btn studio-btn-secondary"
                            onClick={() => handleAction('close')}
                            disabled={saving}
                        >
                            Close Without Resolution
                        </button>
                    </div>
                </div>
            )}

            {/* Resolution Summary (if resolved) */}
            {isResolved && (
                <div className="studio-card">
                    <h3>Resolution Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Resolution Type</label>
                            <div style={{ color: 'white' }}>{dispute.resolutionType || '-'}</div>
                        </div>
                        <div>
                            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Resolved At</label>
                            <div style={{ color: 'white' }}>
                                {dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleString() : '-'}
                            </div>
                        </div>
                        {dispute.refundAmount && (
                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Refund Amount</label>
                                <div style={{ color: '#4ade80' }}>₦{(dispute.refundAmount / 100).toLocaleString()}</div>
                            </div>
                        )}
                        {dispute.supplierPenalty && (
                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Supplier Penalty</label>
                                <div style={{ color: '#f87171' }}>₦{(dispute.supplierPenalty / 100).toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                    {dispute.resolutionNotes && (
                        <div style={{ marginTop: '1rem' }}>
                            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Resolution Notes</label>
                            <div style={{ color: 'white', marginTop: '0.25rem' }}>{dispute.resolutionNotes}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
