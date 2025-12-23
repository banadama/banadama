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

export const buyerNav: NavItem[] = [
    { href: "/buyer/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/buyer/requests", label: "RFQs", icon: <Icons.RFQ /> },
    { href: "/buyer/orders", label: "Orders", icon: <Icons.Orders /> },
    { href: "/buyer/wallet", label: "Wallet", icon: <Icons.Wallet /> },
    { href: "/buyer/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/buyer/settings", label: "Settings", icon: <Icons.Settings /> },
];

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
    { href: "/factory/rfqs", label: "RFQs", icon: <Icons.RFQ /> },
    { href: "/factory/orders", label: "Orders", icon: <Icons.Package /> },
    { href: "/factory/capabilities", label: "Capabilities", icon: <Icons.Capabilities /> },
    { href: "/factory/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/factory/wallet", label: "Wallet", icon: <Icons.Wallet /> },
];

export const wholesalerNav: NavItem[] = [
    { href: "/wholesaler/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/wholesaler/products", label: "Products", icon: <Icons.Product /> },
    { href: "/wholesaler/stock", label: "Stock", icon: <Icons.Stock /> },
    { href: "/wholesaler/orders", label: "Orders", icon: <Icons.Orders /> },
    { href: "/wholesaler/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/wholesaler/wallet", label: "Wallet", icon: <Icons.Wallet /> },
];

export const retailNav: NavItem[] = [
    { href: "/retail/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/retail/products", label: "Products", icon: <Icons.Product /> },
    { href: "/retail/stock", label: "Stock", icon: <Icons.Stock /> },
    { href: "/retail/orders", label: "Orders", icon: <Icons.Orders /> },
    { href: "/retail/messages", label: "Messages", icon: <Icons.Message /> },
    { href: "/retail/wallet", label: "Wallet", icon: <Icons.Wallet /> },
];

export const creatorNav: NavItem[] = [
    { href: "/creator/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/creator/jobs", label: "Local Jobs", icon: <Icons.Location /> },
    { href: "/creator/products", label: "Digital Products", icon: <Icons.Product /> },
    { href: "/creator/wallet", label: "Wallet", icon: <Icons.Wallet /> },
    { href: "/creator/messages", label: "Messages", icon: <Icons.Message /> },
];

export const affiliateNav: NavItem[] = [
    { href: "/affiliate/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/affiliate/links", label: "Links", icon: <Icons.Link /> },
    { href: "/affiliate/sales", label: "Sales", icon: <Icons.Receipt /> },
    { href: "/affiliate/earnings", label: "Earnings", icon: <Icons.Bank /> },
    { href: "/affiliate/withdraw", label: "Withdraw", icon: <Icons.Wallet /> },
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
