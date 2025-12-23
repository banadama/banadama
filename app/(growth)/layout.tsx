// app/(growth)/layout.tsx - Growth Layout
import { DashboardShell } from "../../components/layout/DashboardShell";
import { growthNav } from "../../components/layout/nav.config";
import { requireRole } from "@/lib/auth";

export default async function GrowthLayout({ children }: { children: React.ReactNode }) {
    await requireRole(["GROWTH_AGENT", "GROWTH_MANAGER"]);

    return (
        <DashboardShell title="Growth Agent" nav={growthNav}>
            {children}
        </DashboardShell>
    );
}
