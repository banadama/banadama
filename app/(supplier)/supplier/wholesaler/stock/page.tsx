// app/(wholesaler)/wholesaler/stock/page.tsx - Stock Management
'use client';

import { useState, useEffect } from 'react';

interface StockItem {
    id: string;
    productId: string;
    productName: string;
    status: string;
    quantityAvailable: number;
    minOrderQuantity: number;
    pricePerUnit: number;
    deliverySpeed: string;
    lastStockUpdate?: string;
    isActive: boolean;
}

const STATUS_COLORS: Record<string, string> = {
    IN_STOCK: 'bg-green-500/20 text-green-400',
    LOW_STOCK: 'bg-orange-500/20 text-orange-400',
    OUT_OF_STOCK: 'bg-red-500/20 text-red-400',
    COMING_SOON: 'bg-blue-500/20 text-blue-400',
};

const DELIVERY_LABELS: Record<string, string> = {
    SAME_DAY: '🚀 Same Day',
    NEXT_DAY: '⚡ Next Day',
    EXPRESS: '📦 2-3 Days',
    STANDARD: '🚚 5-7 Days',
};

export default function WholesalerStockPage() {
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ quantity: 0, status: '', price: 0 });

    const fetchStock = async () => {
        setLoading(true);
        try {
            const url = filter ? `/api/wholesaler/stock?status=${filter}` : '/api/wholesaler/stock';
            const res = await fetch(url, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setStockItems(data.items || []);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStock();
    }, [filter]);

    const startEdit = (item: StockItem) => {
        setEditingId(item.id);
        setEditForm({
            quantity: item.quantityAvailable,
            status: item.status,
            price: item.pricePerUnit / 100,
        });
    };

    const saveEdit = async () => {
        if (!editingId) return;
        try {
            const res = await fetch(`/api/wholesaler/stock/${editingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    quantityAvailable: editForm.quantity,
                    status: editForm.status,
                    pricePerUnit: Math.round(editForm.price * 100),
                }),
            });
            if (res.ok) {
                setEditingId(null);
                fetchStock();
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">📊 Stock Management</h1>
                    <p className="text-slate-400">Keep your inventory up to date for Buy Now orders</p>
                </div>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-400 text-sm">
                    💡 <strong>Stock Accuracy</strong> is crucial for wholesale. Inaccurate stock leads to order cancellations and lower trust ranking.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                        onClick={() => setFilter(f)}
                    >
                        {f ? f.replace(/_/g, ' ') : 'All Items'}
                    </button>
                ))}
            </div>

            {/* Stock List */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : stockItems.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                    <span className="text-4xl">📦</span>
                    <p className="text-slate-400 mt-4">No stock items found</p>
                    <p className="text-slate-500 text-sm mt-2">Add products first, then manage their stock here</p>
                </div>
            ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-900/50">
                                <th className="text-left p-4 text-slate-400 font-medium">Product</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Quantity</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Price</th>
                                <th className="text-left p-4 text-slate-400 font-medium">Delivery</th>
                                <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {stockItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="text-white font-medium">{item.productName}</div>
                                        <div className="text-slate-500 text-sm">MOQ: {item.minOrderQuantity}</div>
                                    </td>
                                    <td className="p-4">
                                        {editingId === item.id ? (
                                            <select
                                                className="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            >
                                                <option value="IN_STOCK">In Stock</option>
                                                <option value="LOW_STOCK">Low Stock</option>
                                                <option value="OUT_OF_STOCK">Out of Stock</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[item.status]}`}>
                                                {item.status.replace(/_/g, ' ')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {editingId === item.id ? (
                                            <input
                                                type="number"
                                                className="w-24 px-2 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                                                value={editForm.quantity}
                                                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 0 })}
                                            />
                                        ) : (
                                            <span className={`text-white ${item.quantityAvailable < 10 ? 'text-orange-400' : ''}`}>
                                                {item.quantityAvailable.toLocaleString()}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {editingId === item.id ? (
                                            <input
                                                type="number"
                                                className="w-24 px-2 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                                            />
                                        ) : (
                                            <span className="text-green-400">{formatMoney(item.pricePerUnit)}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="text-slate-300 text-sm">{DELIVERY_LABELS[item.deliverySpeed]}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {editingId === item.id ? (
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                                                    onClick={saveEdit}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-slate-600 text-white rounded text-sm"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
                                                onClick={() => startEdit(item)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Last Update Info */}
            <p className="text-slate-500 text-xs text-center mt-4">
                Keep stock updated daily. Ops verifies stock accuracy regularly.
            </p>
        </div>
    );
}
