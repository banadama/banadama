// components/layout/nav.config.tsx - Centralized Navigation Config with SVG Icons
import React from "react";
import type { NavItem } from "./SideNav";
import { Icons } from "../icons/icons";

/** Public links - shown in header/footer */
export const publicNav: NavItem[] = [
    { href: "/marketplace", label: "Marketplace", icon: <Icons.Marketplace /> },
    { href: "/near-me", label: "Buy Near Me", icon: <Icons.Location /> },
    { href: "/global", label: "Global Market", icon: <Icons.Globe /> },
    { href: "/creators", label: "Creators", icon: <Icons.Brush /> },
];

// DEPRECATED: Buyers do NOT have dashboards per spec
// Use buyer popover modal auth instead
// This nav is kept for reference but should not be used
// export const buyerNav: NavItem[] = [...]

export const opsNav: NavItem[] = [
    { href: "/ops/overview", label: "Overview", icon: <Icons.Grid /> },
    { href: "/ops/rfq-assignments", label: "RFQ Assignments", icon: <Icons.RFQ /> },
    { href: "/ops/buyer-requests", label: "RFQ Queue", icon: <Icons.Quote /> },
    { href: "/ops/orders", label: "Orders", icon: <Icons.Orders /> },
    { href: "/ops/logistics", label: "Logistics", icon: <Icons.Truck /> },
    { href: "/ops/supplier-performance", label: "Supplier Performance", icon: <Icons.TrendingUp /> },
    { href: "/ops/international-orders", label: "International", icon: <Icons.Globe /> },
    { href: "/ops/verifications", label: "Verifications", icon: <Icons.Shield /> },
    { href: "/ops/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/ops/disputes", label: "Disputes", icon: <Icons.Warning /> },
    { href: "/ops/dispute-inbox", label: "Dispute Inbox", icon: <Icons.Chat /> },
    { href: "/ops/creator-disputes", label: "Creator Disputes", icon: <Icons.ShieldCheck /> },
    { href: "/ops/settings", label: "Settings", icon: <Icons.Settings /> },
];

export const factoryNav: NavItem[] = [
    { href: "/factory/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/factory/orders", label: "Orders", icon: <Icons.Package /> },
    { href: "/factory/capacity", label: "Production Capacity", icon: <Icons.TrendingUp /> },
    { href: "/factory/inventory", label: "Inventory Levels", icon: <Icons.Stock /> },
    { href: "/factory/products", label: "Product Catalog", icon: <Icons.Product /> },
    { href: "/factory/pricing", label: "Pricing & MOQ", icon: <Icons.Receipt /> },
    { href: "/factory/logistics", label: "Shipping & Logistics", icon: <Icons.Truck /> },
    { href: "/factory/certifications", label: "Certifications", icon: <Icons.Shield /> },
    { href: "/factory/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/factory/analytics", label: "Analytics", icon: <Icons.TrendingUp /> },
    { href: "/factory/settings", label: "Settings", icon: <Icons.Settings /> },
];

export const wholesalerNav: NavItem[] = [
    { href: "/wholesaler/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/wholesaler/orders", label: "Orders", icon: <Icons.Orders /> },
    { href: "/wholesaler/inventory", label: "Inventory Levels", icon: <Icons.Stock /> },
    { href: "/wholesaler/products", label: "Product Catalog", icon: <Icons.Product /> },
    { href: "/wholesaler/pricing", label: "Pricing Tiers", icon: <Icons.Receipt /> },
    { href: "/wholesaler/delivery-zones", label: "Delivery Zones", icon: <Icons.Truck /> },
    { href: "/wholesaler/suppliers", label: "Supplier Network", icon: <Icons.Users /> },
    { href: "/wholesaler/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/wholesaler/sales-analytics", label: "Sales Analytics", icon: <Icons.TrendingUp /> },
    { href: "/wholesaler/payments", label: "Payments", icon: <Icons.Wallet /> },
    { href: "/wholesaler/settings", label: "Settings", icon: <Icons.Settings /> },
];

export const retailNav: NavItem[] = [
    { href: "/retailer/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/retailer/orders", label: "Orders", icon: <Icons.Orders /> },
    { href: "/retailer/products", label: "Product Catalog", icon: <Icons.Product /> },
    { href: "/retailer/inventory", label: "Inventory", icon: <Icons.Stock /> },
    { href: "/retailer/purchase-orders", label: "Purchase Orders", icon: <Icons.ShoppingCart /> },
    { href: "/retailer/pricing", label: "Pricing", icon: <Icons.Receipt /> },
    { href: "/retailer/locations", label: "Store Locations", icon: <Icons.Location /> },
    { href: "/retailer/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/retailer/sales-reports", label: "Sales Reports", icon: <Icons.TrendingUp /> },
    { href: "/retailer/payments", label: "Payments", icon: <Icons.Wallet /> },
    { href: "/retailer/settings", label: "Settings", icon: <Icons.Settings /> },
];

export const creatorNav: NavItem[] = [
    { href: "/creator/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/creator/projects", label: "Projects", icon: <Icons.Briefcase /> },
    { href: "/creator/portfolio", label: "Portfolio", icon: <Icons.Image /> },
    { href: "/creator/services", label: "Services & Pricing", icon: <Icons.Receipt /> },
    { href: "/creator/availability", label: "Availability Calendar", icon: <Icons.Calendar /> },
    { href: "/creator/deliverables", label: "File Delivery", icon: <Icons.FileText /> },
    { href: "/creator/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/creator/reviews", label: "Reviews & Ratings", icon: <Icons.Star /> },
    { href: "/creator/earnings", label: "Earnings", icon: <Icons.Wallet /> },
    { href: "/creator/resources", label: "Resources", icon: <Icons.Library /> },
    { href: "/creator/service-area", label: "Service Area", icon: <Icons.Globe /> },
    { href: "/creator/settings", label: "Settings", icon: <Icons.Settings /> },
];

export const affiliateNav: NavItem[] = [
    { href: "/affiliate/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/affiliate/links", label: "Affiliate Links", icon: <Icons.Link /> },
    { href: "/affiliate/performance", label: "Performance", icon: <Icons.TrendingUp /> },
    { href: "/affiliate/commissions", label: "Commissions", icon: <Icons.Receipt /> },
    { href: "/affiliate/products", label: "Product Catalog", icon: <Icons.Product /> },
    { href: "/affiliate/campaigns", label: "Campaign Analytics", icon: <Icons.BarChart /> },
    { href: "/affiliate/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/affiliate/marketing", label: "Marketing Materials", icon: <Icons.Image /> },
    { href: "/affiliate/payouts", label: "Payouts", icon: <Icons.Wallet /> },
    { href: "/affiliate/settings", label: "Settings", icon: <Icons.Settings /> },
];

export const supplierNav: NavItem[] = [
    { href: "/supplier/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/supplier/products", label: "Products", icon: <Icons.Product /> },
    { href: "/supplier/rfqs", label: "RFQs", icon: <Icons.RFQ /> },
    { href: "/supplier/orders", label: "Orders", icon: <Icons.Orders /> },
    { href: "/supplier/shipments", label: "Shipments", icon: <Icons.Truck /> },
    { href: "/supplier/wallet", label: "Wallet", icon: <Icons.Wallet /> },
    { href: "/supplier/messages", label: "Messages", icon: <Icons.Message /> },
];

export const growthNav: NavItem[] = [
    { href: "/growth/dashboard", label: "Dashboard", icon: <Icons.TrendingUp /> },
    { href: "/growth/onboard-supplier", label: "Onboard Supplier", icon: <Icons.Users /> },
    { href: "/growth/my-suppliers", label: "My Suppliers", icon: <Icons.Product /> },
    { href: "/growth/earnings", label: "Earnings", icon: <Icons.Bank /> },
];

export const adminStudioNav: NavItem[] = [
    { href: "/admin/overview", label: "Overview", icon: <Icons.ShieldAdmin /> },
    { href: "/admin/users", label: "Users", icon: <Icons.Users /> },
    { href: "/admin/accounts", label: "Accounts", icon: <Icons.Key /> },
    { href: "/admin/verifications", label: "Verifications", icon: <Icons.Shield /> },
    { href: "/admin/products", label: "Products", icon: <Icons.Product /> },
    { href: "/admin/categories", label: "Categories", icon: <Icons.Tag /> },
    { href: "/admin/creators", label: "Creators", icon: <Icons.Brush /> },
    { href: "/admin/locations", label: "Locations", icon: <Icons.MapPin /> },
    { href: "/admin/features", label: "Features", icon: <Icons.Settings /> },
    { href: "/admin/settings", label: "Settings", icon: <Icons.Settings /> },
    { href: "/admin/market-control", label: "Market Control", icon: <Icons.Marketplace /> },
    { href: "/admin/trade-control", label: "Trade Control", icon: <Icons.Globe /> },
    { href: "/admin/growth-settings", label: "Growth", icon: <Icons.TrendingUp /> },
    { href: "/admin/affiliate-settings", label: "Affiliate", icon: <Icons.Link /> },
    { href: "/admin/wholesalers", label: "Wholesalers", icon: <Icons.Product /> },
    { href: "/admin/admins", label: "Admins", icon: <Icons.Key /> },
    { href: "/admin/audit-log", label: "Audit Log", icon: <Icons.Audit /> },
];

export const financeAdminNav: NavItem[] = [
    { href: "/admin/finance/dashboard", label: "Finance Dashboard", icon: <Icons.Bank /> },
    { href: "/admin/finance/escrow", label: "Escrow", icon: <Icons.Lock /> },
    { href: "/admin/finance/payouts", label: "Payouts", icon: <Icons.Bank /> },
    { href: "/admin/finance/refunds", label: "Refunds", icon: <Icons.Receipt /> },
    { href: "/admin/finance/wallets", label: "Wallets", icon: <Icons.Wallet /> },
    { href: "/admin/finance/ledger", label: "Ledger", icon: <Icons.Receipt /> },
    { href: "/admin/finance/reports", label: "Reports", icon: <Icons.TrendingUp /> },
];

export const analyticsNav: NavItem[] = [
    { href: "/admin/analytics/market", label: "Market", icon: <Icons.TrendingUp /> },
    { href: "/admin/analytics/suppliers", label: "Suppliers", icon: <Icons.Product /> },
    { href: "/admin/analytics/buyers", label: "Buyers", icon: <Icons.Users /> },
    { href: "/admin/analytics/ops", label: "Ops", icon: <Icons.Grid /> },
    { href: "/admin/analytics/finance", label: "Finance", icon: <Icons.Bank /> },
    { href: "/admin/analytics/insights", label: "AI Insights", icon: <Icons.TrendingUp /> },
];
