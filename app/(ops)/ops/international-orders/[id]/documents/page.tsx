// app/(ops)/ops/international-orders/[id]/documents/page.tsx - Trade Documents Management
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface TradeDocument {
    id: string;
    type: string;
    name: string;
    fileUrl: string;
    status: string;
    reviewNotes?: string;
    rejectionReason?: string;
    createdAt: string;
}

const DOC_TYPES = [
    'COMMERCIAL_INVOICE',
    'PACKING_LIST',
    'CERTIFICATE_OF_ORIGIN',
    'CUSTOMS_DECLARATION',
    'EXPORT_LICENSE',
    'OTHER',
];

export default function TradeDocumentsPage() {
    const params = useParams();
    const [documents, setDocuments] = useState<TradeDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [requiredDocs, setRequiredDocs] = useState<string[]>([]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch(`/api/ops/international-orders/${params.id}/documents`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setDocuments(data.documents || []);
                setRequiredDocs(data.requiredDocuments || []);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [params.id]);

    const handleReview = async (docId: string, approved: boolean) => {
        const notes = approved ? '' : prompt('Rejection reason:');
        if (!approved && !notes) return;

        try {
            const res = await fetch(`/api/ops/international-orders/${params.id}/documents/${docId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    status: approved ? 'APPROVED' : 'REJECTED',
                    notes,
                }),
            });
            if (res.ok) {
                fetchDocuments();
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const allApproved = requiredDocs.every((req) =>
        documents.some((d) => d.type === req && d.status === 'APPROVED')
    );

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link href={`/ops/international-orders/${params.id}`} className="text-blue-400 hover:underline text-sm">
                    ← Back to Order
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">📄 Trade Documents</h1>
                <p className="text-slate-400">Review and approve export documents</p>
            </div>

            {/* Required Documents Checklist */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Required Documents</h3>
                <div className="grid md:grid-cols-3 gap-3">
                    {requiredDocs.map((doc) => {
                        const uploaded = documents.find((d) => d.type === doc);
                        return (
                            <div key={doc} className={`p-3 rounded-lg ${uploaded?.status === 'APPROVED' ? 'bg-green-500/10 border border-green-500/30' :
                                    uploaded?.status === 'REJECTED' ? 'bg-red-500/10 border border-red-500/30' :
                                        uploaded ? 'bg-yellow-500/10 border border-yellow-500/30' :
                                            'bg-slate-900/50 border border-slate-700'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white">{doc.replace(/_/g, ' ')}</span>
                                    {uploaded?.status === 'APPROVED' && <span className="text-green-400">✓</span>}
                                    {uploaded?.status === 'REJECTED' && <span className="text-red-400">✗</span>}
                                    {uploaded?.status === 'PENDING' && <span className="text-yellow-400">⏳</span>}
                                    {!uploaded && <span className="text-slate-500">-</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {allApproved && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <span className="text-green-400">✓ All required documents approved!</span>
                    </div>
                )}
            </div>

            {/* Documents List */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                    <h3 className="text-white font-medium">Uploaded Documents</h3>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : documents.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No documents uploaded yet</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Document</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Type</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="text-white">{doc.name}</div>
                                        <a href={doc.fileUrl} target="_blank" className="text-xs text-blue-400 hover:underline">
                                            View file →
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-300">
                                        {doc.type.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${doc.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                                doc.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {doc.status}
                                        </span>
                                        {doc.rejectionReason && (
                                            <div className="text-xs text-red-400 mt-1">{doc.rejectionReason}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {doc.status === 'PENDING' && (
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                    onClick={() => handleReview(doc.id, true)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                                    onClick={() => handleReview(doc.id, false)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
