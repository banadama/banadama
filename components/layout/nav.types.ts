// components/layout/nav.types.ts - Navigation Type Definitions
import React from "react";

export type NavItem = {
    href: string;
    label: string;
    icon?: React.ReactNode;
};

export type NavSection = {
    title?: string;
    items: NavItem[];
};
