// components/admin/AdminTopbar.tsx
'use client';

import React from 'react';

export function AdminTopbar() {
    return (
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm backdrop-blur-xl">
            <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-orange-500/20 text-lg font-bold text-orange-300 shadow-[0_0_18px_rgba(249,115,22,0.7)]">
                    B
                </span>
                <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Banadama
                    </div>
                    <div className="text-sm font-medium text-slate-100">
                        Admin Control Center
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="hidden sm:inline">Trade with no regret.</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
                <span>Online</span>
            </div>
        </header>
    );
}
