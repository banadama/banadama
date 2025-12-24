export const dynamic = 'force-dynamic';
// app/(supplier)/layout.tsx
export const dynamic = 'force-dynamic';
import React from 'react';
import { requireRole } from '@/lib/auth';
import { DashboardShell } from "@/components/layout/DashboardShell";
import { supplierNav } from "@/components/layout/nav.config";

export default async function SupplierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 🔐 Allow SUPPLIER, FACTORY, or WHOLESALER roles
    await requireRole(['SUPPLIER', 'FACTORY', 'WHOLESALER']);

    return (
        <DashboardShell title="Supplier Studio" nav={supplierNav}>
            {children}
        </DashboardShell>
    );
}
