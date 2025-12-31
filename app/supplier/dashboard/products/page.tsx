"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProductForm from '../../../../components/product/ProductForm';
import ProductCard from '../../../../components/product/ProductCard';
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug?: string;
  mainImage?: string | null;
  basePrice?: number | null;
  stockQuantity?: number | null;
  status?: "ACTIVE" | "DRAFT" | "INACTIVE" | "PENDING_APPROVAL";
  sku?: string | null;
};

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const perPage = 12;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
      if (search) params.set("search", search);
      const res = await fetch(`/api/supplier/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);

  const bulkAction = async (action: "delete" | "activate" | "deactivate") => {
    if (!selectedIds.length) return;
    if (action === "delete" && !confirm(`Delete ${selectedIds.length} products?`)) return;
    try {
      const res = await fetch(`/api/supplier/products/bulk-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, productIds: selectedIds }),
      });
      if (!res.ok) throw new Error("Bulk action failed");
      // refresh
      setSelected({});
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Bulk action failed");
    }
  };

  const duplicateProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/supplier/products/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Duplicate failed");
      fetchProducts();
      alert("Product duplicated");
    } catch (err) {
      console.error(err);
      alert("Duplicate failed");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/supplier/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const toggleStatus = async (id: string, current?: string) => {
    const target = current === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`/api/supplier/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: target }),
      });
      if (!res.ok) throw new Error("Status update failed");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  const openEdit = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/supplier/products/${id}`);
      if (!res.ok) throw new Error('Failed to load product');
      const json = await res.json();
      const productData = json.data ?? json;
      setEditingProduct(productData || null);
      setShowForm(true);
    } catch (err) {
      console.error(err);
      alert('Failed to load product for editing');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="bg-green-600 text-black px-4 py-2 rounded font-semibold">+ Add Product</button>
            <div className="bg-gray-800 p-2 rounded">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1 ${view === "grid" ? "bg-gray-700 rounded" : ""}`}
              >
                Grid
              </button>
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1 ml-2 ${view === "table" ? "bg-gray-700 rounded" : ""}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
            <div className="relative bg-gray-900 w-full max-w-3xl rounded p-6">
              <button onClick={() => setShowForm(false)} className="absolute right-3 top-3 px-2 py-1 bg-gray-800 rounded">Close</button>
              <ProductForm
                mode={editingProduct ? 'edit' : 'add'}
                initialData={editingProduct}
                onSaved={(id) => {
                  setShowForm(false);
                  setEditingProduct(null);
                  fetchProducts();
                }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-300">Total Products</div>
            <div className="text-2xl font-bold">{total}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-300">Active</div>
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "ACTIVE").length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-300">Out of Stock</div>
            <div className="text-2xl font-bold">{products.filter((p) => (p.stockQuantity || 0) <= 0).length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-300">Pending Approval</div>
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "PENDING_APPROVAL").length}</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU or description"
            className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button
            onClick={() => { setPage(1); fetchProducts(); }}
            className="bg-blue-600 px-4 py-2 rounded"
          >Search</button>
          <div className="ml-auto text-sm text-gray-300">{loading ? "Loading..." : ""}</div>
        </div>

        {/* Bulk toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-gray-800 p-3 rounded mb-4 flex items-center gap-3">
            <div className="text-sm">{selectedIds.length} selected</div>
            <button onClick={() => bulkAction("activate")} className="px-3 py-1 bg-green-600 rounded">Activate</button>
            <button onClick={() => bulkAction("deactivate")} className="px-3 py-1 bg-yellow-600 rounded">Deactivate</button>
            <button onClick={() => bulkAction("delete")} className="px-3 py-1 bg-red-600 rounded">Delete</button>
            <button onClick={() => { setSelected({}); }} className="px-3 py-1 bg-gray-700 rounded ml-auto">Clear</button>
          </div>
        )}

        {/* Product grid/table */}
        {view === "grid" ? (
          <div className="grid grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <button onClick={() => toggleSelect(p.id)} className={`px-2 py-1 rounded ${selected[p.id] ? 'bg-gray-700' : 'bg-gray-700/60'}`}>{selected[p.id] ? 'Selected' : 'Select'}</button>
                </div>
                <ProductCard product={p} onEdit={openEdit} onDuplicate={duplicateProduct} onDelete={deleteProduct} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded overflow-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="p-3 text-left"><input type="checkbox" onChange={(e) => {
                    const checked = e.target.checked;
                    const map: Record<string, boolean> = {};
                    if (checked) products.forEach(p => map[p.id] = true);
                    setSelected(map);
                  }} /></th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">SKU</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-700">
                    <td className="p-3"><input type="checkbox" checked={!!selected[p.id]} onChange={() => toggleSelect(p.id)} /></td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                          {p.mainImage ? (<img src={p.mainImage} alt={p.name} className="object-cover w-full h-full" />) : null}
                        </div>
                        <div>
                          <div className="font-semibold">{p.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{p.sku || '—'}</td>
                    <td className="p-3">{p.basePrice ? `₦${p.basePrice.toFixed(2)}` : '—'}</td>
                    <td className="p-3">{p.stockQuantity ?? '—'}</td>
                    <td className="p-3">{p.status}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p.id)} className="px-2 py-1 bg-blue-600 rounded">Edit</button>
                        <button onClick={() => duplicateProduct(p.id)} className="px-2 py-1 bg-gray-600 rounded">Duplicate</button>
                        <button onClick={() => deleteProduct(p.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-300">Page {page} of {totalPages}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-800 rounded">Previous</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 bg-gray-800 rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from './components/product-card';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  images?: string[];
  basePrice?: number;
  unitPrice?: number;
  stockQuantity?: number;
  status: string;
  moq?: number;
  brand?: string;
  categoryName?: string;
}

interface Stats {
  total: number;
  active: number;
  outOfStock: number;
  pendingApproval: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, outOfStock: 0, pendingApproval: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Search and filter params
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'ALL';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState(search);
  const [statusFilter, setStatusFilter] = useState(status);

  useEffect(() => {
    fetchProducts();
  }, [search, status, category, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== 'ALL') params.append('status', status);
      if (category) params.append('category', category);
      params.append('page', String(page));
      params.append('limit', '12');

      const res = await fetch(`/api/supplier/products?${params}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.pages);
        
        // Calculate stats
        const stats: Stats = {
          total: data.pagination.total,
          active: data.data.filter((p: Product) => p.status === 'ACTIVE').length,
          outOfStock: data.data.filter((p: Product) => (p.stockQuantity || 0) <= 0).length,
          pendingApproval: data.data.filter((p: Product) => p.status === 'PENDING_APPROVAL').length,
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/supplier/dashboard/products?${params}`);
  };

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams);
    if (newStatus !== 'ALL') {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    router.push(`/supplier/dashboard/products?${params}`);
  };

  const handleEdit = (productId: string) => {
    router.push(`/supplier/dashboard/products/${productId}/edit`);
  };

  const handleDuplicate = async (productId: string) => {
    try {
      const res = await fetch(`/api/supplier/products/${productId}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to duplicate product:', error);
    }
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await fetch(`/api/supplier/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map((p) => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
    setShowBulkActions(checked);
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.size === 0) return;

    try {
      const res = await fetch('/api/supplier/products/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          productIds: Array.from(selectedProducts),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedProducts(new Set());
        setShowBulkActions(false);
        fetchProducts();
      }
    } catch (error) {
      console.error(`Failed to ${action} products:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <Link
              href="/supplier/dashboard/products/add"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              + Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-4 mb-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                placeholder="Search by name, SKU, or brand..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>

            {/* View Toggle */}
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 ${viewMode === 'table' ? 'bg-gray-200' : 'bg-white'}`}
              >
                ≡ Table
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['ALL', 'ACTIVE', 'DRAFT', 'INACTIVE', 'PENDING_APPROVAL'].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s === 'ALL' ? 'All Products' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-blue-900">
                {selectedProducts.size} product(s) selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="text-gray-600">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <Link
              href="/supplier/dashboard/products/add"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first product →
            </Link>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-lg overflow-hidden border">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === products.length && products.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">MOQ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                      />
                    </td>
                    <ProductCard
                      product={product}
                      onEdit={handleEdit}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                      viewMode="table"
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                viewMode="grid"
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/supplier/dashboard/products?page=${page - 1}${search ? `&search=${search}` : ''}`}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/supplier/dashboard/products?page=${p}${search ? `&search=${search}` : ''}`}
                className={`px-4 py-2 rounded ${
                  p === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/supplier/dashboard/products?page=${page + 1}${search ? `&search=${search}` : ''}`}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
