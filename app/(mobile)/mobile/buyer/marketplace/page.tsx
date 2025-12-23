// app/(mobile)/mobile/buyer/marketplace/page.tsx - Buyer Marketplace (Mobile)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface Product {
    id: string;
    name: string;
    price: number;
    moq: number;
    images: string[];
    supplier: { businessName: string; isVerified: boolean };
}

export default function BuyerMarketplaceMobile() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=20', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <MobileHeader title="Marketplace" />

            {/* Search */}
            <div className="px-4 py-3 bg-slate-800/50">
                <input
                    type="search"
                    placeholder="🔍 Search products..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Products Grid */}
            <div className="p-4">
                {loading ? (
                    <div className="text-center text-slate-400 py-8">Loading...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">No products found</div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.map((product) => (
                            <Link key={product.id} href={`/mobile/buyer/products/${product.id}`}>
                                <div className="bg-slate-800 rounded-xl overflow-hidden active:bg-slate-700">
                                    <div className="aspect-square bg-slate-700">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <div className="text-white text-sm font-medium line-clamp-2">{product.name}</div>
                                        <div className="text-green-400 font-bold mt-1">{formatMoney(product.price)}</div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-slate-500 text-xs">MOQ: {product.moq}</span>
                                            {product.supplier.isVerified && (
                                                <span className="text-blue-400 text-xs">✓</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
