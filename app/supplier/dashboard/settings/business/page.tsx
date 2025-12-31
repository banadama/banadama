import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Business Settings | Banadama Supplier',
};

export default async function BusinessSettingsPage() {
  const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER', 'CREATOR', 'AFFILIATE');

  return (
    <div className="max-w-2xl">
      {/* Page Header */}
      <div className="mb-6">
        <a href="/supplier/dashboard/settings" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center gap-2">
          <span>←</span> Back to Settings
        </a>
        <h1 className="text-3xl font-bold text-gray-900">Business Information</h1>
        <p className="text-gray-600 mt-1">
          Update your business profile and details
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        {/* Business Name */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Business Name
          </label>
          <input
            type="text"
            placeholder="Your business name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 mt-1">This is how your business appears to customers</p>
        </div>

        {/* Business Email */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Business Email
          </label>
          <input
            type="email"
            placeholder="business@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 mt-1">Customers will use this to contact you</p>
        </div>

        {/* Business Phone */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+234..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Business Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Business Description
          </label>
          <textarea
            rows={4}
            placeholder="Tell customers about your business..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Business Address
          </label>
          <input
            type="text"
            placeholder="Street address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="State"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
