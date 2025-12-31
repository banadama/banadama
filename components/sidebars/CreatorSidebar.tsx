import Link from 'next/link'
import React from 'react'

export default function CreatorSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold">Creator</h2>
      <nav className="mt-4 flex flex-col gap-2 text-sm">
        <Link href="/supplier/dashboard" className="hover:text-white">🏠 Dashboard</Link>
        <Link href="/supplier/dashboard/service-packages" className="hover:text-white">🎁 Service Packages</Link>
        <Link href="/supplier/dashboard/orders" className="hover:text-white">📦 Orders</Link>
        <Link href="/supplier/dashboard/portfolio" className="hover:text-white">🖼️ Portfolio</Link>
        <Link href="/supplier/dashboard/messages" className="hover:text-white">💬 Messages</Link>
        <Link href="/supplier/dashboard/reviews" className="hover:text-white">⭐ Reviews</Link>
        <Link href="/supplier/dashboard/analytics" className="hover:text-white">📈 Analytics</Link>
        <Link href="/supplier/dashboard/settings" className="hover:text-white">⚙️ Settings</Link>
      </nav>
    </aside>
  )
}
