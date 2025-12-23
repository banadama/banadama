// app/(affiliate)/layout.tsx - Affiliate Layout
import { DashboardShell } from "../../components/layout/DashboardShell";
import { affiliateNav } from "../../components/layout/nav.config";
import { requireRole } from "@/lib/auth";

export default async function AffiliateLayout({ children }: { children: React.ReactNode }) {
    await requireRole("AFFILIATE");

    return (
        <DashboardShell title="Affiliate Portal" nav={affiliateNav}>
            {children}
        </DashboardShell>
    );
}
