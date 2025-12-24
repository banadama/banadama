export const dynamic = 'force-dynamic';
// app/(admin)/admin/finance/layout.tsx - Finance Section Layout
import { requireRole } from "@/lib/auth";

export default async function FinanceLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["ADMIN", "FINANCE_ADMIN"]);
  return <>{children}</>;
}
