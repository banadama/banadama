'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getRequirements } from '@/lib/verification-requirements';

interface VerificationUploadProps {
  country: string;
  role: string;
  onSubmit?: (documents: Record<string, File>) => Promise<void>;
}

export default function VerificationUpload({
  country,
  role,
  onSubmit,
}: VerificationUploadProps) {
  const requirements = getRequirements(country, role);
  const [uploads, setUploads] = useState<Record<string, { file?: File; status?: 'pending' | 'approved' | 'rejected'; reason?: string }>>({});
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (docId: string, file: File) => {
    setUploads(prev => ({
      ...prev,
      [docId]: { file, status: 'pending' },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const documents = Object.entries(uploads)
        .filter(([_, data]) => data.file)
        .reduce((acc, [docId, data]) => {
          if (data.file) acc[docId] = data.file;
          return acc;
        }, {} as Record<string, File>);

      if (onSubmit) {
        await onSubmit(documents);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadedCount = Object.values(uploads).filter(u => u.file).length;
  const allSubmitted = uploadedCount === requirements.length;

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-900">Verification Required</p>
          <p className="text-sm text-yellow-800 mt-1">
            Your account is pending verification. Upload all required documents to start selling.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-gray-900">Upload Progress</p>
          <p className="text-sm font-semibold text-blue-600">
            {uploadedCount} of {requirements.length} documents
          </p>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(uploadedCount / requirements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {requirements.map(doc => {
          const upload = uploads[doc.id];
          const hasFile = !!upload?.file;
          const status = upload?.status;

          return (
            <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {status === 'approved' && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Approved</span>
                    </div>
                  )}
                  {status === 'rejected' && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-50 rounded-full">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-medium text-red-700">Rejected</span>
                    </div>
                  )}
                  {hasFile && !status && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">Uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload Area */}
              {!status || status === 'rejected' ? (
                <label className="block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(doc.id, file);
                    }}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    {hasFile ? (
                      <>
                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="font-medium text-gray-900">{upload?.file?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, PNG (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </label>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800">✓ Approved and verified</p>
                </div>
              )}

              {/* Rejection Reason */}
              {status === 'rejected' && upload?.reason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
                  <p className="text-sm text-red-700 mt-1">{upload.reason}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={!allSubmitted || loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Verification Timeline:</strong> Most applications are reviewed within 24-48 hours. You'll receive an email notification with the result.
        </p>
      </div>
    </div>
  );
}
