// components/layout/MarketplaceDashboardShell.tsx
// Unified dashboard shell for all roles with header, sidebar, and content area
'use client';

import React, { useState } from 'react';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { RoleSidebar, UserRole, SupplierMode } from './RoleSidebar';

interface MarketplaceDashboardShellProps {
    children: React.ReactNode;
    role: UserRole;
    mode?: SupplierMode;
    verificationStatus?: 'draft' | 'submitted' | 'needs_review' | 'verified' | 'restricted';
    availableModes?: SupplierMode[];
    onModeChange?: (mode: SupplierMode) => void;
    cartCount?: number;
    userLocation?: string;
    showHeader?: boolean;
}

export function MarketplaceDashboardShell({
    children,
    role,
    mode,
    verificationStatus = 'verified',
    availableModes = [],
    onModeChange,
    cartCount = 0,
    userLocation,
    showHeader = true,
}: MarketplaceDashboardShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="mp-dashboard-shell">
            {/* Role-based Sidebar */}
            <RoleSidebar
                role={role}
                mode={mode}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                verificationStatus={verificationStatus}
                availableModes={availableModes}
                onModeChange={onModeChange}
            />

            {/* Main Content Area */}
            <div className="mp-dashboard-main">
                {/* Marketplace Header (optional) */}
                {showHeader && (
                    <MarketplaceHeader
                        onMenuToggle={toggleSidebar}
                        cartCount={cartCount}
                        userLocation={userLocation}
                    />
                )}

                {/* Page Content */}
                <main className="mp-dashboard-content">{children}</main>
            </div>
        </div>
    );
}

export default MarketplaceDashboardShell;
