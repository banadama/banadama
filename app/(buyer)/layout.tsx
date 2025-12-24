export const dynamic = 'force-dynamic';
// app/(buyer)/layout.tsx - Buyer Layout
import { DashboardShell } from "@/components/layout/DashboardShell";
import { buyerNav } from "@/components/layout/nav.config";
import { requireRole } from "@/lib/auth";

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
    await requireRole("BUYER");

    return (
        <DashboardShell title="Buyer Dashboard" nav={buyerNav}>
            {children}
        </DashboardShell>
    );
}

