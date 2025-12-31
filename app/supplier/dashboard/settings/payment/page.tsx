import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Payment Settings | Banadama Supplier',
};

export default async function PaymentSettingsPage() {
  const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER', 'CREATOR', 'AFFILIATE');

  return (
    <div className="max-w-2xl">
      {/* Page Header */}
      <div className="mb-6">
        <a href="/supplier/dashboard/settings" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center gap-2">
          <span>←</span> Back to Settings
        </a>
        <h1 className="text-3xl font-bold text-gray-900">Payment & Payout</h1>
        <p className="text-gray-600 mt-1">
          Manage your payment methods and payout settings
        </p>
      </div>

      {/* Payout Account */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Payout Method</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center">
              <input
                type="radio"
                name="payout"
                id="bank"
                className="w-4 h-4 text-blue-600"
                defaultChecked
              />
              <label htmlFor="bank" className="ml-3 flex-1">
                <p className="font-medium text-gray-900">Bank Transfer</p>
                <p className="text-sm text-gray-600">Direct deposit to your bank account</p>
              </label>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center">
              <input
                type="radio"
                name="payout"
                id="wallet"
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="wallet" className="ml-3 flex-1">
                <p className="font-medium text-gray-900">Banadama Wallet</p>
                <p className="text-sm text-gray-600">Keep earnings in your digital wallet</p>
              </label>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Bank Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                placeholder="Your bank name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Account Number
              </label>
              <input
                type="text"
                placeholder="Your account number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                placeholder="Name on account"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Bank Code
              </label>
              <input
                type="text"
                placeholder="Bank sorting/routing code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payout Schedule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Payout Schedule</h2>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Frequency
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              Payouts are processed every {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Payment Details
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
