export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import {
    factoryNav,
    wholesalerNav,
    retailNav,
    creatorNav,
    affiliateNav,
} from "@/components/layout/nav.config";
import SidebarNav from '@/components/layout/SidebarNav';

type SupplierRole = 'FACTORY' | 'WHOLESALER' | 'RETAILER' | 'CREATOR' | 'AFFILIATE';

interface RoleConfig {
    title: string;
    subtitle: string;
    icon: string;
    primaryColor: string;
    accentColor: string;
    nav: typeof factoryNav;
}

/**
 * Dynamic Supplier Dashboard Layout
 * 
 * Provides role-specific layout with:
 * - Role-based sidebar navigation
 * - Dynamic color theming per role
 * - Responsive header with user menu
 * - Role-specific branding and icons
 * 
 * Supports 5 supplier types:
 * - FACTORY: Manufacturing & production
 * - WHOLESALER: Bulk distribution
 * - RETAILER: Store management
 * - CREATOR: Service/project delivery
 * - AFFILIATE: Commission-based promotion
 */
export default async function SupplierDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Require any supplier role
    const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER', 'CREATOR', 'AFFILIATE');
    const role = user.role as SupplierRole;

    // Map role to complete configuration
    const getRoleConfig = (role: SupplierRole): RoleConfig => {
        switch (role) {
            case 'FACTORY':
                return {
                    title: 'Factory Dashboard',
                    subtitle: 'Production & Manufacturing Management',
                    icon: '🏭',
                    primaryColor: '#1a3a2e',
                    accentColor: '#2d5a4a',
                    nav: factoryNav,
                };
            case 'WHOLESALER':
                return {
                    title: 'Wholesaler Dashboard',
                    subtitle: 'Bulk Distribution & Wholesale Management',
                    icon: '📦',
                    primaryColor: '#2d5a4a',
                    accentColor: '#3d7a5a',
                    nav: wholesalerNav,
                };
            case 'RETAILER':
                return {
                    title: 'Retailer Dashboard',
                    subtitle: 'Retail Store & Inventory Management',
                    icon: '🛍️',
                    primaryColor: '#1a4d3a',
                    accentColor: '#2d6a4f',
                    nav: retailNav,
                };
            case 'CREATOR':
                return {
                    title: 'Creator Dashboard',
                    subtitle: 'Projects & Portfolio Management',
                    icon: '🎨',
                    primaryColor: '#2d3d3a',
                    accentColor: '#3d5d4a',
                    nav: creatorNav,
                };
            case 'AFFILIATE':
                return {
                    title: 'Affiliate Dashboard',
                    subtitle: 'Commissions & Performance Tracking',
                    icon: '💰',
                    primaryColor: '#1a3a2e',
                    accentColor: '#2d5a4a',
                    nav: affiliateNav,
                };
            default:
                return {
                    title: 'Supplier Dashboard',
                    subtitle: 'Manage your supplier account',
                    icon: '📊',
                    primaryColor: '#1a3a2e',
                    accentColor: '#2d5a4a',
                    nav: factoryNav,
                };
        }
    };

    const config = getRoleConfig(role);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f1b16' }}>
            {/* Sidebar Navigation */}
            <aside style={{
                width: 280,
                backgroundColor: config.primaryColor,
                borderRight: `1px solid ${config.accentColor}`,
                position: 'fixed',
                height: '100vh',
                overflow: 'auto',
                paddingTop: '1rem',
            }}>
                {/* Sidebar Header with Role Icon & Title */}
                <div style={{ padding: '1rem', borderBottom: `1px solid ${config.accentColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{config.icon}</span>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>
                            {config.title.split(' ')[0]}
                        </h3>
                    </div>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                        {config.subtitle}
                    </p>
                </div>

                {/* Navigation Items */}
                {/* Client-side nav component highlights active item */}
                <SidebarNav items={config.nav} primaryColor={config.primaryColor} accentColor={config.accentColor} />

                {/* Sidebar Footer - User Info & Logout */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    padding: '1rem',
                    borderTop: `1px solid ${config.accentColor}`,
                    backgroundColor: config.primaryColor,
                }}>
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: `${config.accentColor}40`,
                        borderRadius: 6,
                        marginBottom: '0.75rem',
                    }}>
                        <p style={{ margin: '0 0 0.25rem 0', color: '#5bc5cf', fontSize: '0.8rem', fontWeight: 600 }}>
                            Logged in as
                        </p>
                        <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                            {user?.name || user?.email || 'User'}
                        </p>
                    </div>
                    <a
                        href="/api/auth/logout"
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.5rem',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: 4,
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
                        }}
                    >
                        Logout
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ marginLeft: 280, width: 'calc(100% - 280px)', display: 'flex', flexDirection: 'column' }}>
                {/* Top Header */}
                <header style={{
                    backgroundColor: '#1a2622',
                    borderBottom: `1px solid ${config.accentColor}`,
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>
                        <h1 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
                            {config.title}
                        </h1>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>
                            {config.subtitle}
                        </p>
                    </div>

                    {/* Header Right - Quick Actions */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(91, 197, 207, 0.1)',
                            border: '1px solid #5bc5cf',
                            color: '#5bc5cf',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                        }}>
                            📞 Support
                        </button>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: config.primaryColor,
                            border: '2px solid #5bc5cf',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                        }}>
                            {(user?.name || user?.email || 'U')[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
