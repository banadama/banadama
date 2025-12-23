// app/(mobile)/mobile/ops/rfqs/[id]/page.tsx - RFQ Details (Mobile)
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';

interface RfqDetail {
    id: string;
    productCategory: string;
    productDescription: string;
    quantity: number;
    budget?: number;
    status: string;
    deliveryAddress: string;
    buyer: { name: string; email: string };
    suggestedSuppliers?: Array<{ id: string; businessName: string; score: number }>;
}

export default function RfqDetailMobile() {
    const params = useParams();
    const router = useRouter();
    const [rfq, setRfq] = useState<RfqDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState('');

    useEffect(() => {
        const fetchRfq = async () => {
            try {
                const res = await fetch(`/api/ops/rfqs/${params.id}`, { credentials: 'include' });
                if (res.ok) {
                    setRfq(await res.json());
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRfq();
    }, [params.id]);

    const handleAssign = async () => {
        if (!selectedSupplier) {
            alert('Select a supplier');
            return;
        }
        setAssigning(true);
        try {
            const res = await fetch(`/api/ops/rfqs/${params.id}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ supplierId: selectedSupplier }),
            });
            if (res.ok) {
                alert('Supplier assigned!');
                router.push('/mobile/ops/rfqs');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to assign');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setAssigning(false);
        }
    };

    const formatMoney = (kobo?: number) => kobo ? `₦${(kobo / 100).toLocaleString()}` : '-';

    if (loading) {
        return (
            <div>
                <MobileHeader title="RFQ Details" showBack backHref="/mobile/ops/rfqs" />
                <div className="p-4 text-center text-slate-400">Loading...</div>
            </div>
        );
    }

    if (!rfq) {
        return (
            <div>
                <MobileHeader title="RFQ Details" showBack backHref="/mobile/ops/rfqs" />
                <div className="p-4 text-center text-slate-500">RFQ not found</div>
            </div>
        );
    }

    return (
        <div>
            <MobileHeader title="RFQ Details" showBack backHref="/mobile/ops/rfqs" />

            <div className="p-4 space-y-4">
                {/* Status */}
                <div className={`p-3 rounded-lg text-center ${rfq.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                        rfq.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                    }`}>
                    {rfq.status}
                </div>

                {/* Details */}
                <div className="bg-slate-800 rounded-xl p-4 space-y-3">
                    <div>
                        <div className="text-slate-400 text-xs">Category</div>
                        <div className="text-white">{rfq.productCategory}</div>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs">Description</div>
                        <div className="text-white">{rfq.productDescription}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-slate-400 text-xs">Quantity</div>
                            <div className="text-white">{rfq.quantity} units</div>
                        </div>
                        <div>
                            <div className="text-slate-400 text-xs">Budget</div>
                            <div className="text-white">{formatMoney(rfq.budget)}</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs">Delivery To</div>
                        <div className="text-white">{rfq.deliveryAddress}</div>
                    </div>
                </div>

                {/* Buyer */}
                <div className="bg-slate-800 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">Buyer</div>
                    <div className="text-white">{rfq.buyer.name}</div>
                    <div className="text-slate-400 text-sm">{rfq.buyer.email}</div>
                </div>

                {/* Assign Supplier (if PENDING) */}
                {rfq.status === 'PENDING' && rfq.suggestedSuppliers && rfq.suggestedSuppliers.length > 0 && (
                    <div className="bg-slate-800 rounded-xl p-4">
                        <div className="text-white font-medium mb-3">Assign Supplier</div>
                        <div className="space-y-2 mb-4">
                            {rfq.suggestedSuppliers.map((s) => (
                                <label
                                    key={s.id}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedSupplier === s.id ? 'bg-blue-600' : 'bg-slate-700'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="supplier"
                                        value={s.id}
                                        checked={selectedSupplier === s.id}
                                        onChange={(e) => setSelectedSupplier(e.target.value)}
                                        className="mr-3"
                                    />
                                    <div className="flex-1">
                                        <div className="text-white">{s.businessName}</div>
                                        <div className="text-xs text-slate-400">Score: {s.score}/100</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <button
                            className="w-full py-3 bg-green-600 text-white rounded-xl font-medium disabled:opacity-50 active:bg-green-700"
                            onClick={handleAssign}
                            disabled={!selectedSupplier || assigning}
                        >
                            {assigning ? 'Assigning...' : '✓ Assign Supplier'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
