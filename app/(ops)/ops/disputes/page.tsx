// app/(ops)/ops/disputes/page.tsx - Dispute Review (OPS LIMITED Authority)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Dispute {
    id: string;
    orderId: string;
    type: string;
    status: string;
    description: string;
    buyerEmail?: string;
    supplierName?: string;
    createdAt: string;
    opsRecommendation?: string;
}

const STATUS_COLORS: Record<string, string> = {
    OPEN: 'text-red-400 bg-red-500/20',
    INVESTIGATING: 'text-blue-400 bg-blue-500/20',
    RESOLVED_BUYER_FAVOR: 'text-green-400 bg-green-500/20',
    RESOLVED_SUPPLIER_FAVOR: 'text-green-400 bg-green-500/20',
    RESOLVED_PARTIAL: 'text-yellow-400 bg-yellow-500/20',
    CLOSED: 'text-slate-400 bg-slate-500/20',
};

const TYPE_LABELS: Record<string, string> = {
    NON_DELIVERY: 'Non-Delivery',
    QUALITY_ISSUE: 'Quality Issue',
    WRONG_ITEM: 'Wrong Item',
    PRICING_DISPUTE: 'Pricing Dispute',
    SHIPPING_DAMAGE: 'Shipping Damage',
    OTHER: 'Other',
};

export default function OpsDisputesPage() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('OPEN');

    const fetchDisputes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/ops/disputes?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setDisputes(data.disputes || []);
            }
        } catch (err) {
            console.error('Error fetching disputes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, [statusFilter]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dispute Review</h1>
                    <p className="text-slate-400">Review disputes and make recommendations</p>
                </div>
            </div>

            {/* LIMITED AUTHORITY WARNING */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-medium">LIMITED AUTHORITY</span>
                </div>
                <p className="text-slate-400 text-sm">
                    Ops can <strong>review</strong> disputes and <strong>recommend</strong> actions, but
                    <strong className="text-orange-400"> CANNOT</strong> make final resolution decisions.
                    All resolutions (refunds, releases, penalties) require <strong>Admin/Finance approval</strong>.
                </p>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['OPEN', 'INVESTIGATING', 'ALL'].map((status) => (
                    <button
                        key={status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status || (status === 'ALL' && !statusFilter)
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        onClick={() => setStatusFilter(status === 'ALL' ? '' : status)}
                    >
                        {status === 'ALL' ? 'All' : status}
                    </button>
                ))}
            </div>

            {/* Disputes List */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading disputes...</div>
                ) : disputes.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No disputes found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Order</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Description</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Ops Recommendation</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {disputes.map((dispute) => (
                                <tr key={dispute.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-sm text-slate-300">{dispute.orderId.substring(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{TYPE_LABELS[dispute.type] || dispute.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[dispute.status] || 'bg-slate-500/20 text-slate-400'}`}>
                                            {dispute.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                                        {dispute.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        {dispute.opsRecommendation ? (
                                            <span className="text-yellow-400">{dispute.opsRecommendation}</span>
                                        ) : (
                                            <span className="text-slate-500">Not set</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/ops/disputes/${dispute.id}`}>
                                            <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30">
                                                Review
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* What Ops CAN and CAN'T do */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h3 className="text-green-400 font-medium mb-2">✓ Ops CAN:</h3>
                    <ul className="text-sm text-slate-400 space-y-1">
                        <li>• Review dispute details and evidence</li>
                        <li>• Communicate with buyer and supplier</li>
                        <li>• Mark dispute as "Investigating"</li>
                        <li>• Add internal notes</li>
                        <li>• Recommend: Release / Partial Release / Hold</li>
                        <li>• Escalate to Admin/Finance</li>
                    </ul>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h3 className="text-red-400 font-medium mb-2">✗ Ops CANNOT:</h3>
                    <ul className="text-sm text-slate-400 space-y-1">
                        <li>• Issue refunds</li>
                        <li>• Release escrow funds</li>
                        <li>• Apply supplier penalties</li>
                        <li>• Make final resolution</li>
                        <li>• Change order amounts</li>
                        <li>• Override Admin decisions</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
