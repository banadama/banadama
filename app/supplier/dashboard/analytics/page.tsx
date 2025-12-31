import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Analytics | Banadama Supplier',
};

export default async function AnalyticsPage() {
  const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER', 'CREATOR', 'AFFILIATE');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">
          Track your business performance and insights
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-4 bg-white rounded-lg border border-gray-200 p-4">
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₦0.00</p>
          <p className="text-xs text-gray-500 mt-2">0% vs last period</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          <p className="text-xs text-gray-500 mt-2">0% vs last period</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0%</p>
          <p className="text-xs text-gray-500 mt-2">0% vs last period</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₦0.00</p>
          <p className="text-xs text-gray-500 mt-2">0% vs last period</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Sales Trend</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>Chart placeholder</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <p>No data yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
