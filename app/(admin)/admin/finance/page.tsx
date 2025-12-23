// app/(admin)/admin/finance/page.tsx - Finance Index (redirect to dashboard)
import { redirect } from 'next/navigation';

export default function FinanceIndexPage() {
    redirect('/admin/finance/dashboard');
}
