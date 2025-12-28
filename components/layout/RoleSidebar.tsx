// components/layout/RoleSidebar.tsx
// Role-based sidebar with logo, navigation, mode switcher, and logout
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Icon components
const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
);

const OrdersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
);

const RFQIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <polyline points="10,9 9,9 8,9" />
    </svg>
);

const MessageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
);

const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16,17 21,12 16,7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

const VerifyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const ChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
);

const StoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
);

const CatalogIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
);

const WalletIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
);

const PortfolioIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const TicketIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
    </svg>
);

const FlagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
);

const CMSIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
);

const SwitchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
        <path d="m15 9 6-6" />
    </svg>
);

// Navigation configs by role
const buyerNavItems = [
    { href: '/buyer', label: 'Dashboard', icon: <HomeIcon /> },
    { href: '/buyer/orders', label: 'Orders', icon: <OrdersIcon /> },
    { href: '/buyer/rfq', label: 'My RFQs', icon: <RFQIcon /> },
    { href: '/buyer/messages', label: 'Messages', icon: <MessageIcon /> },
    { href: '/buyer/favorites', label: 'Favorites', icon: <HeartIcon /> },
];

const supplierNavItems = [
    { href: '/supplier', label: 'Dashboard', icon: <HomeIcon /> },
    { href: '/supplier/orders', label: 'Orders', icon: <OrdersIcon /> },
    { href: '/supplier/catalog', label: 'Catalog', icon: <CatalogIcon /> },
    { href: '/supplier/rfq', label: 'RFQ Inbox', icon: <RFQIcon /> },
    { href: '/supplier/analytics', label: 'Analytics', icon: <ChartIcon /> },
    { href: '/supplier/storefront', label: 'Storefront', icon: <StoreIcon /> },
    { href: '/supplier/messages', label: 'Messages', icon: <MessageIcon /> },
];

const creatorNavItems = [
    { href: '/creator', label: 'Dashboard', icon: <HomeIcon /> },
    { href: '/creator/orders', label: 'Orders', icon: <OrdersIcon /> },
    { href: '/creator/services', label: 'Services', icon: <CatalogIcon /> },
    { href: '/creator/portfolio', label: 'Portfolio', icon: <PortfolioIcon /> },
    { href: '/creator/earnings', label: 'Earnings', icon: <WalletIcon /> },
    { href: '/creator/messages', label: 'Messages', icon: <MessageIcon /> },
];

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: <HomeIcon /> },
    { href: '/admin/verification', label: 'Verification Queue', icon: <VerifyIcon /> },
    { href: '/admin/users', label: 'Users', icon: <UsersIcon /> },
    { href: '/admin/rfq', label: 'RFQ Moderation', icon: <RFQIcon /> },
    { href: '/admin/disputes', label: 'Disputes', icon: <TicketIcon /> },
    { href: '/admin/cms', label: 'CMS', icon: <CMSIcon /> },
    { href: '/admin/flags', label: 'Feature Flags', icon: <FlagIcon /> },
    { href: '/admin/analytics', label: 'Analytics', icon: <ChartIcon /> },
];

export type UserRole = 'buyer' | 'supplier' | 'creator' | 'admin' | 'ops';
export type SupplierMode = 'factory' | 'wholesaler' | 'retailer';

interface RoleSidebarProps {
    role: UserRole;
    mode?: SupplierMode;
    isOpen?: boolean;
    onClose?: () => void;
    verificationStatus?: 'draft' | 'submitted' | 'needs_review' | 'verified' | 'restricted';
    availableModes?: SupplierMode[];
    onModeChange?: (mode: SupplierMode) => void;
}

const roleLabels: Record<UserRole, string> = {
    buyer: 'Buyer',
    supplier: 'Seller Central',
    creator: 'Creator Studio',
    admin: 'Admin Panel',
    ops: 'Operations',
};

const modeLabels: Record<SupplierMode, string> = {
    factory: '🏭 Factory',
    wholesaler: '📦 Wholesaler',
    retailer: '🏪 Retailer',
};

const modeEmojis: Record<SupplierMode, string> = {
    factory: '🏭',
    wholesaler: '📦',
    retailer: '🏪',
};

export function RoleSidebar({
    role,
    mode,
    isOpen = true,
    onClose,
    verificationStatus = 'verified',
    availableModes = [],
    onModeChange,
}: RoleSidebarProps) {
    const pathname = usePathname();
    const [modeDropdownOpen, setModeDropdownOpen] = useState(false);

    // Get nav items based on role
    const getNavItems = () => {
        switch (role) {
            case 'buyer':
                return buyerNavItems;
            case 'supplier':
                return supplierNavItems;
            case 'creator':
                return creatorNavItems;
            case 'admin':
            case 'ops':
                return adminNavItems;
            default:
                return buyerNavItems;
        }
    };

    const navItems = getNavItems();

    // Verification badge color
    const getVerificationBadge = () => {
        switch (verificationStatus) {
            case 'verified':
                return { label: 'Verified', color: 'bg-green-500/20 text-green-400' };
            case 'submitted':
                return { label: 'Under Review', color: 'bg-yellow-500/20 text-yellow-400' };
            case 'needs_review':
                return { label: 'Action Needed', color: 'bg-red-500/20 text-red-400' };
            case 'restricted':
                return { label: 'Restricted', color: 'bg-red-500/20 text-red-400' };
            default:
                return { label: 'Incomplete', color: 'bg-gray-500/20 text-gray-400' };
        }
    };

    const verificationBadge = getVerificationBadge();

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={clsx('mp-sidebar-overlay', { open: isOpen })}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={clsx('mp-sidebar', { open: isOpen })}>
                {/* Logo */}
                <div className="mp-sidebar-logo">
                    <img src="/logo-banadama.svg" alt="Banadama" />
                    <span className="mp-sidebar-brand">Banadama</span>
                </div>

                {/* Mode Switcher (for suppliers) */}
                {role === 'supplier' && mode && availableModes.length > 0 && (
                    <div className="mp-mode-switcher">
                        <div className="mp-mode-current">
                            <span>Current Mode:</span>
                        </div>
                        <div className="mp-mode-value">
                            <span>{modeEmojis[mode]}</span>
                            <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
                        </div>
                        {availableModes.length > 1 && (
                            <select
                                className="mp-mode-dropdown"
                                value={mode}
                                onChange={(e) => onModeChange?.(e.target.value as SupplierMode)}
                            >
                                {availableModes.map((m) => (
                                    <option key={m} value={m}>
                                        Switch to {modeLabels[m]}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <nav className="mp-sidebar-nav">
                    <div className="mp-sidebar-section">
                        <div className="mp-sidebar-section-title">{roleLabels[role]}</div>

                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx('mp-sidebar-link', { active: isActive })}
                                >
                                    <span className="mp-sidebar-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Verification Link (for suppliers/creators) */}
                    {(role === 'supplier' || role === 'creator') && (
                        <div className="mp-sidebar-section">
                            <Link
                                href={`/${role}/verification`}
                                className={clsx('mp-sidebar-link', {
                                    active: pathname.includes('/verification'),
                                })}
                            >
                                <span className="mp-sidebar-icon">
                                    <VerifyIcon />
                                </span>
                                <span>Verification</span>
                                <span
                                    className={clsx(
                                        'mp-sidebar-badge',
                                        verificationBadge.color
                                    )}
                                >
                                    {verificationBadge.label}
                                </span>
                            </Link>
                        </div>
                    )}

                    {/* Settings */}
                    <div className="mp-sidebar-section">
                        <Link
                            href={`/${role}/settings`}
                            className={clsx('mp-sidebar-link', {
                                active: pathname.includes('/settings'),
                            })}
                        >
                            <span className="mp-sidebar-icon">
                                <SettingsIcon />
                            </span>
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>

                {/* Footer */}
                <div className="mp-sidebar-footer">
                    <button className="mp-sidebar-logout" onClick={() => console.log('logout')}>
                        <LogoutIcon />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default RoleSidebar;
