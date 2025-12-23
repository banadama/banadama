"use client";

import * as React from "react";
import { Icons } from "@/components/icons/icons";
import { BuyNowButton } from "@/components/marketplace/BuyNowButton";
import { RfqButton } from "@/components/marketplace/RfqButton";
import { TagRow } from "@/components/marketplace/TagRow";
import { ModeBadges } from "@/components/marketplace/ModeBadges";
import { getCtas } from "@/components/marketplace/ctaRules";

export function ProductDetailShell({
    productId,
    title,
    images,
    supplierName,
    supplierTick,
    description,
    buyNowEnabled,
    rfqEnabled,
    priceLabel,
    categoryName,
    categorySlug,
    supplierState,
    supplierCity,
    context = "PRODUCT_DETAIL",
}: {
    productId: string;
    title: string;
    images: string[];
    supplierName: string;
    supplierTick: "NONE" | "BLUE_TICK" | "GREEN_TICK";
    description?: string;
    buyNowEnabled: boolean;
    rfqEnabled: boolean;
    priceLabel?: string;
    categoryName?: string | null;
    categorySlug?: string | null;
    supplierState?: string | null;
    supplierCity?: string | null;
    context?: "MARKETPLACE" | "NEAR_ME" | "GLOBAL" | "PRODUCT_DETAIL";
}) {
    const hero = images?.[0];

    const ctas = getCtas({
        buyNowEnabled,
        rfqEnabled,
        context: context === "GLOBAL" ? "GLOBAL" : "PRODUCT_DETAIL"
    });

    const PackageIcon = Icons.get("Package");
    const LockIcon = Icons.get("Lock");

    return (
        <div className="bd-container">
            <div className="bd-product-layout">
                {/* Left: Gallery + details */}
                <div className="bd-card bd-card-pad">
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ fontSize: 24, fontWeight: 950 }}>{title}</div>

                        <div style={{ fontWeight: 800, opacity: 0.8 }}>By {supplierName}</div>

                        {/* Hero Image */}
                        <div className="bd-card" style={{ overflow: "hidden" }}>
                            {hero ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={hero} alt={title} style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
                            ) : (
                                <div style={{ height: 420, display: "grid", placeItems: "center", color: "var(--bd-muted)" }}>
                                    <PackageIcon size={64} style={{ opacity: 0.3 }} />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {images?.length > 1 ? (
                            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                                {images.slice(0, 6).map((src, i) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        key={i}
                                        src={src}
                                        alt={`${title} ${i + 1}`}
                                        style={{
                                            width: 86,
                                            height: 86,
                                            objectFit: "cover",
                                            borderRadius: 12,
                                            border: "1px solid var(--bd-border)",
                                            flexShrink: 0,
                                        }}
                                    />
                                ))}
                            </div>
                        ) : null}

                        {/* Description */}
                        {description ? (
                            <div>
                                <div style={{ fontWeight: 900, marginBottom: 6 }}>Description</div>
                                <div style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>{description}</div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Right: Purchase panel (Sticky on desktop) */}
                <div className="bd-card bd-card-pad bd-sticky">
                    <div style={{ display: "grid", gap: 10 }}>
                        <div className="bd-badge"><LockIcon size={14} /> Escrow protected</div>

                        {priceLabel ? (
                            <div style={{ fontSize: 26, fontWeight: 950 }}>{priceLabel}</div>
                        ) : (
                            <div style={{ fontSize: 18, fontWeight: 900 }}>Request pricing</div>
                        )}

                        {/* Auth-Gated CTAs */}
                        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                            {ctas.showBuyNow ? (
                                <BuyNowButton productId={productId} />
                            ) : null}

                            {ctas.showRFQ ? (
                                <RfqButton productId={productId} />
                            ) : null}
                        </div>

                        <div style={{ color: "var(--bd-muted)", fontSize: 13, lineHeight: 1.5, marginTop: 8 }}>
                            Ops-managed fulfillment. Funds are released only after delivery confirmation.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
