import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

type SupplierRole = 'FACTORY' | 'WHOLESALER' | 'RETAILER' | 'CREATOR' | 'AFFILIATE';

interface DashboardContent {
    title: string;
    subtitle: string;
    headerColor: string;
    stats: { label: string; value: string | number; icon: string }[];
    menuItems: { icon: string; title: string; description: string; href: string }[];
}

/**
 * Unified dashboard for all supplier roles.
 * Content dynamically rendered based on user.role from session/auth.
 */
export default async function SupplierDashboardPage() {
    const user = await getCurrentUser();
    
    if (!user || !user.role) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Authentication required</div>;
    }

    // Map role to dashboard configuration
    const getDashboardContent = (role: SupplierRole): DashboardContent => {
        switch (role) {
            case 'FACTORY':
                return {
                    title: 'Factory Dashboard',
                    subtitle: 'Manage production, capacity, and manufacturing orders',
                    headerColor: '#1a3a2e',
                    stats: [
                        { label: 'Active Orders', value: 24, icon: '📦' },
                        { label: 'Capacity Utilization', value: '85%', icon: '🏭' },
                        { label: 'SKUs in Stock', value: 156, icon: '📊' },
                        { label: 'Monthly Revenue', value: '₦125,000', icon: '💰' },
                    ],
                    menuItems: [
                        { icon: '🏠', title: 'Dashboard', description: 'Production overview', href: '/supplier/dashboard' },
                        { icon: '📦', title: 'Orders', description: 'Manufacturing & bulk orders', href: '/supplier/orders' },
                        { icon: '🏭', title: 'Production Capacity', description: 'Machine availability & workforce', href: '/supplier/capacity' },
                        { icon: '📊', title: 'Inventory Levels', description: 'Raw materials & finished goods', href: '/supplier/inventory' },
                        { icon: '🎨', title: 'Product Catalog', description: 'Products you manufacture', href: '/supplier/products' },
                        { icon: '💰', title: 'Pricing & MOQ', description: 'Bulk pricing tiers', href: '/supplier/pricing' },
                        { icon: '🚚', title: 'Shipping & Logistics', description: 'Export documentation', href: '/supplier/logistics' },
                        { icon: '📄', title: 'Certifications', description: 'Quality certificates & licenses', href: '/supplier/certifications' },
                        { icon: '💬', title: 'Messages', description: 'Communication hub', href: '/supplier/messages' },
                        { icon: '📈', title: 'Analytics', description: 'Production efficiency', href: '/supplier/analytics' },
                        { icon: '⚙️', title: 'Settings', description: 'Profile & preferences', href: '/supplier/settings' },
                    ],
                };

            case 'WHOLESALER':
                return {
                    title: 'Wholesaler Dashboard',
                    subtitle: 'Manage wholesale distribution and inventory',
                    headerColor: '#2d5a4a',
                    stats: [
                        { label: 'Monthly Sales', value: '₦425,000', icon: '💳' },
                        { label: 'SKUs in Stock', value: 892, icon: '📊' },
                        { label: 'Active Orders', value: 34, icon: '📦' },
                        { label: 'Inventory Turnover', value: '4.2x', icon: '🔄' },
                    ],
                    menuItems: [
                        { icon: '🏠', title: 'Dashboard', description: 'Sales & inventory overview', href: '/supplier/dashboard' },
                        { icon: '📦', title: 'Orders', description: 'Wholesale orders & requests', href: '/supplier/orders' },
                        { icon: '📊', title: 'Inventory Levels', description: 'Stock levels & warehouse', href: '/supplier/inventory' },
                        { icon: '🛍️', title: 'Product Catalog', description: 'Products for wholesale', href: '/supplier/products' },
                        { icon: '💰', title: 'Pricing Tiers', description: 'Bulk pricing & discounts', href: '/supplier/pricing' },
                        { icon: '🚚', title: 'Delivery Zones', description: 'Coverage areas', href: '/supplier/delivery-zones' },
                        { icon: '🏭', title: 'Supplier Network', description: 'Connected factories', href: '/supplier/suppliers' },
                        { icon: '💬', title: 'Messages', description: 'Retailer communication', href: '/supplier/messages' },
                        { icon: '📈', title: 'Sales Analytics', description: 'Best sellers & trends', href: '/supplier/sales-analytics' },
                        { icon: '💳', title: 'Payments', description: 'Invoices & tracking', href: '/supplier/payments' },
                        { icon: '⚙️', title: 'Settings', description: 'Profile & banking', href: '/supplier/settings' },
                    ],
                };

            case 'RETAILER':
                return {
                    title: 'Retailer Dashboard',
                    subtitle: 'Manage your retail operations and sales',
                    headerColor: '#1a4d3a',
                    stats: [
                        { label: 'Daily Sales', value: '₦145,000', icon: '💰' },
                        { label: 'In-Store SKUs', value: 523, icon: '📊' },
                        { label: 'Restock Orders', value: 18, icon: '📦' },
                        { label: 'Store Locations', value: 3, icon: '📍' },
                    ],
                    menuItems: [
                        { icon: '🏠', title: 'Dashboard', description: 'Daily sales overview', href: '/supplier/dashboard' },
                        { icon: '📦', title: 'Orders', description: 'Customer & restock orders', href: '/supplier/orders' },
                        { icon: '🛍️', title: 'Product Catalog', description: 'Products for retail', href: '/supplier/products' },
                        { icon: '📊', title: 'Inventory', description: 'Stock levels & alerts', href: '/supplier/inventory' },
                        { icon: '🛒', title: 'Purchase Orders', description: 'Orders to suppliers', href: '/supplier/purchase-orders' },
                        { icon: '💰', title: 'Pricing', description: 'Retail prices & margins', href: '/supplier/pricing' },
                        { icon: '📍', title: 'Store Locations', description: 'Physical store addresses', href: '/supplier/locations' },
                        { icon: '💬', title: 'Messages', description: 'Customer & supplier comms', href: '/supplier/messages' },
                        { icon: '📈', title: 'Sales Reports', description: 'Daily/weekly/monthly performance', href: '/supplier/sales-reports' },
                        { icon: '💳', title: 'Payments', description: 'POS & payment methods', href: '/supplier/payments' },
                        { icon: '⚙️', title: 'Settings', description: 'Store profile', href: '/supplier/settings' },
                    ],
                };

            case 'CREATOR':
                return {
                    title: 'Creator Dashboard',
                    subtitle: 'Manage projects, portfolio, and earnings',
                    headerColor: '#2d3d3a',
                    stats: [
                        { label: 'Active Projects', value: 5, icon: '💼' },
                        { label: 'Total Earnings', value: '₦85,000', icon: '💳' },
                        { label: 'Avg Rating', value: '4.8⭐', icon: '⭐' },
                        { label: 'Completed', value: 23, icon: '✅' },
                    ],
                    menuItems: [
                        { icon: '🏠', title: 'Dashboard', description: 'Projects & earnings', href: '/supplier/dashboard' },
                        { icon: '💼', title: 'Projects', description: 'Active, completed, pending', href: '/supplier/projects' },
                        { icon: '🎨', title: 'Portfolio', description: 'Showcase your work', href: '/supplier/portfolio' },
                        { icon: '💰', title: 'Services & Pricing', description: 'Service packages & rates', href: '/supplier/services' },
                        { icon: '📅', title: 'Availability Calendar', description: 'Project slots & deadlines', href: '/supplier/availability' },
                        { icon: '📂', title: 'File Delivery', description: 'Upload deliverables', href: '/supplier/deliverables' },
                        { icon: '💬', title: 'Messages', description: 'Client communication', href: '/supplier/messages' },
                        { icon: '⭐', title: 'Reviews & Ratings', description: 'Client feedback', href: '/supplier/reviews' },
                        { icon: '💳', title: 'Earnings', description: 'Payment history', href: '/supplier/earnings' },
                        { icon: '📚', title: 'Resources', description: 'Design assets', href: '/supplier/resources' },
                        { icon: '🌍', title: 'Service Area', description: 'Geographic restrictions', href: '/supplier/service-area' },
                        { icon: '⚙️', title: 'Settings', description: 'Profile & skills', href: '/supplier/settings' },
                    ],
                };

            case 'AFFILIATE':
                return {
                    title: 'Affiliate Dashboard',
                    subtitle: 'Track commissions and marketing performance',
                    headerColor: '#1a3a2e',
                    stats: [
                        { label: 'Total Commissions', value: '₦42,500', icon: '💰' },
                        { label: 'Clicks This Month', value: 1250, icon: '🔗' },
                        { label: 'Conversion Rate', value: '3.2%', icon: '📊' },
                        { label: 'Active Campaigns', value: 7, icon: '📈' },
                    ],
                    menuItems: [
                        { icon: '🏠', title: 'Dashboard', description: 'Commissions & clicks', href: '/supplier/dashboard' },
                        { icon: '🔗', title: 'Affiliate Links', description: 'Generate product links', href: '/supplier/links' },
                        { icon: '📊', title: 'Performance', description: 'CTR & analytics', href: '/supplier/performance' },
                        { icon: '💰', title: 'Commissions', description: 'Earnings breakdown', href: '/supplier/commissions' },
                        { icon: '🛍️', title: 'Product Catalog', description: 'Browse products', href: '/supplier/products' },
                        { icon: '📈', title: 'Campaign Analytics', description: 'Track campaigns', href: '/supplier/campaigns' },
                        { icon: '💬', title: 'Messages', description: 'Supplier communication', href: '/supplier/messages' },
                        { icon: '📚', title: 'Marketing Materials', description: 'Banners & descriptions', href: '/supplier/marketing' },
                        { icon: '💳', title: 'Payouts', description: 'Withdrawal history', href: '/supplier/payouts' },
                        { icon: '⚙️', title: 'Settings', description: 'Profile & payment', href: '/supplier/settings' },
                    ],
                };

            default:
                return {
                    title: 'Dashboard',
                    subtitle: 'Welcome to your dashboard',
                    headerColor: '#1a3a2e',
                    stats: [],
                    menuItems: [],
                };
        }
    };

    // Map role to dashboard configuration
    const content = getDashboardContent(user.role as SupplierRole);

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Hero Section */}
            <div style={{ backgroundColor: headerColor, padding: '2rem', borderRadius: 12, textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                    {title}
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>
                    {subtitle}
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} style={{
                        backgroundColor: '#1a2622',
                        border: '1px solid #4b5563',
                        padding: '1.5rem',
                        borderRadius: 8,
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                        <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '0.5rem' }}>{stat.label}</p>
                        <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#5bc5cf' }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Management Tools */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
                Management Tools
            </h2>

            {/* Action Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {menuItems.map((item, idx) => (
                    <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: '#0f1b16',
                            border: '1px solid #4b5563',
                            padding: '1.5rem',
                            borderRadius: 8,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            height: '100%'
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            el.style.backgroundColor = '#1a2622';
                            el.style.borderColor = '#5bc5cf';
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            el.style.backgroundColor = '#0f1b16';
                            el.style.borderColor = '#4b5563';
                        }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
                                {item.title}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#a0aec0' }}>
                                {item.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
