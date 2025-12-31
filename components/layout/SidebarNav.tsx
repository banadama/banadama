"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SidebarNav({ items, primaryColor, accentColor }: {
  items: Array<{ href: string; label: string; icon?: React.ReactNode }>;
  primaryColor?: string;
  accentColor?: string;
}) {
  const pathname = usePathname() || '/';
  const activeColor = accentColor || '#5bc5cf';

  return (
    <nav style={{ padding: '1rem 0' }}>
      {items.map((item, idx) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/') || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isActive ? `${activeColor}22` : 'transparent',
                borderLeftColor: isActive ? activeColor : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.9)'
              }}
              whileHover={{ x: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                fontSize: '0.9rem',
                borderLeft: `3px solid transparent`,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
