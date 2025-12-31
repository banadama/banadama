import Link from 'next/link'
import React from 'react'

export default function FactorySidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold">Factory</h2>
      <nav className="mt-4 flex flex-col gap-2 text-sm">
        <Link href="/supplier/dashboard" className="hover:text-white">🏠 Dashboard</Link>
        <Link href="/supplier/dashboard/orders" className="hover:text-white">📦 Orders</Link>
        <Link href="/supplier/dashboard/production" className="hover:text-white">🏭 Production Capacity</Link>
        <Link href="/supplier/dashboard/inventory" className="hover:text-white">📊 Inventory Levels</Link>
        <Link href="/supplier/dashboard/products" className="hover:text-white">🎨 Product Catalog</Link>
        <Link href="/supplier/dashboard/pricing" className="hover:text-white">💰 Pricing & MOQ</Link>
        <Link href="/supplier/dashboard/logistics" className="hover:text-white">🚚 Shipping & Logistics</Link>
        <Link href="/supplier/dashboard/certifications" className="hover:text-white">📄 Certifications</Link>
        <Link href="/supplier/dashboard/messages" className="hover:text-white">💬 Messages</Link>
        <Link href="/supplier/dashboard/analytics" className="hover:text-white">📈 Analytics</Link>
        <Link href="/supplier/dashboard/settings" className="hover:text-white">⚙️ Settings</Link>
      </nav>
    </aside>
  )
}
