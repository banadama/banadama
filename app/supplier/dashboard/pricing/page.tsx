import Link from 'next/link';
import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Pricing | Banadama Supplier',
};

export default async function PricingPage() {
  const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pricing Tiers</h1>
        <p className="text-gray-600 mt-1">
          Manage pricing for different customer segments
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Retail', 'Wholesale', 'B2B'].map((tier) => (
          <div key={tier} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{tier}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Price Range</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Minimum Order</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Rules */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing Rules</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No pricing rules configured</p>
        </div>
      </div>
    </div>
  );
}
