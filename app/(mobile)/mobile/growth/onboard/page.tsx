// app/(mobile)/mobile/growth/onboard/page.tsx - Mobile Supplier Onboarding
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';

export default function GrowthOnboardMobile() {
    const router = useRouter();
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [businessPhoto, setBusinessPhoto] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        phone: '',
        email: '',
        businessAddress: '',
        country: 'NG',
        category: '',
        notes: '',
    });

    // Offline support - save to local storage
    const [offlineQueue, setOfflineQueue] = useState<typeof formData[]>([]);

    const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setBusinessPhoto(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.businessName || !formData.ownerName || !formData.phone) {
            alert('Please fill required fields');
            return;
        }

        // Check if online
        if (!navigator.onLine) {
            // Save to offline queue
            const queue = [...offlineQueue, formData];
            localStorage.setItem('offlineOnboardQueue', JSON.stringify(queue));
            setOfflineQueue(queue);
            alert('Saved offline! Will sync when connected.');
            resetForm();
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/growth/onboard-supplier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('✅ Supplier onboarded successfully!');
                router.push('/mobile/growth/suppliers');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to onboard');
            }
        } catch (err) {
            console.error('Error:', err);
            // Save offline if network fails
            const queue = [...offlineQueue, formData];
            localStorage.setItem('offlineOnboardQueue', JSON.stringify(queue));
            alert('Network error. Saved offline.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            businessName: '',
            ownerName: '',
            phone: '',
            email: '',
            businessAddress: '',
            country: 'NG',
            category: '',
            notes: '',
        });
        setBusinessPhoto(null);
    };

    return (
        <div>
            <MobileHeader title="Onboard Supplier" showBack backHref="/mobile/growth/dashboard" />

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Offline Indicator */}
                {!navigator.onLine && (
                    <div className="bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-xl text-center">
                        <span className="text-yellow-400">📴 Offline Mode - Will sync later</span>
                    </div>
                )}

                {/* Photo Capture */}
                <div>
                    <input
                        type="file"
                        ref={photoInputRef}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handlePhotoCapture}
                    />
                    <button
                        type="button"
                        className="w-full py-4 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 active:bg-slate-700"
                        onClick={() => photoInputRef.current?.click()}
                    >
                        {businessPhoto ? (
                            <img src={businessPhoto} alt="Business" className="h-24 mx-auto rounded" />
                        ) : (
                            <>📷 Take Business Photo</>
                        )}
                    </button>
                </div>

                {/* Business Info */}
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Business Name *"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Owner Name *"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number *"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email (optional)"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                {/* Location */}
                <div className="space-y-3">
                    <select
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    >
                        <option value="NG">🇳🇬 Nigeria</option>
                        <option value="BD">🇧🇩 Bangladesh</option>
                    </select>
                    <textarea
                        placeholder="Business Address"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                        rows={2}
                        value={formData.businessAddress}
                        onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    />
                </div>

                {/* Category */}
                <select
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                    <option value="">Select Category</option>
                    <option value="textiles">Textiles & Fabrics</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="packaging">Packaging</option>
                    <option value="food">Food & Agriculture</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                </select>

                {/* Notes */}
                <textarea
                    placeholder="Notes (what they sell, etc.)"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-4 bg-orange-600 text-white rounded-xl font-medium text-lg disabled:opacity-50 active:bg-orange-700"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : '✓ Submit Supplier'}
                </button>

                {/* Offline Queue */}
                {offlineQueue.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl text-center">
                        <span className="text-yellow-400">{offlineQueue.length} pending offline submissions</span>
                    </div>
                )}
            </form>
        </div>
    );
}
