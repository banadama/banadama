// app/(admin)/creators/page.tsx
import { DashboardShell } from '@/components/layouts/DashboardShell';

const cardBase =
    'rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.7)] backdrop-blur-2xl';

const mockCreators = [
    {
        id: 'c1',
        name: 'Fatima Studio',
        type: 'GraphicDesigner',
        status: 'ACTIVE',
        rating: 4.8,
        totalSales: 120,
        flags: 0,
    },
    {
        id: 'c2',
        name: 'Abdul Model',
        type: 'Model',
        status: 'WARNING',
        rating: 4.1,
        totalSales: 35,
        flags: 2,
    },
    {
        id: 'c3',
        name: 'Bangla Mock Lab',
        type: 'MockDesigner',
        status: 'SUSPENDED',
        rating: 3.2,
        totalSales: 18,
        flags: 5,
    },
];

export default function AdminCreatorsPage() {
    return (
        <DashboardShell
            variant="admin"
            title="Creators management"
            description="Control creators quality, warnings and bans across models, graphic designers, mock designers and more."
        >
            <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                    <select className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 outline-none backdrop-blur-xl">
                        <option value="ALL">All statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="WARNING">With warnings</option>
                        <option value="SUSPENDED">Suspended</option>
                    </select>
                    <select className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 outline-none backdrop-blur-xl">
                        <option value="ALL">All types</option>
                        <option value="Model">Model</option>
                        <option value="GraphicDesigner">Graphic Designer</option>
                        <option value="MockDesigner">Mock Designer</option>
                    </select>
                </div>

                {/* Table */}
                <div className={cardBase}>
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                            <tr>
                                <th className="pb-2 pr-2">Creator</th>
                                <th className="pb-2 pr-2">Type</th>
                                <th className="pb-2 pr-2">Status</th>
                                <th className="pb-2 pr-2">Rating</th>
                                <th className="pb-2 pr-2">Sales</th>
                                <th className="pb-2 pr-2">Flags</th>
                                <th className="pb-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {mockCreators.map((c) => (
                                <tr key={c.id} className="align-middle">
                                    <td className="py-2 pr-2 text-sm text-slate-50">{c.name}</td>
                                    <td className="py-2 pr-2 text-xs text-slate-300">{c.type}</td>
                                    <td className="py-2 pr-2">
                                        <span
                                            className={
                                                c.status === 'ACTIVE'
                                                    ? 'rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-300'
                                                    : c.status === 'WARNING'
                                                        ? 'rounded-full bg-amber-500/15 px-2 py-1 text-[11px] text-amber-300'
                                                        : 'rounded-full bg-red-500/15 px-2 py-1 text-[11px] text-red-300'
                                            }
                                        >
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-2 text-xs">{c.rating.toFixed(1)}</td>
                                    <td className="py-2 pr-2 text-xs">{c.totalSales}</td>
                                    <td className="py-2 pr-2 text-xs">{c.flags}</td>
                                    <td className="py-2 text-right">
                                        <div className="inline-flex gap-1">
                                            <button className="rounded-2xl bg-white/5 px-2 py-1 text-[11px] text-slate-100 hover:bg-white/10">
                                                View
                                            </button>
                                            <button className="rounded-2xl bg-amber-500/20 px-2 py-1 text-[11px] text-amber-200 hover:bg-amber-500/30">
                                                Warning
                                            </button>
                                            <button className="rounded-2xl bg-red-500/25 px-2 py-1 text-[11px] text-red-100 hover:bg-red-500/40">
                                                Suspend
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* 🔜 this will later call /api/admin/creators for real data and mutation */}
                </div>
            </div>
        </DashboardShell>
    );
}
