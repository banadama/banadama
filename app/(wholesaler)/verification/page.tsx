// app/(wholesaler)/verification/page.tsx
'use client';

import { useState } from 'react';
import { useVerification } from '@/hooks/useVerification';
import { useUser } from '@/hooks/useUser';
import type { VerificationType } from '@/types/verification';

export default function WholesalerVerificationPage() {
    const { user } = useUser();
    const { loading, error, requests, createRequest } = useVerification();

    // Assuming user object has supplierProfile with id
    const [supplierId, setSupplierId] = useState<string>(
        // @ts-expect-error adjust to your shape
        user?.supplierProfile?.id || ''
    );

    const [extraData, setExtraData] = useState('');
    const [documentsRaw, setDocumentsRaw] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const documentUrls = documentsRaw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const data: any = {};
        if (extraData.trim()) data.note = extraData.trim();

        const ok = await createRequest({
            type: 'SUPPLIER' as VerificationType,
            supplierId: supplierId || undefined,
            data,
            documentUrls,
        });

        if (ok) {
            setExtraData('');
            setDocumentsRaw('');
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Wholesaler Verification
                </h1>
                <p className="mt-1 text-sm text-slate-400 max-w-xl">
                    Verify your wholesaler account to increase trust and get better
                    visibility in Banadama search and marketplace.
                </p>
            </header>

            <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-xl">
                <h2 className="text-sm font-medium text-slate-200 mb-4">
                    Submit new verification request
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                            Wholesaler / Supplier ID
                        </label>
                        <input
                            type="text"
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            placeholder="Your wholesaler profile ID"
                            className="w-full rounded-xl bg-slate-900/70 border border-white/10 px-3 py-2 text-sm outline-none focus:border-orange-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                            Extra information (optional)
                        </label>
                        <textarea
                            value={extraData}
                            onChange={(e) => setExtraData(e.target.value)}
                            rows={3}
                            placeholder="Business name, registration number, address, notes…"
                            className="w-full rounded-xl bg-slate-900/70 border border-white/10 px-3 py-2 text-sm outline-none focus:border-orange-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                            Document URLs (comma separated)
                        </label>
                        <textarea
                            value={documentsRaw}
                            onChange={(e) => setDocumentsRaw(e.target.value)}
                            rows={2}
                            placeholder="https://.../license.pdf, https://.../id-card.png"
                            className="w-full rounded-xl bg-slate-900/70 border border-white/10 px-3 py-2 text-sm outline-none focus:border-orange-400"
                        />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading || !supplierId}
                            className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Submitting…' : 'Submit verification'}
                        </button>
                        {error && (
                            <span className="text-xs text-red-400">{error}</span>
                        )}
                    </div>
                </form>
            </section>

            <section>
                <h2 className="text-sm font-medium text-slate-200 mb-3">
                    Your verification requests
                </h2>

                {requests.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 px-4 py-5 text-sm text-slate-400">
                        You have not submitted any verification request yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm flex flex-col gap-1"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs uppercase tracking-wide text-slate-400">
                                        {req.type}
                                    </span>
                                    <span
                                        className={
                                            'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ' +
                                            (req.status === 'PENDING'
                                                ? 'bg-yellow-500/10 text-yellow-300'
                                                : req.status === 'APPROVED'
                                                    ? 'bg-emerald-500/10 text-emerald-300'
                                                    : 'bg-red-500/10 text-red-300')
                                        }
                                    >
                                        {req.status}
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    Created: {new Date(req.createdAt).toLocaleString()}
                                </div>
                                {req.rejectionReason && (
                                    <div className="text-[11px] text-red-300">
                                        Reason: {req.rejectionReason}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
