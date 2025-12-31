'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Package, ShoppingCart, MessageSquare,
  BarChart3, Settings, Factory, Truck, FileText,
  Briefcase, Palette, DollarSign, LinkIcon
} from 'lucide-react';

interface SidebarProps {
  role: 'FACTORY' | 'WHOLESALER' | 'RETAILER' | 'CREATOR' | 'AFFILIATE';
}

export default function SupplierSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  // Different menu items based on role
  const menuItems = {
    FACTORY: [
      { icon: Home, label: 'Dashboard', href: '/supplier/dashboard' },
      { icon: ShoppingCart, label: 'Orders', href: '/supplier/dashboard/orders' },
      { icon: Factory, label: 'Production', href: '/supplier/dashboard/production' },
      { icon: Package, label: 'Inventory', href: '/supplier/dashboard/inventory' },
      { icon: Package, label: 'Products', href: '/supplier/dashboard/products' },
      { icon: DollarSign, label: 'Pricing', href: '/supplier/dashboard/pricing' },
      { icon: Truck, label: 'Logistics', href: '/supplier/dashboard/logistics' },
      { icon: FileText, label: 'Certifications', href: '/supplier/dashboard/certifications' },
      { icon: MessageSquare, label: 'Messages', href: '/supplier/dashboard/messages' },
      { icon: BarChart3, label: 'Analytics', href: '/supplier/dashboard/analytics' },
      { icon: Settings, label: 'Settings', href: '/supplier/dashboard/settings' },
    ],
    WHOLESALER: [
      { icon: Home, label: 'Dashboard', href: '/supplier/dashboard' },
      { icon: ShoppingCart, label: 'Orders', href: '/supplier/dashboard/orders' },
      { icon: Package, label: 'Inventory', href: '/supplier/dashboard/inventory' },
      { icon: Package, label: 'Products', href: '/supplier/dashboard/products' },
      { icon: DollarSign, label: 'Pricing', href: '/supplier/dashboard/pricing' },
      { icon: Truck, label: 'Logistics', href: '/supplier/dashboard/logistics' },
      { icon: MessageSquare, label: 'Messages', href: '/supplier/dashboard/messages' },
      { icon: BarChart3, label: 'Analytics', href: '/supplier/dashboard/analytics' },
      { icon: Settings, label: 'Settings', href: '/supplier/dashboard/settings' },
    ],
    RETAILER: [
      { icon: Home, label: 'Dashboard', href: '/supplier/dashboard' },
      { icon: ShoppingCart, label: 'Orders', href: '/supplier/dashboard/orders' },
      { icon: Package, label: 'Products', href: '/supplier/dashboard/products' },
      { icon: Package, label: 'Inventory', href: '/supplier/dashboard/inventory' },
      { icon: MessageSquare, label: 'Messages', href: '/supplier/dashboard/messages' },
      { icon: BarChart3, label: 'Analytics', href: '/supplier/dashboard/analytics' },
      { icon: Settings, label: 'Settings', href: '/supplier/dashboard/settings' },
    ],
    CREATOR: [
      { icon: Home, label: 'Dashboard', href: '/supplier/dashboard' },
      { icon: Briefcase, label: 'Projects', href: '/supplier/dashboard/projects' },
      { icon: Palette, label: 'Portfolio', href: '/supplier/dashboard/portfolio' },
      { icon: Package, label: 'Services', href: '/supplier/dashboard/products' },
      { icon: MessageSquare, label: 'Messages', href: '/supplier/dashboard/messages' },
      { icon: BarChart3, label: 'Reviews', href: '/supplier/dashboard/analytics' },
      { icon: DollarSign, label: 'Earnings', href: '/supplier/dashboard/commissions' },
      { icon: Settings, label: 'Settings', href: '/supplier/dashboard/settings' },
    ],
    AFFILIATE: [
      { icon: Home, label: 'Dashboard', href: '/supplier/dashboard' },
      { icon: LinkIcon, label: 'Links', href: '/supplier/dashboard/affiliate-links' },
      { icon: BarChart3, label: 'Performance', href: '/supplier/dashboard/analytics' },
      { icon: DollarSign, label: 'Commissions', href: '/supplier/dashboard/commissions' },
      { icon: MessageSquare, label: 'Messages', href: '/supplier/dashboard/messages' },
      { icon: Settings, label: 'Settings', href: '/supplier/dashboard/settings' },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Banadama</h1>
        <p className="text-sm text-gray-400 mt-1">Supplier Studio</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors text-sm font-medium
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          ← Swap to Market
        </Link>
      </div>
    </aside>
  );
}
