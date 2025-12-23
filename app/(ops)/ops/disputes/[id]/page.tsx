// app/(ops)/ops/disputes/[id]/page.tsx - Single Dispute Review (OPS LIMITED)
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Dispute {
    id: string;
    orderId: string;
    buyerId: string;
    supplierId: string;
    type: string;
    status: string;
    description: string;
    evidence?: Record<string, unknown>;
    opsRecommendation?: string;
    opsNotes?: string;
    internalNotes?: string;
    resolutionType?: string;
    resolvedAt?: string;
    createdAt: string;
}

const RECOMMENDATION_OPTIONS = [
    { value: 'RELEASE', label: 'Release Funds to Supplier', description: 'Supplier fulfilled correctly' },
    { value: 'PARTIAL_RELEASE', label: 'Partial Release', description: 'Partial fulfillment, split funds' },
    { value: 'HOLD', label: 'Hold / Investigate Further', description: 'Need more evidence' },
    { value: 'REFUND_BUYER', label: 'Refund Buyer', description: 'Supplier failed to deliver' },
    { value: 'ESCALATE', label: 'Escalate to Finance', description: 'Complex case, needs Finance decision' },
];

export default function OpsDisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [recommendation, setRecommendation] = useState('');
    const [opsNotes, setOpsNotes] = useState('');

    const fetchDispute = async () => {
        try {
            const res = await fetch(`/api/ops/disputes/${id}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setDispute(data.dispute);
                setRecommendation(data.dispute.opsRecommendation || '');
                setOpsNotes(data.dispute.opsNotes || '');
            }
        } catch (err) {
            console.error('Error fetching dispute:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispute();
    }, [id]);

    const handleSaveRecommendation = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/ops/disputes/${id}/recommend`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    recommendation,
                    opsNotes,
                }),
            });
            if (res.ok) {
                alert('Recommendation saved. Admin/Finance will review.');
                fetchDispute();
            }
        } catch (err) {
            console.error('Error saving recommendation:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleMarkInvestigating = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/ops/disputes/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: 'INVESTIGATING' }),
            });
            if (res.ok) {
                fetchDispute();
            }
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-slate-400">Loading dispute...</div>
        );
    }

    if (!dispute) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl text-red-400 mb-4">Dispute not found</h2>
                <Link href="/ops/disputes">
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg">Back to Disputes</button>
                </Link>
            </div>
        );
    }

    const isResolved = ['RESOLVED_BUYER_FAVOR', 'RESOLVED_SUPPLIER_FAVOR', 'RESOLVED_PARTIAL', 'CLOSED'].includes(dispute.status);

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/ops/disputes">
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg">← Back</button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Dispute Review</h1>
                    <p className="text-slate-400">Order: {dispute.orderId}</p>
                </div>
            </div>

            {/* LIMITED AUTHORITY WARNING */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-orange-400">
                    <span className="text-xl">⚠️</span>
                    <span className="font-medium">You can REVIEW and RECOMMEND only. Final decisions require Admin approval.</span>
                </div>
            </div>

            {/* Dispute Details */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Dispute Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-slate-400 text-sm">Type</label>
                        <div className="text-white">{dispute.type}</div>
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm">Status</label>
                        <div className="text-white">{dispute.status}</div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-slate-400 text-sm">Description</label>
                        <div className="text-white">{dispute.description}</div>
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm">Created</label>
                        <div className="text-white">{new Date(dispute.createdAt).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Ops Actions (only if not resolved) */}
            {!isResolved && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Ops Actions</h2>

                    {/* Mark as Investigating */}
                    {dispute.status === 'OPEN' && (
                        <button
                            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={handleMarkInvestigating}
                            disabled={saving}
                        >
                            🔍 Mark as Investigating
                        </button>
                    )}

                    {/* Recommendation */}
                    <div className="mb-4">
                        <label className="block text-slate-400 text-sm mb-2">Your Recommendation</label>
                        <div className="space-y-2">
                            {RECOMMENDATION_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${recommendation === opt.value
                                            ? 'border-blue-500 bg-blue-500/20'
                                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="recommendation"
                                        value={opt.value}
                                        checked={recommendation === opt.value}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="text-white font-medium">{opt.label}</div>
                                        <div className="text-slate-400 text-sm">{opt.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Ops Notes */}
                    <div className="mb-4">
                        <label className="block text-slate-400 text-sm mb-2">Ops Notes (visible to Admin)</label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            rows={4}
                            value={opsNotes}
                            onChange={(e) => setOpsNotes(e.target.value)}
                            placeholder="Explain your recommendation, evidence reviewed, etc."
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        onClick={handleSaveRecommendation}
                        disabled={saving || !recommendation}
                    >
                        {saving ? 'Saving...' : '💾 Save Recommendation'}
                    </button>

                    <p className="mt-2 text-sm text-slate-500">
                        Your recommendation will be sent to Admin/Finance for final decision.
                    </p>
                </div>
            )}

            {/* Resolution (if resolved) */}
            {isResolved && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-green-400 mb-4">✓ Dispute Resolved</h2>
                    <p className="text-slate-400">
                        This dispute was resolved by Admin/Finance on {dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleString() : 'N/A'}.
                    </p>
                    <p className="text-white mt-2">Resolution: {dispute.resolutionType || dispute.status}</p>
                </div>
            )}
        </div>
    );
}
