'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ImageUploader } from '../components/image-uploader';
import { VariantManager } from '../components/variant-manager';
import { PricingTierManager } from '../components/pricing-tier-manager';
import { ServicePackageManager } from '../components/service-package-manager';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  // Step 1: Basic Info
  name: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  subcategoryId?: string;
  brand: string;
  tags: string[];

  // Step 2: Images
  images: string[];
  videoUrl: string;
  mainImageUrl: string;

  // Step 3: Pricing & Inventory
  basePrice: number;
  compareAtPrice?: number;
  costPrice?: number;
  moq: number;
  stockQuantity: number;
  pricingType: string;
  productionCapacity?: number;
  leadTime?: number;
  hourlyRate?: number;
  deliveryTime?: number;
  revisionsIncluded?: number;
  serviceType?: string;
  commissionRate?: number;
  lowStockAlert: number;
  allowBackorder: boolean;
  continueSellingOutOfStock: boolean;
  pricingTiers?: Array<{ minQty: number; maxQty?: number; price: number }>;
  servicePackages?: Array<{ name: string; price: number; deliveryTime: number; revisions: number }>;

  // Step 4: Specifications
  attributes: Array<{ name: string; value: string }>;
  variants?: Array<{ name: string; sku: string; price: number; stock: number }>;
  hasVariants: boolean;

  // Step 5: Shipping
  shippingMode: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  shippingFee?: number;
  estimatedDeliveryMin?: number;
  estimatedDeliveryMax?: number;
  deliveryMethod?: string;

  // Step 6: Preview & Publish
  status: string;
  metaTitle: string;
  metaDescription: string;
  visibility: { main: boolean; ng: boolean; bd: boolean };
}

const initialFormData: FormData = {
  name: '',
  description: '',
  categorySlug: '',
  categoryName: '',
  brand: '',
  tags: [],
  images: [],
  videoUrl: '',
  mainImageUrl: '',
  basePrice: 0,
  moq: 1,
  stockQuantity: 0,
  pricingType: 'FIXED',
  lowStockAlert: 10,
  allowBackorder: false,
  continueSellingOutOfStock: false,
  attributes: [],
  hasVariants: false,
  shippingMode: 'LOCAL',
  status: 'DRAFT',
  metaTitle: '',
  metaDescription: '',
  visibility: { main: true, ng: true, bd: false },
};

export default function AddProductPage() {
  const router = useRouter();
  const params = useParams();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        router.push('/auth/login');
      }
    };
    fetchUser();
  }, []);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (step < 6) {
      setStep((step + 1) as Step);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.categorySlug || !formData.basePrice) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const url = params.id
        ? `/api/supplier/products/${params.id}`
        : '/api/supplier/products';
      const method = params.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save product');

      const data = await res.json();
      router.push('/supplier/dashboard/products');
    } catch (error: any) {
      alert(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {params.id ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-1">Step {step} of 6</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center gap-2">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
                <p className="text-xs text-center text-gray-600 mt-1">
                  {['Basic', 'Images', 'Pricing', 'Specs', 'Shipping', 'Publish'][s - 1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {step === 1 && (
          <Step1BasicInfo formData={formData} updateFormData={updateFormData} />
        )}
        {step === 2 && (
          <Step2Images formData={formData} updateFormData={updateFormData} />
        )}
        {step === 3 && (
          <Step3Pricing formData={formData} updateFormData={updateFormData} user={user} />
        )}
        {step === 4 && (
          <Step4Specifications formData={formData} updateFormData={updateFormData} />
        )}
        {step === 5 && (
          <Step5Shipping formData={formData} updateFormData={updateFormData} user={user} />
        )}
        {step === 6 && (
          <Step6Preview formData={formData} updateFormData={updateFormData} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium"
          >
            ← Back
          </button>

          {step < 6 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Next →
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => updateFormData({ status: 'DRAFT' }) || handleSubmit()}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium"
              >
                Save as Draft
              </button>
              <button
                onClick={() => updateFormData({ status: 'ACTIVE' }) || handleSubmit()}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Publishing...' : 'Publish Product'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP COMPONENTS
// ============================================

function Step1BasicInfo({ formData, updateFormData }: any) {
  const categories = [
    { slug: 'electronics', name: 'Electronics' },
    { slug: 'fashion', name: 'Fashion' },
    { slug: 'home', name: 'Home' },
    { slug: 'industrial', name: 'Industrial' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          maxLength={200}
          placeholder="Enter product name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.name.length}/200</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={4}
          placeholder="Enter product description"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.categorySlug}
            onChange={(e) => {
              const cat = categories.find((c) => c.slug === e.target.value);
              updateFormData({
                categorySlug: e.target.value,
                categoryName: cat?.name || '',
              });
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => updateFormData({ brand: e.target.value })}
            placeholder="Enter brand name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) =>
            updateFormData({
              tags: e.target.value.split(',').map((t) => t.trim()),
            })
          }
          placeholder="e.g., wireless, trending, bestseller"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function Step2Images({ formData, updateFormData }: any) {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Images & Media</h2>

      <ImageUploader
        images={formData.images}
        onImagesChange={(images) => updateFormData({ images })}
        maxImages={10}
        maxSize={5 * 1024 * 1024}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Video (YouTube/Vimeo URL)
        </label>
        <input
          type="url"
          value={formData.videoUrl}
          onChange={(e) => updateFormData({ videoUrl: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function Step3Pricing({ formData, updateFormData, user }: any) {
  const showFactoryOptions = user?.role === 'FACTORY';
  const showCreatorOptions = user?.role === 'CREATOR';
  const showAffiliateOptions = user?.role === 'AFFILIATE';

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Pricing & Inventory</h2>

      {!showAffiliateOptions && (
        <>
          {showFactoryOptions && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricingType"
                      value="FIXED"
                      checked={formData.pricingType === 'FIXED'}
                      onChange={(e) =>
                        updateFormData({ pricingType: e.target.value })
                      }
                      className="mr-2"
                    />
                    Fixed Price
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricingType"
                      value="TIERED"
                      checked={formData.pricingType === 'TIERED'}
                      onChange={(e) =>
                        updateFormData({ pricingType: e.target.value })
                      }
                      className="mr-2"
                    />
                    Tiered Pricing (MOQ-based)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Quantity (MOQ) *
                  </label>
                  <input
                    type="number"
                    value={formData.moq}
                    onChange={(e) =>
                      updateFormData({ moq: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) =>
                      updateFormData({ basePrice: parseFloat(e.target.value) })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Production Capacity (units/month)
                  </label>
                  <input
                    type="number"
                    value={formData.productionCapacity || ''}
                    onChange={(e) =>
                      updateFormData({
                        productionCapacity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Time (days)
                  </label>
                  <input
                    type="number"
                    value={formData.leadTime || ''}
                    onChange={(e) =>
                      updateFormData({ leadTime: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Pricing Tiers */}
              {formData.pricingType === 'TIERED' && (
                <PricingTierManager
                  tiers={formData.pricingTiers || []}
                  onTiersChange={(tiers) => updateFormData({ pricingTiers: tiers })}
                  basePrice={formData.basePrice}
                />
              )}
            </>
          )}

          {!showFactoryOptions && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) =>
                    updateFormData({ basePrice: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              {!showCreatorOptions && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compare at Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice || ''}
                    onChange={(e) =>
                      updateFormData({
                        compareAtPrice: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {!showCreatorOptions && !showFactoryOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) =>
                  updateFormData({ stockQuantity: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          )}

          {showCreatorOptions && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time (days) *
                  </label>
                  <input
                    type="number"
                    value={formData.deliveryTime || ''}
                    onChange={(e) =>
                      updateFormData({
                        deliveryTime: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revisions Included
                  </label>
                  <input
                    type="number"
                    value={formData.revisionsIncluded || ''}
                    onChange={(e) =>
                      updateFormData({
                        revisionsIncluded: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Service Packages */}
              <ServicePackageManager
                packages={formData.servicePackages || []}
                onPackagesChange={(packages) =>
                  updateFormData({ servicePackages: packages })
                }
              />
            </>
          )}
        </>
      )}

      {showAffiliateOptions && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Pricing is set by the original supplier
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Commission Rate (%) *
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.commissionRate || ''}
            onChange={(e) =>
              updateFormData({ commissionRate: parseFloat(e.target.value) })
            }
            className="w-full px-4 py-2 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-2">
            Platform default: 10%
          </p>
        </div>
      )}
    </div>
  );
}

function Step4Specifications({ formData, updateFormData }: any) {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Specifications & Attributes</h2>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.hasVariants}
            onChange={(e) => updateFormData({ hasVariants: e.target.checked })}
          />
          <span className="text-sm font-medium text-gray-700">
            This product has variants (color, size, etc.)
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Attributes
        </label>
        <div className="space-y-3">
          {formData.attributes.map((attr: any, i: number) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={attr.name}
                onChange={(e) => {
                  const newAttrs = [...formData.attributes];
                  newAttrs[i].name = e.target.value;
                  updateFormData({ attributes: newAttrs });
                }}
                placeholder="e.g., Color"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={attr.value}
                onChange={(e) => {
                  const newAttrs = [...formData.attributes];
                  newAttrs[i].value = e.target.value;
                  updateFormData({ attributes: newAttrs });
                }}
                placeholder="e.g., Red, Blue, Green"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() =>
                  updateFormData({
                    attributes: formData.attributes.filter((_: any, idx: number) => idx !== i),
                  })
                }
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            updateFormData({
              attributes: [...formData.attributes, { name: '', value: '' }],
            })
          }
          className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          + Add Attribute
        </button>
      </div>

      {/* Variant Manager */}
      {formData.hasVariants && (
        <VariantManager
          variants={formData.variants || []}
          onVariantsChange={(variants) => updateFormData({ variants })}
          attributes={formData.attributes}
          basePrice={formData.basePrice}
          baseStock={formData.stockQuantity}
        />
      )}
    </div>
  );
}

function Step5Shipping({ formData, updateFormData, user }: any) {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Shipping & Logistics</h2>

      {user?.role === 'FACTORY' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Mode
            </label>
            <div className="flex gap-4">
              <label>
                <input type="radio" value="LOCAL" checked={formData.shippingMode === 'LOCAL'} onChange={(e) => updateFormData({ shippingMode: e.target.value })} />
                Local Only
              </label>
              <label>
                <input type="radio" value="INTERNATIONAL" checked={formData.shippingMode === 'INTERNATIONAL'} onChange={(e) => updateFormData({ shippingMode: e.target.value })} />
                International
              </label>
              <label>
                <input type="radio" value="BOTH" checked={formData.shippingMode === 'BOTH'} onChange={(e) => updateFormData({ shippingMode: e.target.value })} />
                Both
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length (cm)
              </label>
              <input
                type="number"
                value={formData.length || ''}
                onChange={(e) => updateFormData({ length: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (cm)
              </label>
              <input
                type="number"
                value={formData.width || ''}
                onChange={(e) => updateFormData({ width: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) => updateFormData({ height: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateFormData({ weight: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </>
      )}

      {(user?.role === 'WHOLESALER' || user?.role === 'RETAILER') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Mode
            </label>
            <div className="flex gap-4">
              <label>
                <input type="radio" value="LOCAL" checked={formData.shippingMode === 'LOCAL'} onChange={(e) => updateFormData({ shippingMode: e.target.value })} />
                Local Delivery Only
              </label>
              <label>
                <input type="radio" value="NATIONWIDE" checked={formData.shippingMode === 'NATIONWIDE'} onChange={(e) => updateFormData({ shippingMode: e.target.value })} />
                Nationwide
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Fee
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.shippingFee || ''}
              onChange={(e) => updateFormData({ shippingFee: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </>
      )}

      {user?.role === 'CREATOR' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Method
            </label>
            <div className="flex gap-4">
              <label>
                <input type="radio" value="DIGITAL" checked={formData.deliveryMethod === 'DIGITAL'} onChange={(e) => updateFormData({ deliveryMethod: e.target.value })} />
                Digital Delivery
              </label>
              <label>
                <input type="radio" value="EMAIL" checked={formData.deliveryMethod === 'EMAIL'} onChange={(e) => updateFormData({ deliveryMethod: e.target.value })} />
                Email
              </label>
              <label>
                <input type="radio" value="PHYSICAL" checked={formData.deliveryMethod === 'PHYSICAL'} onChange={(e) => updateFormData({ deliveryMethod: e.target.value })} />
                Physical
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Step6Preview({ formData, updateFormData }: any) {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Preview & Publish</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Preview */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Product Preview</h3>
          <div className="bg-gray-100 h-40 rounded mb-4 flex items-center justify-center text-gray-500">
            Product Image
          </div>
          <h4 className="font-semibold text-gray-900">{formData.name || 'Product Name'}</h4>
          <p className="text-lg font-bold text-gray-900 mt-2">${formData.basePrice || 0}</p>
          <p className="text-sm text-gray-600 mt-3 line-clamp-3">
            {formData.description || 'Product description will appear here'}
          </p>
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="DRAFT"
                  checked={formData.status === 'DRAFT'}
                  onChange={(e) => updateFormData({ status: e.target.value })}
                  className="mr-2"
                />
                Draft
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="ACTIVE"
                  checked={formData.status === 'ACTIVE'}
                  onChange={(e) => updateFormData({ status: e.target.value })}
                  className="mr-2"
                />
                Publish
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.visibility?.main || false}
                  onChange={(e) =>
                    updateFormData({
                      visibility: { ...formData.visibility, main: e.target.checked },
                    })
                  }
                  className="mr-2"
                />
                Main Marketplace
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.visibility?.ng || false}
                  onChange={(e) =>
                    updateFormData({
                      visibility: { ...formData.visibility, ng: e.target.checked },
                    })
                  }
                  className="mr-2"
                />
                Nigeria (ng.banadama.com)
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.visibility?.bd || false}
                  onChange={(e) =>
                    updateFormData({
                      visibility: { ...formData.visibility, bd: e.target.checked },
                    })
                  }
                  className="mr-2"
                />
                Bangladesh (bd.banadama.com)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title (SEO)
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => updateFormData({ metaTitle: e.target.value })}
              maxLength={200}
              placeholder="Product title for search engines"
              className="w-full px-4 py-2 border rounded-lg text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/200</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => updateFormData({ metaDescription: e.target.value })}
              maxLength={500}
              rows={3}
              placeholder="Brief description for search engines"
              className="w-full px-4 py-2 border rounded-lg text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/500</p>
          </div>
        </div>
      </div>
    </div>
  );
}
