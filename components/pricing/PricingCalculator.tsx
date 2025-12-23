"use client";

import { useState } from "react";

type PricingBreakdown = {
  buyerTotal: number;
  breakdown: {
    visibleGoodsPrice: number;
    buyerShippingFee: number;
    buyerInspectionFee: number;
    buyerDestinationLocalFee: number;
    buyerServiceFee: number;
  };
};

type Props = {
  basePrice: number;
  weightKg: number;
  productType: "b2c" | "b2b" | "design";
};

export default function PricingCalculator({
  basePrice,
  weightKg,
  productType,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [buyerCountry, setBuyerCountry] = useState("NG");
  const [shippingMode, setShippingMode] =
    useState<"economy" | "air_cargo" | "express">("economy");
  const [inspectionRequested, setInspectionRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricingBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCalculate() {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const goodsPrice = basePrice * quantity;
      const totalWeight = Math.max(weightKg * quantity, 0.1); // kar ya zama 0

      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goodsPrice,
          weightKg: totalWeight,
          buyerCountry: buyerCountry || "NG",
          shippingMode,
          inspectionRequested,
          sellerTier: "basic",
          sellerAdsMonthly:
            productType === "design" ? 20 : 50, // just sample values
          minProfitUsd: 1.5,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Pricing failed");
        setLoading(false);
        return;
      }

      setResult({
        buyerTotal: data.buyerTotal,
        breakdown: data.breakdown,
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <label className="text-slate-600">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-full border rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black/60"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-600">Buyer country</label>
          <input
            type="text"
            value={buyerCountry}
            onChange={(e) => setBuyerCountry(e.target.value.toUpperCase())}
            className="w-full border rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black/60"
            placeholder="NG"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <label className="text-slate-600">Shipping mode</label>
          <select
            value={shippingMode}
            onChange={(e) =>
              setShippingMode(e.target.value as "economy" | "air_cargo" | "express")
            }
            className="w-full border rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black/60 bg-white"
          >
            <option value="economy">Economy</option>
            <option value="air_cargo">Air cargo</option>
            <option value="express">Express</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <input
            id="inspection"
            type="checkbox"
            checked={inspectionRequested}
            onChange={(e) => setInspectionRequested(e.target.checked)}
            className="h-4 w-4 border rounded"
          />
          <label htmlFor="inspection" className="text-xs text-slate-700 leading-tight">
            Include inspection
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 text-xs text-red-600 px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleCalculate}
        disabled={loading}
        className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "Calculating..." : "Request price with shipping"}
      </button>

      {result && (
        <div className="mt-2 rounded-xl bg-slate-50 border text-xs p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Estimated total</span>
            <span className="text-sm font-bold">${result.buyerTotal.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500">Goods</span>
              <span className="font-semibold">${result.breakdown.visibleGoodsPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500">Shipping</span>
              <span className="font-semibold">${result.breakdown.buyerShippingFee.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500">Inspection</span>
              <span className="font-semibold">${result.breakdown.buyerInspectionFee.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500">Destination local</span>
              <span className="font-semibold">${result.breakdown.buyerDestinationLocalFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-1 border-t text-[11px] flex items-center justify-between">
            <span className="text-slate-500">Service & platform fee</span>
            <span className="font-semibold">${result.breakdown.buyerServiceFee.toFixed(2)}</span>
          </div>

          <p className="text-[10px] text-slate-400">
            This is an estimate from Banadama Pricing Engine. Final amount may
            adjust based on real weight, route, and promotions.
          </p>
        </div>
      )}
    </div>
  );
}
