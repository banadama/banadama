// app/(wholesaler)/layout.tsx - Wholesaler Layout
import { DashboardShell } from "../../components/layout/DashboardShell";
import { wholesalerNav } from "../../components/layout/nav.config";
import { requireRole } from "@/lib/auth";

export default async function WholesalerLayout({ children }: { children: React.ReactNode }) {
    await requireRole("WHOLESALER");

    return (
        <DashboardShell title="Wholesaler Dashboard" nav={wholesalerNav}>
            {children}
        </DashboardShell>
    );
}
