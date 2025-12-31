import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { Building2, MapPin, CreditCard, Phone, Mail, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Settings | Banadama Supplier',
};

export default async function SettingsPage() {
  const user = await requireRole('FACTORY', 'WHOLESALER', 'RETAILER', 'CREATOR', 'AFFILIATE');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your business profile and preferences
        </p>
      </div>

      {/* Logo Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Business Logo</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Upload Logo
            </button>
            <p className="text-sm text-gray-600 mt-2">
              PNG or JPG (Max 2MB)
            </p>
          </div>
        </div>
      </div>

      {/* Business Address */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Business Address
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Street Address"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="City"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="State/Region"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Bank Account */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Bank Account Details
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Bank Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Account Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Account Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Routing Number / SWIFT Code"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Link href="/supplier/dashboard/settings/business" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900">Additional Information</h3>
            <p className="text-sm text-gray-600 mt-1">Business description, social media, and more</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link href="/supplier/dashboard/settings/payment" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900">Payment & Payout</h3>
            <p className="text-sm text-gray-600 mt-1">Manage payment methods and payout settings</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link href="/supplier/dashboard/settings/notifications" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
          <div>
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600 mt-1">Control how you receive notifications</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button className="px-8 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Cancel
        </button>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Save Changes
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-bold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-800 mb-4">
          Irreversible actions - proceed with caution
        </p>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
          Delete Account
        </button>
      </div>
    </div>
  );
}
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Link href="/supplier/dashboard/settings/business" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900">Business Information</h3>
            <p className="text-sm text-gray-600 mt-1">Update your business details and profile</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link href="/supplier/dashboard/settings/payment" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900">Payment & Payout</h3>
            <p className="text-sm text-gray-600 mt-1">Manage payment methods and payout settings</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link href="/supplier/dashboard/settings/notifications" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
          <div>
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600 mt-1">Control how you receive notifications</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-bold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-800 mb-4">
          Irreversible actions - proceed with caution
        </p>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
          Delete Account
        </button>
      </div>
    </div>
  );
}
