"use client";

import React from 'react';

type Product = {
  id: string;
  name: string;
  mainImage?: string | null;
  basePrice?: number | null;
  stockQuantity?: number | null;
  status?: string | null;
  sku?: string | null;
};

export function ProductCard({
  product,
  onEdit,
  onDuplicate,
  onDelete,
  compact = false,
}: {
  product: Product;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}) {
  const priceDisplay = product.basePrice != null ? `₦${Number(product.basePrice).toLocaleString()}` : '—';

  return (
    <div className={`bg-gray-800 rounded p-3 ${compact ? 'flex items-center gap-3' : ''}`}>
      <div className={`bg-gray-700 rounded overflow-hidden ${compact ? 'w-20 h-20 flex-shrink-0' : 'h-40 mb-3'}`}>
        {product.mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.mainImage} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
        )}
      </div>

      <div className={`flex-1 ${compact ? '' : ''}`}>
        <div className={`font-semibold ${compact ? '' : 'mb-1'}`}>{product.name}</div>
        {!compact && (
          <>
            <div className="text-sm text-gray-300">SKU: {product.sku || '—'}</div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold">{priceDisplay}</div>
                <div className="text-xs text-gray-400">{(product.stockQuantity ?? 0) > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}</div>
              </div>
              <div className="text-sm px-2 py-1 rounded bg-gray-900 text-gray-300">{product.status || '—'}</div>
            </div>
          </>
        )}
      </div>

      <div className={`mt-3 ${compact ? '' : 'flex items-center gap-2'}`}>
        <button onClick={() => onEdit?.(product.id)} className="px-2 py-1 bg-blue-600 rounded text-sm">Edit</button>
        <button onClick={() => onDuplicate?.(product.id)} className="px-2 py-1 bg-gray-600 rounded text-sm">Duplicate</button>
        <button onClick={() => onDelete?.(product.id)} className="px-2 py-1 bg-red-600 rounded text-sm">Delete</button>
      </div>
    </div>
  );
}

export default ProductCard;
