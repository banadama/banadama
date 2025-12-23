// app/(admin)/admin/suppliers/page.tsx
import { requireRole } from '@/lib/auth';

const cardBase =
    'rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.7)] backdrop-blur-2xl';

const mockSuppliers = [
    {
        id: 's1',
        name: 'Lagos Garment Factory',
        type: 'FACTORY',
        country: 'Nigeria',
        status: 'VERIFIED',
        rating: 4.7,
        orders: 210,
    },
    {
        id: 's2',
        name: 'Dhaka Bulk Shoes',
        type: 'WHOLESALER',
        country: 'Bangladesh',
        status: 'PENDING',
        rating: 4.2,
        orders: 65,
    },
];

export default async function AdminSuppliersPage() {
    await requireRole('ADMIN');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Suppliers Management</h1>
                <p className="text-sm text-slate-400">Factories and wholesalers: verification status, quality, orders and risk flags.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
                <select className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 outline-none backdrop-blur-xl">
                    <option value="ALL">All types</option>
                    <option value="FACTORY">Factories</option>
                    <option value="WHOLESALER">Wholesalers</option>
                </select>
                <select className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 outline-none backdrop-blur-xl">
                    <option value="ALL">All statuses</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                </select>
            </div>

            <div className={cardBase}>
                <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                        <tr>
                            <th className="pb-2 pr-2">Supplier</th>
                            <th className="pb-2 pr-2">Type</th>
                            <th className="pb-2 pr-2">Country</th>
                            <th className="pb-2 pr-2">Status</th>
                            <th className="pb-2 pr-2">Rating</th>
                            <th className="pb-2 pr-2">Orders</th>
                            <th className="pb-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockSuppliers.map((s) => (
                            <tr key={s.id}>
                                <td className="py-2 pr-2 text-sm text-slate-50">{s.name}</td>
                                <td className="py-2 pr-2 text-xs">{s.type}</td>
                                <td className="py-2 pr-2 text-xs">{s.country}</td>
                                <td className="py-2 pr-2">
                                    <span
                                        className={
                                            s.status === 'VERIFIED'
                                                ? 'rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-300'
                                                : s.status === 'PENDING'
                                                    ? 'rounded-full bg-amber-500/15 px-2 py-1 text-[11px] text-amber-300'
                                                    : 'rounded-full bg-red-500/15 px-2 py-1 text-[11px] text-red-300'
                                        }
                                    >
                                        {s.status}
                                    </span>
                                </td>
                                <td className="py-2 pr-2 text-xs">{s.rating.toFixed(1)}</td>
                                <td className="py-2 pr-2 text-xs">{s.orders}</td>
                                <td className="py-2 text-right">
                                    <div className="inline-flex gap-1">
                                        <button className="rounded-2xl bg-white/5 px-2 py-1 text-[11px] text-slate-100 hover:bg-white/10">
                                            View
                                        </button>
                                        <button className="rounded-2xl bg-emerald-500/20 px-2 py-1 text-[11px] text-emerald-100 hover:bg-emerald-500/30">
                                            Verify
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
                {/* 🔜 will later plug into /api/admin/suppliers */}
            </div>
        </div>
    );
}
