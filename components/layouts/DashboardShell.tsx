// components/layouts/DashboardShell.tsx
'use client';

import React from 'react';
import clsx from 'clsx';

type DashboardVariant =
    | 'admin'
    | 'buyer'
    | 'factory'
    | 'wholesaler'
    | 'creator'
    | 'ops'
    | 'affiliate';

interface DashboardShellProps {
    variant: DashboardVariant;
    title: string;
    description?: string;
    children: React.ReactNode;
    headerRight?: React.ReactNode;
}

const variantBackgrounds: Record<DashboardVariant, string> = {
    admin:
        'bg-[radial-gradient(circle_at_top,_#FF7A1A33,_transparent_60%),radial-gradient(circle_at_bottom,_#3B82F633,_transparent_60%),bg-slate-950]',
    buyer:
        'bg-[radial-gradient(circle_at_top,_#22C55E33,_transparent_60%),bg-slate-950]',
    factory:
        'bg-[radial-gradient(circle_at_top,_#38BDF833,_transparent_60%),bg-slate-950]',
    wholesaler:
        'bg-[radial-gradient(circle_at_top,_#F9731633,_transparent_60%),bg-slate-950]',
    creator:
        'bg-[radial-gradient(circle_at_top,_#A855F733,_transparent_60%),bg-slate-950]',
    ops:
        'bg-[radial-gradient(circle_at_top,_#0EA5E933,_transparent_60%),bg-slate-950]',
    affiliate:
        'bg-[radial-gradient(circle_at_top,_#F9731633,_transparent_60%),bg-slate-950]',
};

export function DashboardShell({
    variant,
    title,
    description,
    children,
    headerRight,
}: DashboardShellProps) {
    return (
        <div
            className={clsx(
                'min-h-screen text-slate-100',
                'bg-slate-950',
                variantBackgrounds[variant]
            )}
        >
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-10 pt-6 lg:px-8">
                {/* Top header */}
                <header className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 lg:text-3xl">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1 text-sm text-slate-400">{description}</p>
                        )}
                    </div>
                    {headerRight && <div className="flex items-center gap-3">{headerRight}</div>}
                </header>

                {/* Glass panel content */}
                <main className="flex-1">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(15,23,42,0.7)] backdrop-blur-2xl lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
