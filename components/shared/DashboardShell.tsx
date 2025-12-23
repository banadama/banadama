// components/shared/DashboardShell.tsx
"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export type DashboardVariant =
    | "buyer"
    | "factory"
    | "wholesaler"
    | "factoryCreators"
    | "creator"
    | "creatorMini"
    | "model"
    | "mock"
    | "graphic"
    | "affiliate"
    | "ops"
    | "admin";

const variantBackgrounds: Record<DashboardVariant, string> = {
    // B2C marketplace / buyer – clean, premium
    buyer: "bg-[radial-gradient(circle_at_top,_#1f2937,_#020617)]",

    // Industrial / blueprint vibes
    factory: "bg-[radial-gradient(circle_at_top,_#22c55e33,_#020617)]",
    wholesaler: "bg-[radial-gradient(circle_at_top,_#38bdf833,_#020617)]",
    factoryCreators: "bg-[radial-gradient(circle_at_top_left,_#22c55e33,_transparent_60%)]",

    // Generic creators studio
    creator: "bg-[radial-gradient(circle_at_top,_#f9731633,_#020617)]",
    creatorMini: "bg-[radial-gradient(circle_at_top_left,_#f9731633,_transparent_60%)]",

    // Special creator dashboards
    model: "bg-[radial-gradient(circle_at_top,_#f9731633,_#020617)]",      // minimalist swiss
    mock: "bg-[radial-gradient(circle_at_top,_#22c55e33,_#020617)]",       // modern editorial
    graphic: "bg-[radial-gradient(circle_at_top,_#8b5cf633,_#020617)]",    // hyper typography

    // Affiliate – kinetic + orange
    affiliate: "bg-[radial-gradient(circle_at_top,_#f9731633,_#020617)]",

    // Ops / Admin – clean control center
    ops: "bg-[radial-gradient(circle_at_top,_#0ea5e933,_#020617)]",
    admin: "bg-[radial-gradient(circle_at_top,_#020617,_#000000)]",
};

interface DashboardShellProps {
    variant: DashboardVariant;
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function DashboardShell({
    variant,
    title,
    subtitle,
    actions,
    children,
    className,
}: DashboardShellProps) {
    return (
        <div
            className={clsx(
                "min-h-screen text-slate-100 relative overflow-hidden",
                "bg-slate-950",
                variantBackgrounds[variant],
                className
            )}
        >
            {/* subtle overlay gradient */}
            <div className="pointer-events-none absolute inset-0 opacity-25">
                <div className="h-full w-full bg-[radial-gradient(circle_at_bottom_right,_#6366f133,_transparent_65%)]" />
            </div>

            {/* main content container */}
            <div className="relative z-10 px-4 py-6 sm:px-8 lg:px-10">
                {title && (
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                            {subtitle && (
                                <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
                            )}
                        </div>
                        {actions && (
                            <div className="flex items-center gap-2">{actions}</div>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
