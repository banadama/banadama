// app/(factory)/layout.tsx - Factory Layout
import { DashboardShell } from "../../components/layout/DashboardShell";
import { factoryNav } from "../../components/layout/nav.config";
import { requireRole } from "@/lib/auth";

export default async function FactoryLayout({ children }: { children: React.ReactNode }) {
    // Both FACTORY and WHOLESALER roles are normalized to SUPPLIER in requireRole if needed,
    // but here we specify FACTORY as the primary role for this route group.
    await requireRole("FACTORY");

    return (
        <DashboardShell title="Factory Dashboard" nav={factoryNav}>
            {children}
        </DashboardShell>
    );
}
