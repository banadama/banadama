// components/layout/nav.admin.final.tsx - Final Admin Navigation
import React from "react";
import type { NavItem } from "./nav.types";
import { Icons } from "../icons/icons";

/**
 * BANADAMA ADMIN NAV (FINAL)
 * - Single Admin area: /admin/*
 * - Studio lives under /admin/studio/*
 * - Finance lives under /admin/finance/*
 * - No emojis, SVG icons only
 */
export const adminNav: NavItem[] = [
    { href: "/admin/overview", label: "Overview", icon: <Icons.ShieldAdmin /> },

    // Studio (admin-only controls)
    { href: "/admin/users", label: "Users", icon: <Icons.Users /> },
    { href: "/admin/accounts", label: "Accounts", icon: <Icons.Key /> },
    { href: "/admin/verifications", label: "Verifications", icon: <Icons.Shield /> },
    { href: "/admin/products", label: "Products", icon: <Icons.Product /> },
    { href: "/admin/categories", label: "Categories", icon: <Icons.Tag /> },
    { href: "/admin/locations", label: "Locations", icon: <Icons.MapPin /> },
    { href: "/admin/features", label: "Features", icon: <Icons.Settings /> },
    { href: "/admin/market-control", label: "Market Control", icon: <Icons.Marketplace /> },
    { href: "/admin/trade-control", label: "Trade Control", icon: <Icons.Globe /> },
    { href: "/admin/audit-log", label: "Audit Log", icon: <Icons.Audit /> },
    { href: "/admin/settings", label: "Settings", icon: <Icons.Settings /> },

    // Finance (under admin umbrella)
    { href: "/admin/finance/dashboard", label: "Finance Dashboard", icon: <Icons.Bank /> },
    { href: "/admin/finance/escrow", label: "Escrow", icon: <Icons.Lock /> },
    { href: "/admin/finance/payouts", label: "Payouts", icon: <Icons.Bank /> },
    { href: "/admin/finance/refunds", label: "Refunds", icon: <Icons.Receipt /> },
    { href: "/admin/finance/wallets", label: "Wallets", icon: <Icons.Wallet /> },
    { href: "/admin/finance/ledger", label: "Ledger", icon: <Icons.Receipt /> },
];

/**
 * Studio-only nav (for studio layout)
 */
export const studioNav: NavItem[] = [
    { href: "/admin/overview", label: "Overview", icon: <Icons.ShieldAdmin /> },
    { href: "/admin/studio/users", label: "Users", icon: <Icons.Users /> },
    { href: "/admin/studio/accounts", label: "Accounts", icon: <Icons.Key /> },
    { href: "/admin/studio/verifications", label: "Verifications", icon: <Icons.Shield /> },
    { href: "/admin/studio/products", label: "Products", icon: <Icons.Product /> },
    { href: "/admin/studio/categories", label: "Categories", icon: <Icons.Tag /> },
    { href: "/admin/studio/locations", label: "Locations", icon: <Icons.MapPin /> },
    { href: "/admin/studio/features", label: "Features", icon: <Icons.Settings /> },
    { href: "/admin/studio/market-control", label: "Market Control", icon: <Icons.Marketplace /> },
    { href: "/admin/studio/trade-control", label: "Trade Control", icon: <Icons.Globe /> },
    { href: "/admin/studio/audit-log", label: "Audit Log", icon: <Icons.Audit /> },
    { href: "/admin/studio/settings", label: "Settings", icon: <Icons.Settings /> },
];

/**
 * Finance-only nav (for finance layout)
 */
export const financeNav: NavItem[] = [
    { href: "/admin/overview", label: "Overview", icon: <Icons.ShieldAdmin /> },
    { href: "/admin/finance/dashboard", label: "Finance Dashboard", icon: <Icons.Bank /> },
    { href: "/admin/finance/escrow", label: "Escrow", icon: <Icons.Lock /> },
    { href: "/admin/finance/payouts", label: "Payouts", icon: <Icons.Bank /> },
    { href: "/admin/finance/refunds", label: "Refunds", icon: <Icons.Receipt /> },
    { href: "/admin/finance/wallets", label: "Wallets", icon: <Icons.Wallet /> },
    { href: "/admin/finance/ledger", label: "Ledger", icon: <Icons.Receipt /> },
];
