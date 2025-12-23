// app/(retail)/retail/layout.tsx - Retail Layout
import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default async function RetailLayout({ children }: { children: React.ReactNode }) {
    await requireRole("RETAIL");

    const nav = [
        { href: "/retail/dashboard", label: "Dashboard" },
        { href: "/retail/products", label: "Products" },
        { href: "/retail/orders", label: "Purchase Orders" },
        { href: "/retail/messages", label: "Messages" },
    ];

    return (
        <DashboardShell
            role="RETAIL"
            title="Retail"
            nav={nav}
        >
            {children}
        </DashboardShell>
    );
}
