'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface ServicePackage {
  id?: string;
  name: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  features: string[];
}

interface ServicePackageManagerProps {
  packages: ServicePackage[];
  onPackagesChange: (packages: ServicePackage[]) => void;
}

const PRESET_PACKAGES = [
  {
    name: 'Basic',
    icon: '🎯',
    description: 'Essential service package',
  },
  {
    name: 'Standard',
    icon: '⭐',
    description: 'Most popular choice',
  },
  {
    name: 'Premium',
    icon: '👑',
    description: 'Full-featured service',
  },
  {
    name: 'Enterprise',
    icon: '🚀',
    description: 'Custom & dedicated',
  },
];

export function ServicePackageManager({
  packages,
  onPackagesChange,
}: ServicePackageManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addPackage = (templateName?: string) => {
    const newPackage: ServicePackage = {
      id: `package-${Date.now()}`,
      name: templateName || 'New Package',
      price: 0,
      deliveryTime: 5,
      revisions: 1,
      features: [],
    };
    onPackagesChange([...packages, newPackage]);
    setEditingIndex(packages.length);
  };

  const updatePackage = (index: number, updates: Partial<ServicePackage>) => {
    const newPackages = [...packages];
    newPackages[index] = { ...newPackages[index], ...updates };
    onPackagesChange(newPackages);
  };

  const removePackage = (index: number) => {
    const newPackages = packages.filter((_, i) => i !== index);
    onPackagesChange(newPackages);
  };

  const addFeature = (index: number) => {
    const pkg = packages[index];
    updatePackage(index, {
      features: [...(pkg.features || []), ''],
    });
  };

  const updateFeature = (pkgIndex: number, featureIndex: number, value: string) => {
    const pkg = packages[pkgIndex];
    const newFeatures = [...(pkg.features || [])];
    newFeatures[featureIndex] = value;
    updatePackage(pkgIndex, { features: newFeatures });
  };

  const removeFeature = (pkgIndex: number, featureIndex: number) => {
    const pkg = packages[pkgIndex];
    const newFeatures = pkg.features?.filter((_, i) => i !== featureIndex) || [];
    updatePackage(pkgIndex, { features: newFeatures });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Service Packages</h3>
          <p className="text-sm text-gray-600 mt-1">
            Offer different service tiers to customers
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <button
              type="button"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
            >
              + Use Template
            </button>
            <div className="hidden group-hover:block absolute right-0 bg-white border rounded-lg shadow-lg z-10 w-48">
              {PRESET_PACKAGES.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => addPackage(template.name)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-b last:border-b-0"
                >
                  <div className="font-medium">{template.icon} {template.name}</div>
                  <div className="text-xs text-gray-500">{template.description}</div>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => addPackage()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            + Add Package
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg, i) => (
            <div
              key={pkg.id || i}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    {editingIndex === i ? (
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) =>
                          updatePackage(i, { name: e.target.value })
                        }
                        className="w-full px-2 py-1 bg-white text-gray-900 rounded text-sm font-bold"
                      />
                    ) : (
                      <h4 className="font-bold text-lg">{pkg.name}</h4>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      editingIndex === i
                        ? setEditingIndex(null)
                        : setEditingIndex(i)
                    }
                    className="text-white hover:text-gray-200"
                  >
                    {editingIndex === i ? '✓' : '✎'}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Price */}
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase">
                    Price
                  </label>
                  {editingIndex === i ? (
                    <input
                      type="number"
                      step="0.01"
                      value={pkg.price}
                      onChange={(e) =>
                        updatePackage(i, {
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded mt-1"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(pkg.price)}
                    </div>
                  )}
                </div>

                {/* Delivery & Revisions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Delivery Time (days)
                    </label>
                    {editingIndex === i ? (
                      <input
                        type="number"
                        min="1"
                        value={pkg.deliveryTime}
                        onChange={(e) =>
                          updatePackage(i, {
                            deliveryTime: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 border rounded mt-1 text-sm"
                      />
                    ) : (
                      <div className="mt-1 text-sm text-gray-900">
                        {pkg.deliveryTime} days
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Revisions Included
                    </label>
                    {editingIndex === i ? (
                      <input
                        type="number"
                        min="0"
                        value={pkg.revisions}
                        onChange={(e) =>
                          updatePackage(i, {
                            revisions: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 border rounded mt-1 text-sm"
                      />
                    ) : (
                      <div className="mt-1 text-sm text-gray-900">
                        {pkg.revisions} revision{pkg.revisions !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Features Included
                    </label>
                    {editingIndex === i && (
                      <button
                        type="button"
                        onClick={() => addFeature(i)}
                        className="text-xs text-blue-600 hover:text-blue-900 font-medium"
                      >
                        + Add
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {pkg.features && pkg.features.length > 0 ? (
                      pkg.features.map((feature, fi) => (
                        <div key={fi} className="flex gap-2 items-start">
                          <span className="text-green-600 mt-0.5">✓</span>
                          {editingIndex === i ? (
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) =>
                                  updateFeature(i, fi, e.target.value)
                                }
                                placeholder="Feature description"
                                className="flex-1 px-2 py-1 border rounded text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => removeFeature(i, fi)}
                                className="text-red-600 hover:text-red-900"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-700">{feature}</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">
                        {editingIndex === i
                          ? 'No features added yet'
                          : 'No features listed'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 border-t px-4 py-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => removePackage(i)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Remove
                </button>
                {editingIndex === i && (
                  <button
                    type="button"
                    onClick={() => setEditingIndex(null)}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No service packages yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Add packages to offer different service tiers to your customers
          </p>
          <div className="flex gap-2 mt-4 justify-center">
            <button
              type="button"
              onClick={() => addPackage()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              + Add Package
            </button>
            <div className="relative group">
              <button
                type="button"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
              >
                📋 Use Template
              </button>
              <div className="hidden group-hover:block absolute left-0 bg-white border rounded-lg shadow-lg z-10 w-48">
                {PRESET_PACKAGES.map((template) => (
                  <button
                    key={template.name}
                    type="button"
                    onClick={() => addPackage(template.name)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-b last:border-b-0"
                  >
                    <div className="font-medium">{template.icon} {template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
