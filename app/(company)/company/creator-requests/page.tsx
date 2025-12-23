// app/(company)/company/creator-requests/page.tsx - Company Creator Requests
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CreatorRequest {
    id: string;
    title: string;
    jobType: string;
    status: string;
    creatorName?: string;
    budgetAmount: number;
    createdAt: string;
    deadline?: string;
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    ASSIGNED: 'bg-blue-500/20 text-blue-400',
    IN_PROGRESS: 'bg-purple-500/20 text-purple-400',
    DELIVERED: 'bg-orange-500/20 text-orange-400',
    COMPLETED: 'bg-green-500/20 text-green-400',
    CANCELLED: 'bg-slate-500/20 text-slate-400',
};

export default function CompanyCreatorRequestsPage() {
    const [requests, setRequests] = useState<CreatorRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch('/api/company/creator-requests', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setRequests(data.requests || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;
    const formatDate = (d: string) => new Date(d).toLocaleDateString();

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">🎨 Creator Requests</h1>
                    <p className="text-slate-400">Request creators for production work</p>
                </div>
                <Link href="/company/creator-requests/new">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        + New Request
                    </button>
                </Link>
            </div>

            {/* Info */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                <p className="text-purple-400 text-sm">
                    📋 <strong>How it works:</strong> Submit your request → Ops reviews → Creator assigned → Work delivered → You confirm → Payout released
                </p>
            </div>

            {/* Requests List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : requests.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">🎨</span>
                    <p className="text-slate-400 mt-4">No creator requests yet</p>
                    <Link href="/company/creator-requests/new">
                        <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">
                            Make Your First Request
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <Link key={req.id} href={`/company/creator-requests/${req.id}`}>
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-medium">{req.title}</h3>
                                        {req.creatorName && (
                                            <p className="text-slate-500 text-sm">Creator: {req.creatorName}</p>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs ${STATUS_COLORS[req.status]}`}>
                                        {req.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Type</span>
                                        <div className="text-purple-400">{req.jobType.replace('CREATOR_', '')}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Budget</span>
                                        <div className="text-green-400">{formatMoney(req.budgetAmount)}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Deadline</span>
                                        <div className="text-white">{req.deadline ? formatDate(req.deadline) : '-'}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Requested</span>
                                        <div className="text-white">{formatDate(req.createdAt)}</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
