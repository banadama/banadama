// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    { href: '/admin/dashboard', label: 'Overview' },
    { href: '/admin/creators', label: 'Creators' },
    { href: '/admin/suppliers', label: 'Suppliers' },
    { href: '/admin/verifications', label: 'Verifications' },
    { href: '/admin/payouts', label: 'Payouts' },
    { href: '/admin/reports', label: 'Reports' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-60 shrink-0 flex-col gap-2 pr-4 text-sm text-slate-200 lg:flex">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Admin Center
            </div>
            <nav className="space-y-1">
                {links.map((link) => {
                    const active = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                'flex items-center justify-between rounded-2xl px-3 py-2 transition-all',
                                'border border-transparent bg-white/5 hover:border-orange-400/60 hover:bg-white/10',
                                active &&
                                'border-orange-400/80 bg-orange-500/10 text-orange-300 shadow-[0_0_18px_rgba(249,115,22,0.5)]'
                            )}
                        >
                            <span className="truncate">{link.label}</span>
                            {active && (
                                <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
