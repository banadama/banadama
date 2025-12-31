// components/marketplace/MarketplaceHeader.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Menu, MapPin, ChevronDown, Search, Bell, User, ShoppingCart
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface MarketplaceHeaderProps {
    onMenuToggle: () => void;
    cartCount?: number;
    userLocation?: string;
}

const categories = [
    { name: 'Textiles', href: '/browse?category=textiles' },
    { name: 'Footwear', href: '/browse?category=footwear' },
    { name: 'Packaging', href: '/browse?category=packaging' },
    { name: 'Home Textile', href: '/browse?category=home-textile' },
    { name: 'Fashion', href: '/browse?category=fashion' },
];

export function MarketplaceHeader({
    onMenuToggle,
    cartCount = 0,
    userLocation = 'Nigeria',
}: MarketplaceHeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    };

    return (
        <header className="bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Left Header Section */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={onMenuToggle}
                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-slate-600 active:scale-95"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 leading-none">Deliver to</span>
                            <div className="flex items-center gap-1 font-bold text-gray-900 text-sm leading-tight">
                                {userLocation}
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Search Bar */}
                <div className="flex-1 max-w-2xl mx-6">
                    <form onSubmit={handleSearch} className="flex items-center group">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search factories, products, creators..."
                                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all text-sm shadow-inner"
                            />
                        </div>
                        <button type="submit" className="ml-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                            Search
                        </button>
                    </form>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-2.5 hover:bg-gray-100 rounded-xl relative text-slate-600 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full"></span>
                    </button>

                    <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 ml-2">
                        <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="flex flex-col items-start px-3 py-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <span className="text-[10px] text-gray-500 leading-none">Hello, Sign in</span>
                            <div className="flex items-center gap-1 font-bold text-gray-900 text-sm leading-tight">
                                Account & Lists
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </button>

                        <Link href="/buyer/orders" className="hidden lg:flex flex-col items-start px-3 py-1.5 hover:bg-gray-100 rounded-xl transition-colors">
                            <span className="text-[10px] text-gray-500 leading-none">Returns</span>
                            <span className="font-bold text-gray-900 text-sm leading-tight">& Orders</span>
                        </Link>

                        <Link href="/cart" className="flex items-center gap-2 ml-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-md group">
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            </div>
                            <span className="font-bold text-sm">Cart</span>
                        </Link>
                    </div>

                    {/* Auth Modal */}
                    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
                </div>
            </div>

            {/* Sub-Header / Categories Row */}
            <div className="bg-white/20 backdrop-blur-sm border-t border-white/10 px-6 py-2 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-700 hover:text-orange-600 font-bold text-sm py-1 transition-colors">
                        <Menu className="w-4 h-4" />
                        All
                    </button>
                    <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
                        <Link href="/browse?deals=true" className="text-orange-600 font-bold hover:underline">Today's Deals</Link>
                        <Link href="/suppliers?type=factory" className="hover:text-orange-600">Factories</Link>
                        <Link href="/suppliers?type=wholesaler" className="hover:text-orange-600">Wholesalers</Link>
                        <Link href="/creators" className="hover:text-orange-600">Creators</Link>
                        <Link href="/rfq/new" className="hover:text-orange-600">RFQ</Link>
                        <Link href="/browse?bulk=true" className="hover:text-orange-600">Bulk Orders</Link>
                    </nav>
                </div>

                <div className="hidden xl:flex items-center gap-4">
                    {categories.slice(0, 3).map((cat, idx) => (
                        <Link key={idx} href={cat.href} className="text-sm text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                            {cat.name}
                        </Link>
                    ))}
                    <div className="h-4 w-px bg-gray-200" />
                    <button className="text-sm font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1">
                        More Categories <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default MarketplaceHeader;
