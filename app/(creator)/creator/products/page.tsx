// app/(creator)/creator/products/page.tsx - Creator Digital Products
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CreatorProduct {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    status: string;
    totalSales: number;
    totalRevenue: number;
    previewUrls: string[];
}

const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-slate-500/20 text-slate-400',
    PENDING_REVIEW: 'bg-yellow-500/20 text-yellow-400',
    APPROVED: 'bg-green-500/20 text-green-400',
    REJECTED: 'bg-red-500/20 text-red-400',
    PAUSED: 'bg-orange-500/20 text-orange-400',
};

export default function CreatorProductsPage() {
    const [products, setProducts] = useState<CreatorProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = filter ? `/api/creator/products?status=${filter}` : '/api/creator/products';
                const res = await fetch(url, { credentials: 'include' });
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
    }, [filter]);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">📦 Digital Products</h1>
                    <p className="text-slate-400">Graphics, mockups, templates - global instant delivery</p>
                </div>
                <Link href="/creator/products/new">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        + New Product
                    </button>
                </Link>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-400 text-sm">
                    🌍 <strong>Digital Products:</strong> Graphics, mockups, templates. Global availability. Buyers get instant access after purchase.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['', 'APPROVED', 'PENDING_REVIEW', 'DRAFT', 'REJECTED'].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f ? f.replace(/_/g, ' ') : 'All Products'}
                    </button>
                ))}
            </div>

            {/* Products List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : products.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">📦</span>
                    <p className="text-slate-400 mt-4">No products yet</p>
                    <Link href="/creator/products/new">
                        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
                            Create Your First Product
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <Link key={product.id} href={`/creator/products/${product.id}`}>
                            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors">
                                {/* Preview */}
                                <div className="aspect-video bg-slate-700">
                                    {product.previewUrls?.[0] ? (
                                        <img src={product.previewUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-white font-medium line-clamp-1">{product.name}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[product.status]}`}>
                                            {product.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    <p className="text-slate-500 text-sm mb-3 line-clamp-2">{product.description}</p>

                                    <div className="flex justify-between items-center">
                                        <span className="text-green-400 font-bold">{formatMoney(product.price)}</span>
                                        <span className="text-slate-500 text-sm">{product.totalSales} sold</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
