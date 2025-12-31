"use client";

import React, { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';
import VariantManager from './VariantManager';
import PricingTierManager from './PricingTierManager';
import RichTextEditor from '../ui/RichTextEditor';

type ProductInput = any;

export default function ProductForm({
  mode = 'add',
  initialData = null,
  onSaved,
}: {
  mode?: 'add' | 'edit';
  initialData?: ProductInput | null;
  onSaved?: (id: string) => void;
}) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [publishOption, setPublishOption] = useState<'immediate' | 'draft' | 'schedule'>(initialData?.status === 'ACTIVE' ? 'immediate' : 'draft');
  const [scheduleDate, setScheduleDate] = useState<string | null>(null);
  const [visibilityMain, setVisibilityMain] = useState<boolean>((initialData?.visibility?.main ?? true));
  const [visibilityNG, setVisibilityNG] = useState<boolean>((initialData?.visibility?.ng ?? true));
  const [visibilityBD, setVisibilityBD] = useState<boolean>((initialData?.visibility?.bd ?? false));
  const [metaTitle, setMetaTitle] = useState<string>(initialData?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState<string>(initialData?.meta_description || '');

  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [tags, setTags] = useState((initialData?.tags || []).join?.(',') || '');

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);

  const [sku, setSku] = useState(initialData?.sku || '');
  const [pricingType, setPricingType] = useState(initialData?.pricingType || 'fixed');
  const [basePrice, setBasePrice] = useState(initialData?.basePrice ?? '');
  const [stockQuantity, setStockQuantity] = useState(initialData?.stockQuantity ?? 0);
  const [pricingTiers, setPricingTiers] = useState<any[]>(initialData?.pricingTiers || []);

  const [attributes, setAttributes] = useState(initialData?.attributes || []);
  const [variants, setVariants] = useState(initialData?.variants || []);

  const [weight, setWeight] = useState(initialData?.weight ?? '');
  const [lengthVal, setLengthVal] = useState(initialData?.length ?? '');
  const [widthVal, setWidthVal] = useState(initialData?.width ?? '');
  const [heightVal, setHeightVal] = useState(initialData?.height ?? '');

  useEffect(() => {
    // create previews for uploaded files
    if (images.length === 0) return;
    const urls = images.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...urls]);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [images]);

  const next = () => {
    if (step < 6) setStep((s) => s + 1);
  };
  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const submit = async (publish = false) => {
    // basic validation
    if (!name) return alert('Product name is required');
    if (imagePreviews.length < 3) return alert('Please upload at least 3 images');

    setLoading(true);
    try {
      // Prepare payload without file objects (images handled separately)
      const payload: any = {
        name,
        description,
        category,
        brand,
        tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        sku,
        pricingType,
        pricingTiers,
        basePrice: Number(basePrice) || null,
        stockQuantity: Number(stockQuantity) || 0,
        attributes,
        variants,
        shipping: { weight, length: lengthVal, width: widthVal, height: heightVal },
        status: publish ? 'ACTIVE' : 'DRAFT',
        visibility: { main: visibilityMain, ng: visibilityNG, bd: visibilityBD },
        meta_title: metaTitle,
        meta_description: metaDescription,
      };

      // schedule handling: if publishOption is 'schedule' and scheduleDate provided, set published_at
      if (publishOption === 'schedule' && scheduleDate) {
        payload.published_at = new Date(scheduleDate).toISOString();
        payload.status = 'ACTIVE';
      }

      const method = mode === 'add' ? 'POST' : 'PUT';
      const url = mode === 'add' ? '/api/supplier/products' : `/api/supplier/products/${initialData.id}`;

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error('Save failed: ' + errText);
      }
      const data = await res.json();
      const productId = data.id || initialData?.id;

      // If there are new File objects to upload, send them via FormData with progress
      if (images && images.length > 0 && productId) {
        try {
          setUploadProgress(0);
          setUploadError(null);
          const uploadedUrls = await uploadFilesWithProgress(images, `/api/supplier/products/${productId}/images`, (p) => setUploadProgress(p));
          if (uploadedUrls && uploadedUrls.length) setImagePreviews(uploadedUrls);
          setUploadProgress(null);
        } catch (imgErr: any) {
          console.error('Image upload error', imgErr);
          setUploadError(imgErr?.message || 'Image upload failed');
          alert('Product saved but image upload failed');
          onSaved?.(productId);
          return;
        }
      }

      onSaved?.(productId);
      alert('Product saved');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  // upload helper using XMLHttpRequest to report progress
  const uploadFilesWithProgress = (files: File[], url: string, onProgress: (pct: number) => void): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const form = new FormData();
      // append as 'files' for server compatibility
      files.forEach((f) => form.append('files', f));

      xhr.open('POST', url, true);

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);
            const uploadedUrls = json.data?.images || json.images || [];
            resolve(uploadedUrls);
          } catch (err) {
            reject(new Error('Invalid upload response'));
          }
        } else {
          reject(new Error(`Upload failed (${xhr.status})`));
        }
      };

      xhr.onerror = function () {
        reject(new Error('Upload network error'));
      };

      xhr.send(form);
    });
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{mode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
        <div className="text-sm">Step {step} of 6</div>
      </div>

      {/* Step content */}
      <div className="mb-6">
        {step === 1 && (
          <div className="grid gap-3">
            <label>
              <div className="text-sm text-gray-300 mb-1">Product Name *</div>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
            </label>
            <label>
              <div className="text-sm text-gray-300 mb-1">Description *</div>
              <RichTextEditor value={description} onChange={(html) => setDescription(html)} />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label>
                <div className="text-sm text-gray-300 mb-1">Category</div>
                <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
              </label>
              <label>
                <div className="text-sm text-gray-300 mb-1">Brand</div>
                <input value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
              </label>
              <label>
                <div className="text-sm text-gray-300 mb-1">Tags (comma separated)</div>
                <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-3">
            <div>
              <div className="text-sm text-gray-300 mb-1">Product Images * (min 3)</div>
              <ImageUploader
                maxFiles={10}
                maxSizeMB={5}
                initialImages={imagePreviews}
                onChange={(files, previews) => {
                  setImages(files || []);
                  setImagePreviews(previews || []);
                }}
              />
            </div>
            <label>
              <div className="text-sm text-gray-300 mb-1">Product Video (YouTube/Vimeo URL)</div>
              <input className="w-full p-2 rounded bg-gray-800" placeholder="https://youtube.com/..." />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3">
            <label>
              <div className="text-sm text-gray-300 mb-1">SKU</div>
              <input value={sku} onChange={(e) => setSku(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label>
                <div className="text-sm text-gray-300 mb-1">Pricing Type</div>
                <select value={pricingType} onChange={(e) => setPricingType(e.target.value)} className="w-full p-2 rounded bg-gray-800">
                  <option value="fixed">Fixed Price</option>
                  <option value="tiered">Tiered (MOQ)</option>
                </select>
              </label>
              <label>
                <div className="text-sm text-gray-300 mb-1">Base Price</div>
                <input value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
              </label>
              <label>
                <div className="text-sm text-gray-300 mb-1">Stock Quantity</div>
                <input type="number" value={stockQuantity as any} onChange={(e) => setStockQuantity(Number(e.target.value))} className="w-full p-2 rounded bg-gray-800" />
              </label>
            </div>
            <div>
              {pricingType === 'tiered' ? (
                <PricingTierManager tiers={pricingTiers} onChange={(t) => setPricingTiers(t)} />
              ) : (
                <p className="text-sm text-gray-400">Pricing tiers and factory-specific fields can be added after initial save.</p>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-3">
            <VariantManager
              initialAttributes={attributes}
              initialVariants={variants}
              onAttributesChange={(attrs) => setAttributes(attrs)}
              onVariantsChange={(vs) => setVariants(vs)}
            />
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-3">
            <div className="grid grid-cols-4 gap-2">
              <label>
                <div className="text-sm text-gray-300 mb-1">Weight (kg)</div>
                <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
              </label>
              <label>
                <div className="text-sm text-gray-300 mb-1">Length (cm)</div>
                <input value={lengthVal} onChange={(e) => setLengthVal(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
              </label>
              <label>
                <div className="text-sm text-gray-300 mb-1">Width (cm)</div>
                <input value={widthVal} onChange={(e) => setWidthVal(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
              </label>
              <label>
                <div className="text-sm text-gray-300 mb-1">Height (cm)</div>
                <input value={heightVal} onChange={(e) => setHeightVal(e.target.value)} className="w-full p-2 rounded bg-gray-800" />
              </label>
            </div>
            <div className="text-sm text-gray-400">Shipping options and export documentation can be configured after saving.</div>
          </div>
        )}

        {step === 6 && (
          <div>
            <div className="bg-gray-800 p-4 rounded mb-4">
              <h3 className="font-semibold">Preview</h3>
              <div className="mt-2">
                <div className="font-bold">{name}</div>
                <div className="text-sm text-gray-300">{description}</div>
                <div className="mt-2 text-sm">Price: {basePrice ? `₦${basePrice}` : '—'}</div>
                <div className="mt-1 text-sm">Stock: {stockQuantity}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {uploadProgress != null && (
                <div className="w-full bg-gray-800 rounded p-2">
                  <div className="text-sm text-gray-300 mb-1">Uploading images: {uploadProgress}%</div>
                  <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
                    <div style={{ width: `${uploadProgress}%` }} className="h-2 bg-green-500" />
                  </div>
                </div>
              )}
              {uploadError && <div className="text-sm text-red-400">{uploadError}</div>}

              <div className="bg-gray-800 p-3 rounded">
                <div className="font-semibold mb-2">Publication Options</div>
                <div className="flex items-center gap-3 mb-2">
                  <label className="flex items-center gap-2"><input type="radio" name="pub" checked={publishOption === 'immediate'} onChange={() => setPublishOption('immediate')} /> Publish Immediately</label>
                  <label className="flex items-center gap-2"><input type="radio" name="pub" checked={publishOption === 'draft'} onChange={() => setPublishOption('draft')} /> Save as Draft</label>
                  <label className="flex items-center gap-2"><input type="radio" name="pub" checked={publishOption === 'schedule'} onChange={() => setPublishOption('schedule')} /> Schedule</label>
                </div>
                {publishOption === 'schedule' && (
                  <div className="mb-2">
                    <input type="datetime-local" value={scheduleDate || ''} onChange={(e) => setScheduleDate(e.target.value)} className="p-2 rounded bg-gray-900 w-full" />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={visibilityMain} onChange={(e) => setVisibilityMain(e.target.checked)} /> Visible on main marketplace</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={visibilityNG} onChange={(e) => setVisibilityNG(e.target.checked)} /> Visible on ng.banadama.com</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={visibilityBD} onChange={(e) => setVisibilityBD(e.target.checked)} /> Visible on bd.banadama.com</label>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-gray-300 mb-1">Meta Title</div>
                  <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full p-2 rounded bg-gray-900" />
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">Meta Description</div>
                  <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="w-full p-2 rounded bg-gray-900" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => submit(false)} className="px-4 py-2 bg-gray-700 rounded">Save Draft</button>
                <button onClick={() => submit(true)} className="px-4 py-2 bg-green-600 rounded">Publish</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button disabled={step === 1} onClick={back} className="px-4 py-2 bg-gray-800 rounded">Back</button>
        {step < 6 ? (
          <button onClick={next} className="px-4 py-2 bg-blue-600 rounded">Next</button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
