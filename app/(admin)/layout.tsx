export const dynamic = 'force-dynamic';
// app/(admin)/layout.tsx - Admin Base Layout (Logic only)
export const dynamic = 'force-dynamic';
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireRole(["ADMIN", "FINANCE_ADMIN"]);
    return <>{children}</>;
}
