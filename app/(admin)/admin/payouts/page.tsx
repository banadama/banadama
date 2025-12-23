// app/(admin)/payouts/page.tsx
import { DashboardShell } from '@/components/layouts/DashboardShell';

const cardBase =
    'rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.7)] backdrop-blur-2xl';

export default function AdminPayoutsPage() {
    return (
        <DashboardShell
            variant="admin"
            title="Payouts management"
            description="Control wallet funding, supplier payouts and affiliate commissions."
        >
            <div className="grid gap-4 lg:grid-cols-3">
                <div className={cardBase}>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Supplier payouts (pending)
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-50">₦850,000</div>
                    <p className="mt-1 text-xs text-slate-400">Across 18 suppliers.</p>
                </div>

                <div className={cardBase}>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Affiliate payouts (pending)
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-50">₦120,000</div>
                    <p className="mt-1 text-xs text-slate-400">
                        Commission from clicks, signups & verified suppliers.
                    </p>
                </div>

                <div className={cardBase}>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Platform balance
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-emerald-300">
                        ₦3,500,000
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                        After expected payouts and fees.
                    </p>
                </div>
            </div>
        </DashboardShell>
    );
}
