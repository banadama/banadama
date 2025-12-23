// components/icons/icons.tsx - Complete SVG Icon Set
import * as React from "react";
import { IconBase, IconProps } from "./Icon";

export const Icons = {
    // ===== Core / Navigation =====
    Home: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v6H4a1 1 0 0 1-1-1V10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Search: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Filter: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Grid: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    List: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3.5 6h.5M3.5 12h.5M3.5 18h.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),

    // ===== Marketplace =====
    Marketplace: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M6 7h15l-1.5 13.5A1 1 0 0 1 18.5 21H8a1 1 0 0 1-1-.88L6 7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 7h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Product: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M21 8l-9-5-9 5 9 5 9-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M3 8v8l9 5 9-5V8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 13v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Tag: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M20 13l-7 7-10-10V3h7l10 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M7.5 7.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </IconBase>
    ),

    // ===== Location / Global =====
    Location: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="2" />
        </IconBase>
    ),
    MapPin: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 21s6-4 6-11a6 6 0 1 0-12 0c0 7 6 11 6 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="2" />
        </IconBase>
    ),
    Globe: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="2" />
            <path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 2c3 3 3 17 0 20-3-3-3-17 0-20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),

    // ===== RFQ / Orders =====
    RFQ: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M7 3h10a2 2 0 0 1 2 2v14l-4-2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M8 7h8M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Quote: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M7 7h10v14H7V7Z" stroke="currentColor" strokeWidth="2" />
            <path d="M9 3h10v14H9V3Z" stroke="currentColor" strokeWidth="2" />
            <path d="M11 8h6M11 12h5M11 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Calendar: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Orders: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M7 7h14v14H7V7Z" stroke="currentColor" strokeWidth="2" />
            <path d="M3 3h14v14H3V3Z" stroke="currentColor" strokeWidth="2" />
        </IconBase>
    ),
    Cart: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M6 6h15l-2 9H7L6 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M6 6 5 3H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" stroke="currentColor" strokeWidth="2" />
        </IconBase>
    ),

    // ===== Logistics =====
    Truck: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M3 7h11v10H3V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M14 10h4l3 3v4h-7V10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" strokeWidth="2" />
        </IconBase>
    ),
    Package: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M21 8l-9-5-9 5 9 5 9-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M3 8v8l9 5 9-5V8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Tracking: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 21s6-4 6-11a6 6 0 1 0-12 0c0 7 6 11 6 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 12v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Document: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M8 12h8M8 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),

    // ===== Messaging =====
    Message: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M21 12a7 7 0 0 1-7 7H7l-4 3V12a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Send: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M22 2 11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 2 15 22l-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),

    // ===== Trust / Verification =====
    Shield: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 2l8 4v6c0 6-4 9-8 10C8 21 4 18 4 12V6l8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    ShieldCheck: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M8.5 12.5 11 15l4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),
    Check: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),
    Upload: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 8l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    X: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </IconBase>
    ),
    Warning: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 3 2 21h20L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </IconBase>
    ),
    AlertTriangle: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 3 22 20H2L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),

    // ===== Finance =====
    Wallet: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="2" />
            <path d="M21 9H15a2 2 0 0 0 0 4h6" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 11h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </IconBase>
    ),
    Lock: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 11h12v10H6V11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Receipt: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1V2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M8 7h8M8 11h8M8 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Bank: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 10V20h16V10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 3 2 8h20L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M7 14v4M12 14v4M17 14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),

    // ===== Admin / Settings =====
    Settings: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2" />
            <path d="M19.4 15a7.8 7.8 0 0 0 .1-1l2-1-2-3-2.2.6a7.8 7.8 0 0 0-1.7-1L15 6 9 6l-.6 2.6a7.8 7.8 0 0 0-1.7 1L4.5 9 2.5 12l2 1a7.8 7.8 0 0 0 .1 1l-2 1 2 3 2.2-.6a7.8 7.8 0 0 0 1.7 1L9 22h6l.6-2.6a7.8 7.8 0 0 0 1.7-1l2.2.6 2-3-2-1Z"
                stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Users: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
            <path d="M22 21v-2a3.5 3.5 0 0 0-3-3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 3.2a4 4 0 0 1 0 7.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Key: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M7 14a5 5 0 1 1 4.6-7H22v4h-2v2h-2v2h-3.4A5 5 0 0 1 7 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M22 7v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    ShieldAdmin: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 2l8 4v6c0 6-4 9-8 10C8 21 4 18 4 12V6l8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Clock: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),
    CreditCard: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" stroke="currentColor" strokeWidth="2" />
            <path d="M3 9h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Flag: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M5 21V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M5 4h12l-2 4 2 4H5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Chat: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M6 3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9l-4 3v-3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),

    // ===== Creators / Affiliate / Growth =====
    Brush: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M4 20c3 0 4-1 5-4 1-2 3-3 5-3 3 0 6-3 6-6 0-2-2-4-4-4-3 0-6 3-6 6 0 2-1 4-3 5-3 1-4 2-4 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Camera: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M4 7h4l2-2h4l2 2h4v14H4V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
        </IconBase>
    ),
    Video: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M3 7h12v10H3V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M15 10l6-3v10l-6-3v-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Link: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    TrendingUp: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M3 17l6-6 4 4 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 8h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),

    // ===== Utility =====
    Plus: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </IconBase>
    ),
    Minus: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </IconBase>
    ),
    ChevronRight: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),
    ChevronLeft: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),
    ChevronDown: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),
    Logout: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M10 17l-1 1H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5l1 1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M15 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 12l-3-3M15 12l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 12h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Stock: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M4 4h16v4H4V4Z" stroke="currentColor" strokeWidth="2" />
            <path d="M4 10h16v4H4v-4Z" stroke="currentColor" strokeWidth="2" />
            <path d="M4 16h16v4H4v-4Z" stroke="currentColor" strokeWidth="2" />
        </IconBase>
    ),
    Capabilities: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 2a3 3 0 0 0-3 3v1H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-3V5a3 3 0 0 0-3-3Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 12v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Audit: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" />
            <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="2" />
            <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    Star: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),
    Building: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" stroke="currentColor" strokeWidth="2" />
            <path d="M2 21h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 8h2M9 12h2M9 16h2M13 8h2M13 12h2M13 16h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    User: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconBase>
    ),
    // ===== Trust & Verification =====
    TickGreen: (p: IconProps) => (
        <IconBase {...p}>
            <circle cx="12" cy="12" r="10" stroke="hsl(var(--bd-success))" strokeWidth="2" fill="none" />
            <path d="M7.5 12.5 10.5 15.5 16.5 9.5" stroke="hsl(var(--bd-success))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),
    TickBlue: (p: IconProps) => (
        <IconBase {...p}>
            <circle cx="12" cy="12" r="10" stroke="hsl(var(--bd-primary))" strokeWidth="2" fill="none" />
            <path d="M7.5 12.5 10.5 15.5 16.5 9.5" stroke="hsl(var(--bd-primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </IconBase>
    ),
    Layers: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M3 16l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </IconBase>
    ),

    // Utility
    RefreshCw: ({ size = 16 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Loader: ({ size = 16 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Bell: ({ size = 16 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Volume2: ({ size = 16 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M15.5 8.5a4 4 0 0 1 0 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 6a7 7 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Vibrate: ({ size = 16 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 8v8M21 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),

    // ===== Social Media Icons =====
    Facebook: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" fill="currentColor" />
        </IconBase>
    ),

    Linkedin: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" fill="currentColor" />
            <rect x="2" y="9" width="4" height="12" fill="currentColor" />
            <circle cx="4" cy="4" r="2" fill="currentColor" />
        </IconBase>
    ),

    Twitter: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.01Z" fill="currentColor" />
        </IconBase>
    ),

    Instagram: (p: IconProps) => (
        <IconBase {...p}>
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </IconBase>
    ),

    Youtube: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33Z" fill="currentColor" />
            <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54Z" fill="white" />
        </IconBase>
    ),

    Tiktok: (p: IconProps) => (
        <IconBase {...p}>
            <path d="M9 12a4 4 0 1 0 4 4V4s.5 4 5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </IconBase>
    ),

    /**
     * Safe icon getter to prevent "Unsupported Server Component type: undefined"
     */
    get: (name: string) => {
        const found = (Icons as any)[name];
        if (found) return found;
        console.warn(`Icon "${name}" not found. Using fallback.`);
        return Icons.HelpCircle || Icons.Layers;
    },
};
