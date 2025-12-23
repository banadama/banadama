// components/layout/SideNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export type NavItem = {
    href: string;
    label: string;
    icon?: React.ReactNode;
};

export function SideNav({ items }: { items: NavItem[] }) {
    const path = usePathname();

    return (
        <div className="bd-grid" style={{ gap: 8 }}>
            {items.map((it) => {
                const active = path?.startsWith(it.href);
                return (
                    <Link
                        key={it.href}
                        href={it.href}
                        className="bd-card bd-card-pad"
                        style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            borderColor: active ? "hsl(var(--bd-brand-2))" : "hsl(var(--bd-border))",
                            boxShadow: active ? "var(--bd-shadow2)" : "var(--bd-shadow)",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {it.icon ? (
                            <span style={{ display: "grid", placeItems: "center", width: 20, height: 20 }}>
                                {it.icon}
                            </span>
                        ) : (
                            <span>•</span>
                        )}
                        <span style={{ fontWeight: 700 }}>{it.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
