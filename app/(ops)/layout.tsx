// app/(ops)/layout.tsx - Ops Layout
import { DashboardShell } from "../../components/layout/DashboardShell";
import { opsNav } from "../../components/layout/nav.config";
import { requireRole } from "@/lib/auth";

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
    // Ops dashboard allows both OPS and ADMIN
    await requireRole(["OPS", "ADMIN"]);

    return (
        <DashboardShell title="Ops Control" nav={opsNav}>
            {children}
        </DashboardShell>
    );
}
