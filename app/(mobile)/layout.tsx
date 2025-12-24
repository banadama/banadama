export const dynamic = 'force-dynamic';
// app/(mobile)/layout.tsx - Mobile Layout (Role-based)
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MobileNav } from '@/components/mobile/MobileNav';

export const metadata = {
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    themeColor: '#0f172a',
    manifest: '/manifest.json',
};

export default async function MobileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        redirect('/auth/login?mobile=1');
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Mobile-optimized container */}
            <div className="max-w-md mx-auto relative pb-20">
                {children}
            </div>
            <MobileNav />
        </div>
    );
}
