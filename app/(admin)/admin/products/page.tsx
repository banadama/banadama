// app/(admin)/admin/studio/products/page.tsx - Product & Listing Control Page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    description?: string;
    categorySlug?: string;
    categoryName?: string;
    unitPrice: number;
    countryOfOrigin?: string;
    approvalStatus: string;
    isHiddenByAdmin: boolean;
    isFlagged: boolean;
    isActive: boolean;
    createdAt: string;
    supplier?: {
        id: string;
        businessName?: string;
        user: { email: string };
    };
    creator?: {
        id: string;
        displayName?: string;
        user: { email: string };
    };
}

const APPROVAL_STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending', color: 'gray' },
    APPROVED: { label: 'Approved', color: 'green' },
    REJECTED: { label: 'Rejected', color: 'red' },
    CHANGES_REQUIRED: { label: 'Changes Required', color: 'blue' },
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'flagged' | 'hidden'>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = async (pageNum = 1) => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(pageNum), limit: '20' });

        if (filter === 'pending') params.set('approvalStatus', 'PENDING');
        if (filter === 'flagged') params.set('isFlagged', 'true');
        if (filter === 'hidden') params.set('isHidden', 'true');
        if (search) params.set('search', search);

        try {
            const res = await fetch(`/api/admin/products?${params}`, { credentials: 'include' });
            const data = await res.json();
            setProducts(data.products || []);
            setPage(data.pagination?.page || 1);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filter, search]);

    const updateProduct = async (productId: string, action: string, reason?: string) => {
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action, reason }),
            });
            if (res.ok) {
                fetchProducts(page);
            }
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const getStatusBadge = (status: string) => {
        const config = APPROVAL_STATUS_LABELS[status] || { label: status, color: 'gray' };
        return <span className={`studio-badge studio-badge-${config.color}`}>{config.label}</span>;
    };

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Product & Listing Control</h1>
            </div>

            {/* Filter Tabs */}
            <div className="studio-card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {(['all', 'pending', 'flagged', 'hidden'] as const).map((f) => (
                        <button
                            key={f}
                            className={`studio-btn ${filter === f ? 'studio-btn-primary' : 'studio-btn-secondary'}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' && '📦 All Products'}
                            {f === 'pending' && '⏳ Pending Approval'}
                            {f === 'flagged' && '🚩 Flagged'}
                            {f === 'hidden' && '👁️ Hidden'}
                        </button>
                    ))}
                    <input
                        type="text"
                        className="studio-input"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: '250px', marginLeft: 'auto' }}
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="studio-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No products found
                    </div>
                ) : (
                    <>
                        <table className="studio-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Owner</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Flags</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{product.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                {product.categoryName || product.categorySlug || 'Uncategorized'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                {product.supplier
                                                    ? product.supplier.businessName || product.supplier.user.email
                                                    : product.creator
                                                        ? product.creator.displayName || product.creator.user.email
                                                        : '-'}
                                            </div>
                                        </td>
                                        <td>₦{product.unitPrice.toLocaleString()}</td>
                                        <td>{getStatusBadge(product.approvalStatus)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                {product.isFlagged && (
                                                    <span className="studio-badge studio-badge-red">🚩 Flagged</span>
                                                )}
                                                {product.isHiddenByAdmin && (
                                                    <span className="studio-badge studio-badge-gray">👁️ Hidden</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {product.approvalStatus === 'PENDING' && (
                                                    <>
                                                        <button
                                                            className="studio-btn studio-btn-primary"
                                                            onClick={() => updateProduct(product.id, 'approve')}
                                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            ✓ Approve
                                                        </button>
                                                        <button
                                                            className="studio-btn studio-btn-danger"
                                                            onClick={() => {
                                                                const reason = prompt('Rejection reason:');
                                                                if (reason) updateProduct(product.id, 'reject', reason);
                                                            }}
                                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            ✗ Reject
                                                        </button>
                                                    </>
                                                )}
                                                {!product.isHiddenByAdmin ? (
                                                    <button
                                                        className="studio-btn studio-btn-secondary"
                                                        onClick={() => {
                                                            const reason = prompt('Hide reason:');
                                                            if (reason) updateProduct(product.id, 'hide', reason);
                                                        }}
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        Hide
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="studio-btn studio-btn-secondary"
                                                        onClick={() => updateProduct(product.id, 'unhide')}
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        Unhide
                                                    </button>
                                                )}
                                                {!product.isFlagged ? (
                                                    <button
                                                        className="studio-btn studio-btn-secondary"
                                                        onClick={() => {
                                                            const reason = prompt('Flag reason:');
                                                            if (reason) updateProduct(product.id, 'flag', reason);
                                                        }}
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        🚩
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="studio-btn studio-btn-secondary"
                                                        onClick={() => updateProduct(product.id, 'unflag')}
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        Unflag
                                                    </button>
                                                )}
                                                <Link href={`/admin/studio/products/${product.id}`}>
                                                    <button
                                                        className="studio-btn studio-btn-secondary"
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        Details
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                                <button
                                    className="studio-btn studio-btn-secondary"
                                    onClick={() => fetchProducts(page - 1)}
                                    disabled={page <= 1}
                                >
                                    Previous
                                </button>
                                <span style={{ color: '#94a3b8', alignSelf: 'center' }}>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="studio-btn studio-btn-secondary"
                                    onClick={() => fetchProducts(page + 1)}
                                    disabled={page >= totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
