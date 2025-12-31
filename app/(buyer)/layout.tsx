export const dynamic = 'force-dynamic';
// app/(buyer)/layout.tsx - Buyer Pages Layout
// NOTE: Buyers do NOT have a dashboard per spec
// This layout is for buyer account pages: orders, messages, wallet, etc.
// These pages are accessed via popover modal or direct links, NOT a dashboard layout

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
    // Buyers can access their account pages (orders, messages, etc)
    // No need for requireRole here - these are mostly public or checked at page level
    return <>{children}</>;
}

