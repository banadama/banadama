'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface PricingTier {
  id?: string;
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
}

interface PricingTierManagerProps {
  tiers: PricingTier[];
  onTiersChange: (tiers: PricingTier[]) => void;
  basePrice: number;
}

export function PricingTierManager({
  tiers,
  onTiersChange,
  basePrice,
}: PricingTierManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addTier = () => {
    const newTiers = [...tiers];
    const lastMax = newTiers.length > 0 ? (newTiers[newTiers.length - 1].maxQuantity || 999999) : 0;
    
    newTiers.push({
      id: `tier-${Date.now()}`,
      minQuantity: lastMax + 1,
      maxQuantity: undefined,
      pricePerUnit: basePrice * 0.9, // 10% discount by default
    });
    
    onTiersChange(newTiers);
    setEditingIndex(newTiers.length - 1);
  };

  const updateTier = (index: number, updates: Partial<PricingTier>) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], ...updates };
    onTiersChange(newTiers);
  };

  const removeTier = (index: number) => {
    const newTiers = tiers.filter((_, i) => i !== index);
    onTiersChange(newTiers);
  };

  const calculateDiscount = (price: number): number => {
    return Math.round(((basePrice - price) / basePrice) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">MOQ-Based Pricing</h3>
          <p className="text-sm text-gray-600 mt-1">Set different prices for different order quantities</p>
        </div>
        <button
          type="button"
          onClick={addTier}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Add Tier
        </button>
      </div>

      {/* Base Price Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Base Price (1 - {tiers.length > 0 ? (tiers[0].minQuantity - 1) : 'more'} units):</strong> {formatCurrency(basePrice)}
        </p>
      </div>

      {/* Tiers Table */}
      {tiers.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Quantity Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Price per Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tiers.map((tier, i) => {
                const discount = calculateDiscount(tier.pricePerUnit);
                const maxQty = tier.maxQuantity ? tier.maxQuantity.toLocaleString() : '∞';
                
                return (
                  <tr key={tier.id || i} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {tier.minQuantity.toLocaleString()} - {maxQty}
                      </div>
                      {editingIndex === i && (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="number"
                            min="1"
                            value={tier.minQuantity}
                            onChange={(e) =>
                              updateTier(i, {
                                minQuantity: parseInt(e.target.value),
                              })
                            }
                            className="w-24 px-2 py-1 border rounded text-xs"
                            placeholder="Min"
                          />
                          <input
                            type="number"
                            min={tier.minQuantity}
                            value={tier.maxQuantity || ''}
                            onChange={(e) =>
                              updateTier(i, {
                                maxQuantity: e.target.value ? parseInt(e.target.value) : undefined,
                              })
                            }
                            className="w-24 px-2 py-1 border rounded text-xs"
                            placeholder="Max (leave empty for unlimited)"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingIndex === i ? (
                        <input
                          type="number"
                          step="0.01"
                          value={tier.pricePerUnit}
                          onChange={(e) =>
                            updateTier(i, {
                              pricePerUnit: parseFloat(e.target.value),
                            })
                          }
                          className="w-32 px-2 py-1 border rounded"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(tier.pricePerUnit)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${discount > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {discount > 0 ? `-${discount}%` : 'No discount'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {editingIndex === i ? (
                          <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            Done
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingIndex(i)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeTier(i)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600">No pricing tiers yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Add MOQ-based pricing to incentivize bulk orders
          </p>
          <button
            type="button"
            onClick={addTier}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            + Add First Tier
          </button>
        </div>
      )}

      {/* Helper Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>💡 Tip:</strong> Use tiered pricing to encourage bulk purchases. For example: 
          100 units for $5.00 each, 500 units for $4.50 each, 1000+ units for $4.00 each
        </p>
      </div>
    </div>
  );
}
