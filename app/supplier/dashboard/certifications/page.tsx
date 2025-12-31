import Link from 'next/link';
import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Certifications | Banadama Supplier',
};

export default async function CertificationsPage() {
  const user = await requireRole(['FACTORY']);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certifications & Compliance</h1>
          <p className="text-gray-600 mt-1">
            Manage your business certifications and compliance documents
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Add Certification
        </button>
      </div>

      {/* Certification Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'ISO Certification', expiry: 'Not Added' },
          { name: 'HACCP Certification', expiry: 'Not Added' },
          { name: 'Business License', expiry: 'Not Added' },
          { name: 'Tax ID', expiry: 'Not Added' },
        ].map((cert) => (
          <div key={cert.name} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{cert.expiry}</p>
              </div>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                Upload
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="font-bold text-gray-900 mb-2">Compliance Status</h2>
        <p className="text-sm text-gray-700">
          All certifications are verified by our team. Upload your documents to ensure your business remains in compliance.
        </p>
      </div>
    </div>
  );
}
