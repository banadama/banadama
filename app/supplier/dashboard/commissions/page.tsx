import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Commissions | Banadama Creator/Affiliate',
};

export default async function CommissionsPage() {
  const user = await requireRole(['CREATOR', 'AFFILIATE']);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Earnings & Commissions</h1>
        <p className="text-gray-600 mt-1">
          Track your commissions and earnings
        </p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₦0.00</p>
          <p className="text-xs text-gray-500 mt-2">All time</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₦0.00</p>
          <p className="text-xs text-gray-500 mt-2">Pending payout</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">₦0.00</p>
          <p className="text-xs text-gray-500 mt-2">Awaiting verification</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Withdrawn</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₦0.00</p>
          <p className="text-xs text-gray-500 mt-2">Total withdrawn</p>
        </div>
      </div>

      {/* Commission Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Recent Commissions</h2>
        </div>
        <div className="p-12 text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">No commissions yet</p>
          <p className="text-sm mt-1">Your commissions will appear here as they are earned</p>
        </div>
      </div>

      {/* Payout Methods */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Payout Settings</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Configure your payment method to receive commissions</p>
        </div>
      </div>
    </div>
  );
}
