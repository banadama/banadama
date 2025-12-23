// components/ui/Breadcrumbs.tsx - Breadcrumb Navigation with SVG separators
import * as React from "react";
import { Icons } from "@/components/icons/icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav className="bd-breadcrumbs" aria-label="Breadcrumb">
            {items.map((c, idx) => (
                <React.Fragment key={`${c.label}-${idx}`}>
                    {idx > 0 ? <Icons.ChevronRight size={16} /> : null}
                    {c.href ? (
                        <a href={c.href}>{c.label}</a>
                    ) : (
                        <span style={{ color: "var(--bd-text)", fontWeight: 800 }}>{c.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}
