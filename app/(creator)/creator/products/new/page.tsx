// app/(creator)/creator/products/new/page.tsx - Create Digital Product
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
    { value: 'mockup', label: '📱 Mockup' },
    { value: 'template', label: '📄 Template' },
    { value: 'graphic', label: '🎨 Graphic Design' },
    { value: 'brand', label: '🏷️ Brand Asset' },
    { value: 'illustration', label: '✏️ Illustration' },
];

export default function NewCreatorProductPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'mockup',
        price: 5000, // ₦50 default
        tags: '',
    });

    const handlePreviewUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent, isDraft: boolean) => {
        e.preventDefault();

        if (!formData.name || !formData.description) {
            alert('Please fill in required fields');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/creator/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    price: Math.round(formData.price * 100), // Convert to kobo
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                    status: isDraft ? 'DRAFT' : 'PENDING_REVIEW',
                    previewUrls: previewUrl ? [previewUrl] : [],
                }),
            });

            if (res.ok) {
                router.push('/creator/products');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create product');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">📦 New Digital Product</h1>
                <p className="text-slate-400">Create a new product to sell globally</p>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-400 text-sm">
                    💡 Digital products are global. Buyers get instant file access after purchase. Admin review may be required.
                </p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)}>
                <div className="space-y-6">
                    {/* Preview Upload */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Preview Image *</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handlePreviewUpload}
                        />
                        <button
                            type="button"
                            className="w-full aspect-video bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-400 hover:border-blue-500/50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <span>📷 Click to upload preview image</span>
                            )}
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Product Name *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            placeholder="e.g., Modern Business Mockup Pack"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Description *</label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                            rows={4}
                            placeholder="Describe what's included, file formats, etc."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Category</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Price (₦)</label>
                        <input
                            type="number"
                            min="10"
                            step="10"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-slate-500 text-xs mt-1">Platform fee will be applied to each sale</p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Tags (comma separated)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            placeholder="mockup, business, modern"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            className="flex-1 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
                            disabled={loading}
                        >
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit for Review'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
