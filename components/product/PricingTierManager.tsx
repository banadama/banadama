"use client";

import React from 'react';

type Tier = { id: string; minQuantity: number; maxQuantity?: number | null; pricePerUnit: number };

export default function PricingTierManager({
  tiers = [],
  onChange,
}: {
  tiers?: Tier[];
  onChange?: (tiers: Tier[]) => void;
}) {
  const addTier = () => {
    const t: Tier = { id: `t-${Date.now()}`, minQuantity: 1, maxQuantity: null, pricePerUnit: 0 };
    onChange?.([...tiers, t]);
  };

  const updateTier = (idx: number, patch: Partial<Tier>) => {
    const copy = tiers.slice();
    copy[idx] = { ...copy[idx], ...patch };
    onChange?.(copy);
  };

  const removeTier = (idx: number) => {
    const copy = tiers.slice();
    copy.splice(idx, 1);
    onChange?.(copy);
  };

  return (
    <div className="bg-gray-800 p-3 rounded">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Pricing Tiers</div>
        <button onClick={addTier} className="px-2 py-1 bg-gray-700 rounded">+ Add Tier</button>
      </div>

      {tiers.length === 0 && <div className="text-sm text-gray-400">No tiers yet. Add tiers for MOQ pricing.</div>}

      <div className="grid gap-2">
        {tiers.map((t, i) => (
          <div key={t.id} className="grid grid-cols-4 gap-2 items-center">
            <div>
              <div className="text-xs text-gray-400">Min Qty</div>
              <input type="number" value={t.minQuantity} onChange={(e) => updateTier(i, { minQuantity: Number(e.target.value) })} className="p-1 rounded bg-gray-900 w-full" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Max Qty (optional)</div>
              <input type="number" value={t.maxQuantity ?? ''} onChange={(e) => updateTier(i, { maxQuantity: e.target.value ? Number(e.target.value) : null })} className="p-1 rounded bg-gray-900 w-full" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Price / unit</div>
              <input type="number" value={t.pricePerUnit} onChange={(e) => updateTier(i, { pricePerUnit: Number(e.target.value) })} className="p-1 rounded bg-gray-900 w-full" />
            </div>
            <div className="flex items-end">
              <button onClick={() => removeTier(i)} className="px-2 py-1 bg-red-600 rounded w-full">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
