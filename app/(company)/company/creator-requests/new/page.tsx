// app/(company)/company/creator-requests/new/page.tsx - New Creator Request
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const JOB_TYPES = [
    { value: 'CREATOR_MODEL', label: '👤 Modelling', local: true },
    { value: 'CREATOR_PHOTOGRAPHER', label: '📷 Photography', local: true },
    { value: 'CREATOR_VIDEOGRAPHER', label: '🎥 Videography', local: true },
    { value: 'CREATOR_GRAPHIC_DESIGNER', label: '🎨 Graphic Design', local: false },
    { value: 'CREATOR_MOCK_DESIGNER', label: '📱 Mockup Design', local: false },
];

export default function NewCreatorRequestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        jobType: 'CREATOR_PHOTOGRAPHER',
        title: '',
        description: '',
        requirements: '',
        budget: 50000, // ₦500 default
        deadline: '',
    });

    const selectedJob = JOB_TYPES.find(j => j.value === formData.jobType);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            alert('Please fill in required fields');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/company/creator-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    budgetAmount: Math.round(formData.budget * 100), // Convert to kobo
                    deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
                }),
            });

            if (res.ok) {
                router.push('/company/creator-requests');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create request');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">✨ New Creator Request</h1>
                <p className="text-slate-400">Request a creator for production work</p>
            </div>

            {/* How It Works */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                <h4 className="text-purple-400 font-medium mb-2">How It Works</h4>
                <ol className="text-slate-400 text-sm space-y-1 list-decimal list-inside">
                    <li>Submit your request with requirements</li>
                    <li>Ops reviews and assigns a suitable creator</li>
                    <li>Creator delivers the work</li>
                    <li>You confirm satisfaction</li>
                    <li>Payment released to creator</li>
                </ol>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Job Type */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Job Type *</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {JOB_TYPES.map((job) => (
                                <button
                                    key={job.value}
                                    type="button"
                                    className={`p-4 rounded-lg border text-left ${formData.jobType === job.value
                                            ? 'bg-purple-600 border-purple-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-purple-500/50'
                                        }`}
                                    onClick={() => setFormData({ ...formData, jobType: job.value })}
                                >
                                    <div className="font-medium">{job.label}</div>
                                    <div className="text-xs mt-1 opacity-70">
                                        {job.local ? '📍 Local only' : '🌍 Global'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Local Job Notice */}
                    {selectedJob?.local && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-yellow-400 text-sm">
                                📍 <strong>Local Job:</strong> Creator must be in the same country as your company. Ops will assign an available creator.
                            </p>
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Job Title *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            placeholder="e.g., Product photoshoot for new catalog"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Description *</label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                            rows={4}
                            placeholder="Describe what you need in detail..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Specific Requirements</label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                            rows={3}
                            placeholder="Any specific requirements, preferred style, deliverables..."
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Budget (₦)</label>
                        <input
                            type="number"
                            min="100"
                            step="100"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-slate-500 text-xs mt-1">Final cost may vary based on Ops review</p>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Deadline (optional)</label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>

                    <p className="text-slate-500 text-xs text-center">
                        Ops will review your request and assign a suitable creator
                    </p>
                </div>
            </form>
        </div>
    );
}
