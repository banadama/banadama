// src/app/api/pricing/route.ts
import { NextResponse, NextRequest } from "next/server";

type PricingRequest = {
  goodsUsd: number;
  weightKg: number;
  volumeCbm?: number;
  lane?: "bd-to-ng" | "bd-to-gh" | "bd-to-ke";
};

type PricingBreakdown = {
  goodsUsd: number;
  intlShippingUsd: number;
  inspectionUsd: number;
  originLocalUsd: number;
  destinationLocalUsd: number;
  banadamaFeeUsd: number;
  totalUsd: number;
  totalNgn: number;
  rateNgnPerUsd: number;
};

const DEFAULT_RATE_NGN = 1500;

function calculatePricing(input: PricingRequest): PricingBreakdown {
  const { goodsUsd, weightKg } = input;

  // FX rate daga env ko default
  const rateEnv = process.env.PRICING_NGN_RATE;
  const rateNgnPerUsd =
    rateEnv && !Number.isNaN(Number(rateEnv))
      ? Number(rateEnv)
      : DEFAULT_RATE_NGN;

  const safeGoods = goodsUsd > 0 ? goodsUsd : 0;
  const safeWeight = weightKg > 0 ? weightKg : 0;

  // 🔹 Ka daidaita nan daga baya da real forwarder costs
  const intlShippingUsd = Math.max(safeWeight * 6, 20); // e.g. min $20
  const inspectionUsd = 5;
  const originLocalUsd = 3;
  const destinationLocalUsd = 4;
  const banadamaFeeUsd = Math.max(safeGoods * 0.15, 5); // 15% ko minimum $5

  const totalUsd =
    safeGoods +
    intlShippingUsd +
    inspectionUsd +
    originLocalUsd +
    destinationLocalUsd +
    banadamaFeeUsd;

  const totalNgn = Math.round(totalUsd * rateNgnPerUsd);

  return {
    goodsUsd: safeGoods,
    intlShippingUsd,
    inspectionUsd,
    originLocalUsd,
    destinationLocalUsd,
    banadamaFeeUsd,
    totalUsd,
    totalNgn,
    rateNgnPerUsd,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<PricingRequest>;

    if (
      typeof body.goodsUsd !== "number" ||
      typeof body.weightKg !== "number"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "goodsUsd and weightKg are required and must be numbers",
        },
        { status: 400 }
      );
    }

    const breakdown = calculatePricing({
      goodsUsd: body.goodsUsd,
      weightKg: body.weightKg,
      volumeCbm: body.volumeCbm,
      lane: body.lane ?? "bd-to-ng",
    });

    return NextResponse.json({
      ok: true,
      breakdown,
    });
  } catch (err) {
    console.error("Pricing API error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal pricing error" },
      { status: 500 }
    );
  }
}
