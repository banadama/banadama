// components/mobile/MobileNav.tsx - Bottom Navigation
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

const OPS_NAV: NavItem[] = [
    { href: '/mobile/ops/dashboard', label: 'Home', icon: '🏠' },
    { href: '/mobile/ops/rfqs', label: 'RFQs', icon: '📋' },
    { href: '/mobile/ops/orders', label: 'Orders', icon: '📦' },
    { href: '/mobile/ops/logistics', label: 'Delivery', icon: '🚚' },
    { href: '/mobile/ops/messages', label: 'Chat', icon: '💬' },
];

const SUPPLIER_NAV: NavItem[] = [
    { href: '/mobile/supplier/dashboard', label: 'Home', icon: '🏠' },
    { href: '/mobile/supplier/orders', label: 'Orders', icon: '📦' },
    { href: '/mobile/supplier/messages', label: 'Chat', icon: '💬' },
    { href: '/mobile/supplier/wallet', label: 'Wallet', icon: '💰' },
];

const GROWTH_NAV: NavItem[] = [
    { href: '/mobile/growth/dashboard', label: 'Home', icon: '🏠' },
    { href: '/mobile/growth/onboard', label: 'Onboard', icon: '➕' },
    { href: '/mobile/growth/suppliers', label: 'Suppliers', icon: '🏭' },
    { href: '/mobile/growth/earnings', label: 'Earnings', icon: '💰' },
];

const BUYER_NAV: NavItem[] = [
    { href: '/mobile/buyer/marketplace', label: 'Shop', icon: '🛒' },
    { href: '/mobile/buyer/orders', label: 'Orders', icon: '📦' },
    { href: '/mobile/buyer/messages', label: 'Chat', icon: '💬' },
    { href: '/mobile/buyer/account', label: 'Account', icon: '👤' },
];

export function MobileNav() {
    const pathname = usePathname();
    const [navItems, setNavItems] = useState<NavItem[]>([]);

    useEffect(() => {
        // Determine nav based on current path
        if (pathname.startsWith('/mobile/ops')) {
            setNavItems(OPS_NAV);
        } else if (pathname.startsWith('/mobile/supplier')) {
            setNavItems(SUPPLIER_NAV);
        } else if (pathname.startsWith('/mobile/growth')) {
            setNavItems(GROWTH_NAV);
        } else if (pathname.startsWith('/mobile/buyer')) {
            setNavItems(BUYER_NAV);
        }
    }, [pathname]);

    if (navItems.length === 0) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 safe-area-pb">
            <div className="max-w-md mx-auto flex justify-around py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center py-1 px-3 rounded-lg ${isActive ? 'text-blue-400' : 'text-slate-400'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-xs mt-0.5">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
