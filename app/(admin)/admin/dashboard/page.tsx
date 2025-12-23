// app/(admin)/admin/dashboard/page.tsx
import { DashboardShell } from "@/components/shared/DashboardShell";

export default function AdminDashboardPage() {
    return (
        <DashboardShell
            variant="admin"
            title="Admin Dashboard"
            subtitle="Users, products, orders, payouts & moderation overview."
        >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-xs text-slate-400">Total Users</p>
                <p className="mt-2 text-2xl font-semibold text-orange-400">0</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-xs text-slate-400">Active Orders</p>
                <p className="mt-2 text-2xl font-semibold text-orange-400">0</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-xs text-slate-400">Platform Revenue</p>
                <p className="mt-2 text-2xl font-semibold text-orange-400">₦0</p>
            </div>
        </DashboardShell>
    );
}
