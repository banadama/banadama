// app/(admin)/dashboard/page.tsx
import { DashboardShell } from '@/components/layouts/DashboardShell';

const metricCardBase =
    'rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_30px_rgba(15,23,42,0.7)] backdrop-blur-2xl';

export default function AdminDashboardPage() {
    // 🔜 Later, replace these with real data from /api/admin/metrics
    const metrics = {
        totalUsers: 1200,
        totalSuppliers: 140,
        totalCreators: 85,
        activeRequests: 32,
        pendingVerifications: 12,
        monthlyGmv: '₦18,500,000',
        platformRevenue: '₦1,250,000',
        affiliateCost: '₦120,000',
    };

    return (
        <DashboardShell
            variant="admin"
            title="Overview"
            description="High-level health of the Banadama platform – users, suppliers, verifications, revenue."
        >
            <div className="space-y-6">
                {/* Top metrics */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className={metricCardBase}>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Total users
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-50">
                            {metrics.totalUsers.toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs text-emerald-400/80">+2.4% this week</div>
                    </div>

                    <div className={metricCardBase}>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Suppliers
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-50">
                            {metrics.totalSuppliers}
                        </div>
                        <div className="mt-1 text-xs text-orange-300/90">
                            Factories & wholesalers
                        </div>
                    </div>

                    <div className={metricCardBase}>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Creators
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-50">
                            {metrics.totalCreators}
                        </div>
                        <div className="mt-1 text-xs text-fuchsia-300/90">
                            Models, graphic & mock designers
                        </div>
                    </div>

                    <div className={metricCardBase}>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Active RFQs
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-50">
                            {metrics.activeRequests}
                        </div>
                        <div className="mt-1 text-xs text-amber-300/90">Need ops attention</div>
                    </div>
                </div>

                {/* Revenue & verifications */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className={`${metricCardBase} lg:col-span-2`}>
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    Platform revenue
                                </div>
                                <div className="mt-2 text-3xl font-semibold text-orange-300">
                                    {metrics.platformRevenue}
                                </div>
                                <p className="mt-1 text-xs text-slate-400">
                                    From service fees, 5.2% fulfillment, duty margin & subscriptions.
                                </p>
                            </div>
                            <div className="text-right text-xs text-slate-400">
                                <div>GMV this month</div>
                                <div className="mt-1 text-lg font-semibold text-slate-50">
                                    {metrics.monthlyGmv}
                                </div>
                                <div className="mt-1 text-emerald-400/80">+12.1% vs last month</div>
                            </div>
                        </div>
                    </div>

                    <div className={metricCardBase}>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Verifications
                        </div>
                        <div className="mt-2 text-3xl font-semibold text-slate-50">
                            {metrics.pendingVerifications}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Pending KYC / supplier / creator checks.
                        </p>
                        <button className="mt-3 w-full rounded-2xl bg-orange-500/80 px-3 py-2 text-xs font-medium text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.9)] transition hover:bg-orange-400">
                            Open verification queue
                        </button>
                    </div>
                </div>

                {/* Affiliate cost + risk area */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className={metricCardBase}>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Affiliate cost
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-50">
                            {metrics.affiliateCost}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            ₦50 per signup, 1–3% per sale & ₦100 per verified supplier.
                        </p>
                    </div>

                    <div className={metricCardBase}>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Risk & quality
                        </div>
                        <p className="mt-2 text-sm text-slate-200">
                            Monitor disputes, returns, low ratings & suspicious suppliers. This is
                            where you enforce “trade with no regret”.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
