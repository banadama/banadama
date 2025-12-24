// app/(ops)/ops/rfqs/page.tsx - RFQ Queue (OPS Execution)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Request {
    id: string;
    productName: string;
    quantity: number;
    status: string;
    buyerEmail: string;
    createdAt: string;
    assignedSupplier?: {
        businessName: string;
    };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending', color: 'text-yellow-400 bg-yellow-500/20' },
    QUOTED: { label: 'Quoted', color: 'text-blue-400 bg-blue-500/20' },
    ACCEPTED: { label: 'Accepted', color: 'text-green-400 bg-green-500/20' },
    REJECTED: { label: 'Rejected', color: 'text-red-400 bg-red-500/20' },
    CANCELLED: { label: 'Cancelled', color: 'text-slate-400 bg-slate-500/20' },
};

export default function RfqQueuePage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/ops/rfqs?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests || []);
            }
        } catch (err) {
            console.error('Error fetching RFQs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">RFQ Queue</h1>
                    <p className="text-slate-400">View and process buyer requests</p>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['PENDING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'ALL'].map((status) => (
                    <button
                        key={status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status || (status === 'ALL' && !statusFilter)
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        onClick={() => setStatusFilter(status === 'ALL' ? '' : status)}
                    >
                        {status === 'ALL' ? 'All' : STATUS_LABELS[status]?.label || status}
                    </button>
                ))}
            </div>

            {/* RFQ List */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading RFQs...</div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No RFQs found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Product</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Quantity</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Buyer</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Supplier</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{req.productName}</div>
                                        <div className="text-sm text-slate-500">{req.id.substring(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{req.quantity.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-300">{req.buyerEmail}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[req.status]?.color || 'bg-slate-500/20 text-slate-400'}`}>
                                            {STATUS_LABELS[req.status]?.label || req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {req.assignedSupplier?.businessName || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/ops/rfqs/${req.id}`}>
                                            <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                                                Process
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Ops Authority Note */}
            <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-500">
                    <strong>Ops Authority:</strong> You can view RFQs, assign suppliers, and generate quotes.
                    Pricing rules and fee structures are set by Admin.
                </p>
            </div>
        </div>
    );
}
