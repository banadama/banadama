import Link from 'next/link';
import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Orders | Banadama Supplier',
};

export default async function OrdersPage() {
  const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER', 'CREATOR', 'AFFILIATE');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">
          Manage and track your orders
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
          <button
            key={status}
            className="px-4 py-3 border-b-2 border-transparent hover:border-gray-300 font-medium text-sm text-gray-600 transition-colors"
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-12 text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm mt-1">Your orders will appear here when customers purchase your products</p>
        </div>
      </div>
    </div>
  );
}
