import Link from 'next/link'
import React from 'react'

export default function RetailerSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold">Retailer</h2>
      <nav className="mt-4 flex flex-col gap-2 text-sm">
        <Link href="/supplier/dashboard" className="hover:text-white">🏠 Dashboard</Link>
        <Link href="/supplier/dashboard/orders" className="hover:text-white">📦 Orders</Link>
        <Link href="/supplier/dashboard/promotions" className="hover:text-white">🔥 Promotions</Link>
        <Link href="/supplier/dashboard/products" className="hover:text-white">🛍️ Product Catalog</Link>
        <Link href="/supplier/dashboard/inventory" className="hover:text-white">📊 Inventory</Link>
        <Link href="/supplier/dashboard/returns" className="hover:text-white">↩️ Returns</Link>
        <Link href="/supplier/dashboard/analytics" className="hover:text-white">📈 Analytics</Link>
        <Link href="/supplier/dashboard/messages" className="hover:text-white">💬 Messages</Link>
        <Link href="/supplier/dashboard/settings" className="hover:text-white">⚙️ Settings</Link>
      </nav>
    </aside>
  )
}
