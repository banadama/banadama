// app/(ops)/ops/verifications/page.tsx - Verification Review (OPS - Review Only, NOT Assignment)
'use client';

import { useState, useEffect } from 'react';

interface VerificationRequest {
    id: string;
    type: string;
    status: string;
    userId: string;
    userEmail: string;
    documentUrls?: string[];
    data?: Record<string, unknown>;
    opsRecommendation?: string;
    opsNotes?: string;
    createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
    BUSINESS: 'Business Verification',
    IDENTITY: 'Identity Verification',
    SUPPLIER: 'Supplier Verification',
    CREATOR: 'Creator Verification',
};

export default function OpsVerificationsPage() {
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/ops/verifications?${params}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests || []);
            }
        } catch (err) {
            console.error('Error fetching verifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const submitRecommendation = async (requestId: string, recommendation: string, notes: string) => {
        try {
            const res = await fetch(`/api/ops/verifications/${requestId}/recommend`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ recommendation, notes }),
            });
            if (res.ok) {
                alert('Recommendation submitted to Admin');
                fetchRequests();
            }
        } catch (err) {
            console.error('Error submitting recommendation:', err);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Verification Review</h1>
                    <p className="text-slate-400">Review documents and recommend verification level</p>
                </div>
            </div>

            {/* LIMITED AUTHORITY WARNING */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-medium">REVIEW ONLY - NOT ASSIGNMENT</span>
                </div>
                <p className="text-slate-400 text-sm">
                    Ops reviews submitted documents and <strong>recommends</strong> verification level.
                    <strong className="text-orange-400"> Admin assigns</strong> the actual Blue/Green tick.
                </p>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['PENDING', 'REVIEWED', 'ALL'].map((status) => (
                    <button
                        key={status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status || (status === 'ALL' && !statusFilter)
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        onClick={() => setStatusFilter(status === 'ALL' ? '' : status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Verification Requests */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading verifications...</div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-800/50 rounded-xl">
                        No verification requests found
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-white font-medium">{req.userEmail}</div>
                                    <div className="text-sm text-slate-400">{TYPE_LABELS[req.type] || req.type}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                        req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                            'bg-slate-500/20 text-slate-400'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>

                            {/* Documents */}
                            {req.documentUrls && req.documentUrls.length > 0 && (
                                <div className="mb-4">
                                    <label className="text-slate-400 text-sm">Submitted Documents:</label>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        {req.documentUrls.map((url, i) => (
                                            <a
                                                key={i}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-sm hover:bg-blue-600/30"
                                            >
                                                Document {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ops Recommendation (if already set) */}
                            {req.opsRecommendation && (
                                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                    <label className="text-yellow-400 text-sm font-medium">Your Recommendation:</label>
                                    <div className="text-white">{req.opsRecommendation}</div>
                                    {req.opsNotes && <div className="text-slate-400 text-sm mt-1">{req.opsNotes}</div>}
                                </div>
                            )}

                            {/* Make Recommendation */}
                            {req.status === 'PENDING' && !req.opsRecommendation && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30"
                                        onClick={() => {
                                            const notes = prompt('Notes for Admin:');
                                            if (notes !== null) submitRecommendation(req.id, 'RECOMMEND_BLUE', notes);
                                        }}
                                    >
                                        🔵 Recommend BLUE
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30"
                                        onClick={() => {
                                            const notes = prompt('Notes for Admin:');
                                            if (notes !== null) submitRecommendation(req.id, 'RECOMMEND_GREEN', notes);
                                        }}
                                    >
                                        🟢 Recommend GREEN
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                                        onClick={() => {
                                            const notes = prompt('Rejection reason:');
                                            if (notes) submitRecommendation(req.id, 'RECOMMEND_REJECT', notes);
                                        }}
                                    >
                                        ❌ Recommend Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Authority Reminder */}
            <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-500">
                    <strong>Remember:</strong> You are reviewing documents and making recommendations.
                    Only Admin can assign the actual verification tick.
                </p>
            </div>
        </div>
    );
}
