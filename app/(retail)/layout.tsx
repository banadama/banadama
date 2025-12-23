// app/(retail)/layout.tsx - Retail Layout
import { DashboardShell } from "../../components/layout/DashboardShell";
import { retailNav } from "../../components/layout/nav.config";
import { requireRole } from "@/lib/auth";

export default async function RetailLayout({ children }: { children: React.ReactNode }) {
    await requireRole("RETAIL");

    return (
        <DashboardShell title="Retail Store" nav={retailNav}>
            {children}
        </DashboardShell>
    );
}
