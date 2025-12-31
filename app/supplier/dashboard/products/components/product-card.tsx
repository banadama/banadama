'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  category?: string;
  brand?: string;
  supplierRole?: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  viewMode?: 'grid' | 'table';
}

export function ProductCard({
  product,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  viewMode = 'grid',
}: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const price = product.basePrice || product.unitPrice || 0;
  const image = product.images?.[0] || '/placeholder-product.png';
  const isOutOfStock = (product.stockQuantity || 0) <= 0;
  const stockStatus =
    isOutOfStock ? '⚠️ Out of Stock' : `✓ ${product.stockQuantity || 0} in stock`;
  const statusBadge = {
    ACTIVE: 'bg-green-100 text-green-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    INACTIVE: 'bg-red-100 text-red-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  }[product.status] || 'bg-gray-100 text-gray-800';

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true);
      try {
        await fetch(`/api/supplier/products/${product.id}`, {
          method: 'DELETE',
        });
        onDelete(product.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (viewMode === 'table') {
    return (
      <tr className="border-b hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
        <td className="px-6 py-4 text-sm text-gray-600">{product.brand || '—'}</td>
        <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(price)}</td>
        <td className="px-6 py-4 text-sm text-gray-600">{product.moq || 1}</td>
        <td className="px-6 py-4 text-sm">
          <span className={`px-2 py-1 rounded text-xs font-medium ${stockStatus ? 'text-green-700' : 'text-red-700'}`}>
            {product.stockQuantity || 0}
          </span>
        </td>
        <td className="px-6 py-4 text-sm">
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge}`}>
            {product.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm">
          <div className="flex gap-2">
            <Link
              href={`/supplier/dashboard/products/${product.id}/edit`}
              className="text-blue-600 hover:text-blue-900 font-medium"
            >
              Edit
            </Link>
            <button
              onClick={() => onDuplicate(product.id)}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Grid view
  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.png';
          }}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium text-white ${statusBadge}`}>
          {product.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
        
        {/* Price and Stock */}
        <div className="mt-3 flex justify-between items-start">
          <div>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(price)}</p>
            <p className={`text-xs ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {stockStatus}
            </p>
          </div>
          {product.moq && (
            <p className="text-xs text-gray-600">MOQ: {product.moq}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <Link
            href={`/supplier/dashboard/products/${product.id}/edit`}
            className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Edit
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => onDuplicate(product.id)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 text-sm font-medium"
            >
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 border border-red-300 text-red-600 py-2 rounded hover:bg-red-50 text-sm font-medium disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
