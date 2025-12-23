// app/(admin)/admin/reports/page.tsx
import { requireRole } from '@/lib/auth';

const cardBase =
    'rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.7)] backdrop-blur-2xl';

export default async function AdminReportsPage() {
    await requireRole('ADMIN');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Reports & Analytics</h1>
                <p className="text-sm text-slate-400">High level performance of buyers, suppliers, creators and affiliates.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className={cardBase}>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        GMV breakdown
                    </div>
                    <p className="mt-2 text-sm text-slate-200">
                        Later this card will show a chart of GMV by category (garments, shoes,
                        bags, electronics, industrial) and by market:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-xs text-slate-400">
                        <li>Big marketplace (everyone)</li>
                        <li>Mini market (creators → factory/wholesaler only)</li>
                    </ul>
                </div>

                <div className={cardBase}>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Risk & returns
                    </div>
                    <p className="mt-2 text-sm text-slate-200">
                        Returns, disputes and fraud signals per supplier and per creator, so
                        you can keep “trade with no regret” real.
                    </p>
                </div>
            </div>
        </div>
    );
}
