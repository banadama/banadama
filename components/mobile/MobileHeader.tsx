// components/mobile/MobileHeader.tsx - Top Header
'use client';

import Link from 'next/link';

interface MobileHeaderProps {
    title: string;
    showBack?: boolean;
    backHref?: string;
    rightAction?: React.ReactNode;
}

export function MobileHeader({ title, showBack, backHref, rightAction }: MobileHeaderProps) {
    return (
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <Link href={backHref || '#'} className="text-slate-400 text-lg">
                            ←
                        </Link>
                    )}
                    <h1 className="text-lg font-semibold text-white">{title}</h1>
                </div>
                {rightAction && <div>{rightAction}</div>}
            </div>
        </header>
    );
}
