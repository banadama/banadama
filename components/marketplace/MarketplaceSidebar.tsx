// components/marketplace/MarketplaceSidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, Package, Users, FileText, MessageSquare, Settings,
    ChevronRight, ChevronLeft, LogOut, User, ShoppingCart,
    Factory, Building2, Store, Palette, TrendingUp, CheckCircle
} from 'lucide-react';

interface MarketplaceSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    userType?: string;
}

const userTypes = [
    { id: 'buyer', label: 'Buyer', icon: ShoppingCart },
    { id: 'factory', label: 'Factory', icon: Factory },
    { id: 'wholesaler', label: 'Wholesaler', icon: Building2 },
    { id: 'retailer', label: 'Retailer', icon: Store },
    { id: 'creator', label: 'Creator', icon: Palette },
    { id: 'affiliate', label: 'Affiliate', icon: TrendingUp },
    { id: 'admin', label: 'Admin', icon: CheckCircle },
    { id: 'operations', label: 'Operations', icon: Settings }
];

export function MarketplaceSidebar({ isOpen, onClose, userType = 'buyer' }: MarketplaceSidebarProps) {
    const pathname = usePathname();
    const [activeUser, setActiveUser] = useState(userType);
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => setCollapsed(!collapsed);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 text-white transition-all duration-300 flex flex-col z-[60] shadow-2xl
                ${collapsed ? 'w-20' : 'w-64'}
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `} style={{ backgroundColor: '#2c362e' }}>
                {/* Logo Section */}
                <div className="p-6 border-b border-white/10 relative">
                    <Link href="/marketplace" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                            B
                        </div>
                        {!collapsed && (
                            <div className="animate-fadeIn">
                                <div className="font-bold text-lg tracking-tight">Banadama</div>
                                <div className="text-[10px] text-orange-400 uppercase font-black tracking-widest leading-none">Global Marketplace</div>
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={toggleCollapse}
                        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full items-center justify-center text-white shadow-lg z-10 hover:scale-110 transition-transform"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Role Selection */}
                <div className="p-4 border-b border-white/5">
                    {!collapsed && <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Account Mode</div>}
                    <div className="relative">
                        <select
                            value={activeUser}
                            onChange={(e) => setActiveUser(e.target.value)}
                            className={`
                                w-full bg-slate-800/50 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer hover:bg-slate-800 transition-colors
                                ${collapsed ? 'px-2 py-2 text-center' : 'px-3 py-2'}
                            `}
                        >
                            {userTypes.map(type => (
                                <option key={type.id} value={type.id} className="bg-slate-900 text-white">
                                    {collapsed ? type.id.substring(0, 1).toUpperCase() : type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    <NavItem icon={Home} label="Dashboard" href="/marketplace" active={pathname === '/marketplace'} collapsed={collapsed} />
                    <NavItem icon={Package} label="Orders" href="/buyer/orders" badge={3} collapsed={collapsed} />
                    <NavItem icon={Users} label="Suppliers" href="/suppliers" collapsed={collapsed} />
                    <NavItem icon={Package} label="Products" href="/browse" collapsed={collapsed} />
                    <NavItem icon={FileText} label="Request Quote" href="/rfq/new" collapsed={collapsed} />
                    <NavItem icon={MessageSquare} label="Messages" href="/messages" badge={5} collapsed={collapsed} />
                    <NavItem icon={Settings} label="Settings" href="/settings" collapsed={collapsed} />
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-black/20 space-y-1">
                    <NavItem icon={User} label="Profile" href="/profile" collapsed={collapsed} />
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group">
                        <LogOut className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110`} />
                        {!collapsed && <span className="text-sm font-medium">Log out</span>}
                    </button>
                </div>
            </aside>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(249, 115, 22, 0.4);
                }
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateX(-10px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                  animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
}

function NavItem({ icon: Icon, label, href, active, badge, collapsed }: any) {
    return (
        <Link
            href={href}
            className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
        ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'}
      `}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
            {!collapsed && (
                <>
                    <span className="flex-1 text-sm truncate">{label}</span>
                    {badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${active ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>
                            {badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    );
}

export default MarketplaceSidebar;
