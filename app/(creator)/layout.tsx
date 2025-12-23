// app/(creator)/layout.tsx - Creator Layout
import { DashboardShell } from "../../components/layout/DashboardShell";
import { creatorNav } from "../../components/layout/nav.config";
import { requireRole } from "@/lib/auth";

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
    await requireRole("CREATOR");

    return (
        <DashboardShell title="Creator Studio" nav={creatorNav}>
            {children}
        </DashboardShell>
    );
}
