# 🎨 FRONTEND ENGINEER - IMPLEMENTATION GUIDE

## Overview

Complete UI implementation for Banadama MVP with modern, premium design and full API integration.

---

## ✅ PAGES TO BUILD

### **Public Pages**
1. ✅ Landing Page (`app/(public)/page.tsx`) - COMPLETED
2. 🔄 Marketplace (`app/(public)/marketplace/page.tsx`)
3.🔄 Buy Near Me (`app/(public)/buy-near-me/page.tsx`)
4. 🔄 Global Market (`app/(public)/global-market/page.tsx`)
5. 🔄 Product Detail (`app/(public)/product/[id]/page.tsx`)

### **Buyer Dashboard** (Protected - BUYER role)
6. 🔄 Dashboard (`app/(buyer)/buyer/dashboard/page.tsx`)
7. 🔄 Orders (`app/(buyer)/buyer/orders/page.tsx`)
8. 🔄 Requests (`app/(buyer)/buyer/requests/page.tsx`)
9. 🔄 Wallet (`app/(buyer)/buyer/wallet/page.tsx`)
10. 🔄 Messages (`app/(buyer)/buyer/messages/page.tsx`)

---

## 🎨 DESIGN SYSTEM

### **Color Palette**
```css
/* Primary */
--blue-600: #2563eb
--purple-600: #9333ea
--pink-600: #db2777

/* Background */
--slate-950: #020617
--slate-900: #0f172a
--slate-800: #1e293b

/* Text */
--white: #ffffff
--slate-300: #cbd5e1
--slate-400: #94a3b8
```

### **Typography**
```css
font-family: 'Inter', system-ui, sans-serif;

/* Headings */
h1: text-5xl md:text-7xl font-bold
h2: text-4xl font-bold
h3: text-xl font-bold

/* Body */
p: text-base text-slate-400
```

### **Components**
```typescript
// Gradient Button
<button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
  Button Text
</button>

// Card
<div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300">
  Card Content
</div>

// Input
<input className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all" />
```

---

## 📝 IMPLEMENTATION TEMPLATES

### **1. Marketplace Page with API**

```typescript
// app/(public)/marketplace/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  unitPrice: number;
  images: string[];
  categoryName: string;
  countryOfOrigin: string;
  seller: {
    name: string;
    verified: boolean;
  };
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    search: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.country) params.set('country', filters.country);
      if (filters.search) params.set('search', filters.search);
      params.set('limit', '20');

      const response = await fetch(`/api/marketplace/products?${params}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-slate-400">Browse verified suppliers worldwide</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
          
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
          >
            <option value="">All Categories</option>
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
          </select>

          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
          >
            <option value="">All Countries</option>
            <option value="NG">Nigeria</option>
            <option value="BD">Bangladesh</option>
            <option value="CN">China</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                  <div className="aspect-square bg-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                    {/* Image placeholder */}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-slate-400">{product.seller.name}</span>
                      {product.seller.verified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      )}
                    </div>

                    <div className="text-2xl font-bold text-white">
                      ₦{product.unitPrice.toLocaleString()}
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
```

### **2. Product Detail Page**

```typescript
// app/(public)/product/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch product details - you'll need to create this API endpoint
    // For now, using marketplace API
  }, [params.id]);

  async function handleBuyNow() {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: params.id,
          quantity,
          deliveryAddress: 'User default address', // Get from user profile
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/buyer/orders/${data.order.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  async function handleRequestQuote() {
    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: params.id,
          productName: product.name,
          quantity,
          deliveryAddress: 'User default address',
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/buyer/requests/${data.rfq.id}`);
      }
    } catch (error) {
      console.error('Error creating RFQ:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-slate-900 rounded-2xl border border-slate-800"></div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {product?.name || 'Loading...'}
            </h1>
            
            <div className="text-5xl font-bold text-white mb-8">
              ₦{product?.unitPrice.toLocaleString()}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-slate-300 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBuyNow}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all"
              >
                Buy Now
              </button>
              
              <button
                onClick={handleRequestQuote}
                className="flex-1 px-8 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### **3. Buyer Dashboard (Protected)**

```typescript
// app/(buyer)/buyer/dashboard/page.tsx
import { requireRole } from '@/lib/auth';

export default async function BuyerDashboard() {
  const user = await requireRole('BUYER');

  // Fetch dashboard data server-side
  const dashboardData = {
    activeOrders: 5,
    pendingQuotes: 3,
    walletBalance: 150000,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Welcome back, {user.email}
      </h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl">
          <div className="text-4xl font-bold text-white mb-2">
            {dashboardData.activeOrders}
          </div>
          <div className="text-slate-400">Active Orders</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl">
          <div className="text-4xl font-bold text-white mb-2">
            {dashboardData.pendingQuotes}
          </div>
          <div className="text-slate-400">Pending Quotes</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-xl">
          <div className="text-4xl font-bold text-white mb-2">
            ₦{dashboardData.walletBalance.toLocaleString()}
          </div>
          <div className="text-slate-400">Wallet Balance</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/marketplace"
           className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-blue-500/50 transition"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            Browse Marketplace
          </h3>
          <p className="text-slate-400">Find products from verified suppliers</p>
        </Link>

        <Link
          href="/buyer/requests/new"
          className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-purple-500/50 transition"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            Create RFQ
          </h3>
          <p className="text-slate-400">Request custom quotes for bulk orders</p>
        </Link>
      </div>
    </div>
  );
}
```

---

## 🔐 RBAC IMPLEMENTATION

Every protected page must use `requireRole()`:

```typescript
// Example: Buyer-only page
import { requireRole } from '@/lib/auth';

export default async function BuyerPage() {
  await requireRole('BUYER'); // Redirects if not BUYER

  return <div>Protected Content</div>;
}
```

---

## 📡 API INTEGRATION PATTERNS

### **Fetching Data**
```typescript
// Client component
const [data, setData] = useState([]);

useEffect(() => {
  fetch('/api/orders')
    .then(r => r.json())
    .then(setData);
}, []);
```

### **POST Request**
```typescript
async function createRFQ(data: any) {
  const response = await fetch('/api/rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  return response.json();
}
```

---

## ✅ COMPLETION CHECKLIST

- [ ] All public pages created
- [ ] Buyer dashboard pages created
- [ ] API integration complete
- [ ] Loading states implemented
- [ ] Error handling added
- [ ] Responsive design verified
- [ ] RBAC enforced on protected pages

---

**Note:** This guide provides templates. Implement all pages following these patterns for consistency.
