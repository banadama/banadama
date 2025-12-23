// app/(admin)/admin/layout.tsx - Single Admin Layout
import { DashboardShell } from "@/components/layout/DashboardShell";
import { adminNav } from "@/components/layout/nav.admin.final";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireRole(["ADMIN", "FINANCE_ADMIN"]);

    return (
        <DashboardShell title="Admin" nav={adminNav}>
            {children}
        </DashboardShell>
    );
}
