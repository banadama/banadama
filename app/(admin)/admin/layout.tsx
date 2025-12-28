export const dynamic = 'force-dynamic';
import { DashboardShell } from "@/components/layout/DashboardShell";
import { adminNav } from "@/components/layout/nav.admin.final";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireRole(["ADMIN", "FINANCE_ADMIN", "OPS"]);

    return (
        <DashboardShell title="Admin" nav={adminNav}>
            {children}
        </DashboardShell>
    );
}
