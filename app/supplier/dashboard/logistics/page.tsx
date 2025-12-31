import Link from 'next/link';
import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Logistics | Banadama Supplier',
};

export default async function LogisticsPage() {
  const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Logistics & Shipping</h1>
        <p className="text-gray-600 mt-1">
          Manage shipping preferences and delivery options
        </p>
      </div>

      {/* Logistics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Pending Shipments</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">In Transit</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Return Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0%</p>
        </div>
      </div>

      {/* Shipping Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Preferences</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Carrier Preferences</h3>
            <p className="text-sm text-gray-600 mt-1">Configure your preferred shipping carriers</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Zones & Rates</h3>
            <p className="text-sm text-gray-600 mt-1">Set shipping zones and delivery rates</p>
          </div>
        </div>
      </div>
    </div>
  );
}
