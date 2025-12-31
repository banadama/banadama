import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Notification Settings | Banadama Supplier',
};

export default async function NotificationSettingsPage() {
  const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER', 'CREATOR', 'AFFILIATE');

  return (
    <div className="max-w-2xl">
      {/* Page Header */}
      <div className="mb-6">
        <a href="/supplier/dashboard/settings" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center gap-2">
          <span>←</span> Back to Settings
        </a>
        <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-gray-600 mt-1">
          Control how you receive notifications
        </p>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4">
        {/* Order Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Order Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">Get notified when new orders are placed</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 space-y-2 ml-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600">SMS notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600">Push notifications</span>
            </label>
          </div>
        </div>

        {/* Message Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Message Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">Get notified about new messages</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 space-y-2 ml-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600">SMS notifications</span>
            </label>
          </div>
        </div>

        {/* Review Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Review & Rating Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">Get notified when customers leave reviews</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Payment Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Payment & Payout Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">Get notified about payments and payouts</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Marketing Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Marketing & Promotions</h3>
              <p className="text-sm text-gray-600 mt-1">Receive updates about promotions and features</p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Quiet Hours</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose when you don't want to receive notifications
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                From
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                To
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4 pt-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Preferences
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
