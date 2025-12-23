// app/(creator)/creator/jobs/page.tsx - Creator Jobs List
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CreatorJob {
    id: string;
    title: string;
    jobType: string;
    companyName: string;
    budgetAmount: number;
    status: string;
    deadline?: string;
    createdAt: string;
}

const STATUS_ICONS: Record<string, string> = {
    PENDING: '⏳',
    ASSIGNED: '✓',
    IN_PROGRESS: '🔄',
    DELIVERED: '📤',
    REVISION: '🔁',
    COMPLETED: '✅',
    CANCELLED: '❌',
    DISPUTED: '⚠️',
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    ASSIGNED: 'bg-blue-500/20 text-blue-400',
    IN_PROGRESS: 'bg-purple-500/20 text-purple-400',
    DELIVERED: 'bg-orange-500/20 text-orange-400',
    REVISION: 'bg-amber-500/20 text-amber-400',
    COMPLETED: 'bg-green-500/20 text-green-400',
    CANCELLED: 'bg-slate-500/20 text-slate-400',
    DISPUTED: 'bg-red-500/20 text-red-400',
};

export default function CreatorJobsPage() {
    const searchParams = useSearchParams();
    const [jobs, setJobs] = useState<CreatorJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(searchParams.get('status') || '');

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const url = filter ? `/api/creator/jobs?status=${filter}` : '/api/creator/jobs';
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data.jobs || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [filter]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;
    const formatDate = (d: string) => new Date(d).toLocaleDateString();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">📋 My Jobs</h1>
                <p className="text-slate-400">Local jobs assigned by Ops</p>
            </div>

            {/* Info */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                <p className="text-purple-400 text-sm">
                    📍 <strong>Local Jobs Only:</strong> Modelling, photography, videography. All jobs are assigned by Ops - no direct requests.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['', 'ASSIGNED', 'IN_PROGRESS', 'DELIVERED', 'COMPLETED'].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${filter === f ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f ? `${STATUS_ICONS[f]} ${f}` : 'All Jobs'}
                    </button>
                ))}
            </div>

            {/* Jobs List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : jobs.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">📋</span>
                    <p className="text-slate-400 mt-4">No jobs found</p>
                    <p className="text-slate-500 text-sm mt-2">
                        Jobs are assigned by Ops based on your skills and availability
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Link key={job.id} href={`/creator/jobs/${job.id}`}>
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-medium">{job.title}</h3>
                                        <p className="text-slate-500 text-sm">For: {job.companyName}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${STATUS_COLORS[job.status]}`}>
                                        <span>{STATUS_ICONS[job.status]}</span>
                                        {job.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Type</span>
                                        <div className="text-purple-400">{job.jobType.replace('CREATOR_', '')}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Budget</span>
                                        <div className="text-green-400 font-medium">{formatMoney(job.budgetAmount)}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Deadline</span>
                                        <div className="text-white">{job.deadline ? formatDate(job.deadline) : '-'}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Received</span>
                                        <div className="text-white">{formatDate(job.createdAt)}</div>
                                    </div>
                                </div>

                                <div className="mt-4 text-right">
                                    <span className="text-purple-400 text-sm">View Details →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
