// app/(admin)/admin/verifications/page.tsx
import { requireRole } from '@/lib/auth';

const cardBase =
    'rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.7)] backdrop-blur-2xl';

const mockVerifications = [
    {
        id: 'v1',
        type: 'SUPPLIER',
        entityName: 'Lagos Garment Factory',
        country: 'Nigeria',
        submittedAt: '2025-01-02',
        status: 'PENDING',
    },
    {
        id: 'v2',
        type: 'CREATOR',
        entityName: 'Abdul Model',
        country: 'Nigeria',
        submittedAt: '2025-01-03',
        status: 'PENDING',
    },
];

export default async function AdminVerificationsPage() {
    await requireRole('ADMIN');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Verifications</h1>
                <p className="text-sm text-slate-400">Review and approve KYC, supplier and creator verification requests.</p>
            </div>

            <div className={cardBase}>
                <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                        <tr>
                            <th className="pb-2 pr-2">Type</th>
                            <th className="pb-2 pr-2">Name</th>
                            <th className="pb-2 pr-2">Country</th>
                            <th className="pb-2 pr-2">Submitted</th>
                            <th className="pb-2 pr-2">Status</th>
                            <th className="pb-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockVerifications.map((v) => (
                            <tr key={v.id}>
                                <td className="py-2 pr-2 text-xs">{v.type}</td>
                                <td className="py-2 pr-2 text-sm text-slate-50">
                                    {v.entityName}
                                </td>
                                <td className="py-2 pr-2 text-xs">{v.country}</td>
                                <td className="py-2 pr-2 text-xs">{v.submittedAt}</td>
                                <td className="py-2 pr-2">
                                    <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[11px] text-amber-300">
                                        {v.status}
                                    </span>
                                </td>
                                <td className="py-2 text-right">
                                    <div className="inline-flex gap-1">
                                        <button className="rounded-2xl bg-white/5 px-2 py-1 text-[11px] text-slate-100 hover:bg-white/10">
                                            View docs
                                        </button>
                                        <button className="rounded-2xl bg-emerald-500/25 px-2 py-1 text-[11px] text-emerald-100 hover:bg-emerald-500/40">
                                            Approve
                                        </button>
                                        <button className="rounded-2xl bg-red-500/25 px-2 py-1 text-[11px] text-red-100 hover:bg-red-500/40">
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* 🔜 This will connect directly to /api/admin/verifications (Step C) */}
            </div>
        </div>
    );
}
