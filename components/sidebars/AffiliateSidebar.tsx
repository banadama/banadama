import Link from 'next/link'
import React from 'react'

export default function AffiliateSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold">Affiliate</h2>
      <nav className="mt-4 flex flex-col gap-2 text-sm">
        <Link href="/supplier/dashboard" className="hover:text-white">🏠 Dashboard</Link>
        <Link href="/supplier/dashboard/referrals" className="hover:text-white">🔗 Referral Links</Link>
        <Link href="/supplier/dashboard/commissions" className="hover:text-white">💰 Commissions</Link>
        <Link href="/supplier/dashboard/payouts" className="hover:text-white">🏧 Payouts</Link>
        <Link href="/supplier/dashboard/reports" className="hover:text-white">📈 Reports</Link>
        <Link href="/supplier/dashboard/promotions" className="hover:text-white">🎯 Promotions</Link>
        <Link href="/supplier/dashboard/messages" className="hover:text-white">💬 Messages</Link>
        <Link href="/supplier/dashboard/settings" className="hover:text-white">⚙️ Settings</Link>
      </nav>
    </aside>
  )
}
