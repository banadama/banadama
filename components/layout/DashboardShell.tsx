// components/layout/DashboardShell.tsx
import * as React from "react";
import { Icons } from "@/components/icons/icons";
import { TopNav } from "./TopNav";
import { SideNav, NavItem } from "./SideNav";

export function DashboardShell({
    title,
    nav,
    children,
}: {
    title: string;
    nav: NavItem[];
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "260px 1fr" }}>
            <aside
                style={{
                    borderRight: "1px solid hsl(var(--bd-border))",
                    padding: 16,
                    background: "hsl(var(--bd-bg))",
                }}
            >
                <div
                    style={{
                        fontWeight: 900,
                        fontSize: 20,
                        marginBottom: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <Icons.Marketplace size={28} />
                    Banadama
                </div>
                <SideNav items={nav} />
            </aside>
            <main style={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
                <TopNav title={title} />
                <div
                    className="bd-container"
                    style={{ padding: "16px 16px 40px", background: "hsl(var(--bd-muted))" }}
                >
                    {children}
                </div>
            </main>
        </div>
    );
}
