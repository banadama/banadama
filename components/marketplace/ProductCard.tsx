// components/marketplace/ProductCard.tsx - Marketplace Product Card (SVG icons, no emojis)
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { Icons } from "../icons/icons";
import { TagRow } from "./TagRow";
import type { MarketplaceProduct, DeliveryType } from "@/types/marketplace";
import { CREATOR_TYPE_CONFIG } from "@/types/marketplace";

interface ProductCardProps {
    product: MarketplaceProduct;
    hideRfq?: boolean; // For global marketplace buy-only mode
    detailHref?: string;
}

function DeliveryBadge({ type }: { type: DeliveryType }) {
    const Document = Icons.get("Document");
    const Location = Icons.get("Location");

    switch (type) {
        case "DIGITAL":
            return (
                <Badge variant="success" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Document size={12} /> Digital Delivery
                </Badge>
            );
        case "LOCAL_SERVICE":
            return (
                <Badge variant="warning" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Location size={12} /> Local Service
                </Badge>
            );
        default:
            return null;
    }
}

function formatPrice(price: number | null | undefined): string {
    if (!price) return "RFQ";
    return `₦${price.toLocaleString()}`;
}

export function ProductCard({ product, hideRfq = false, detailHref }: ProductCardProps) {
    const {
        id,
        slug,
        title,
        images,
        priceBuyNow,
        moq,
        stockQty,
        buyNowEnabled,
        rfqEnabled,
        supplier,
        deliveryType,
        creatorType,
    } = product;

    const imageUrl = images?.[0] || "/placeholder-product.png";
    const hasStock = stockQty !== null && stockQty !== undefined;
    const isRfqOnly = rfqEnabled && !buyNowEnabled;
    const isCreator = supplier.type === "CREATOR";
    const mainHref = detailHref || `/marketplace/products/${slug || id}`;

    // Get creator config if applicable
    const creatorConfig = creatorType ? CREATOR_TYPE_CONFIG[creatorType] : null;

    const Cart = Icons.get("Cart");
    const RFQIcon = Icons.get("RFQ");

    return (
        <Card className="bd-product-card">
            <a href={mainHref}>
                <div
                    className="bd-product-image"
                    style={{
                        height: 180,
                        background: `url(${imageUrl}) center/cover`,
                        borderRadius: "var(--bd-radius) var(--bd-radius) 0 0",
                    }}
                />
            </a>

            <CardBody className="bd-grid" style={{ gap: 10 }}>
                {/* Title */}
                <a href={mainHref}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
                </a>

                {/* Unified Tags */}
                <TagRow
                    categoryLabel={(product as any).categoryName || (product as any).categorySlug}
                    supplierName={supplier?.name}
                    supplierTick={supplier?.verification}
                    supplierCity={product.supplierCity}
                    supplierState={product.supplierState}
                />

                {/* Creator Type Label */}
                {isCreator && creatorConfig && (
                    <div className="bd-small" style={{ opacity: 0.8 }}>
                        {creatorConfig.label}
                    </div>
                )}

                {/* Price + MOQ */}
                <div className="bd-row" style={{ justifyContent: "space-between" }}>
                    <div>
                        <span style={{ fontWeight: 900, fontSize: 18 }}>
                            {formatPrice(priceBuyNow)}
                        </span>
                        {priceBuyNow && (
                            <span className="bd-small">
                                {isCreator ? " /service" : " /unit"}
                            </span>
                        )}
                    </div>
                    {!isCreator && <div className="bd-small">MOQ: {moq}</div>}
                </div>

                {/* Stock (if available, not for creators) */}
                {hasStock && !isCreator && (
                    <div className="bd-small" style={{ opacity: 0.7 }}>
                        Stock: {stockQty} units
                    </div>
                )}

                {/* Delivery Type Badge (for creators) */}
                {isCreator && deliveryType && (
                    <DeliveryBadge type={deliveryType} />
                )}

                {/* Mode Badges (for non-creators) */}
                {!isCreator && (
                    <div className="bd-row" style={{ gap: 6 }}>
                        {buyNowEnabled && <Badge variant="success">Buy Now</Badge>}
                        {rfqEnabled && !hideRfq && <Badge>RFQ</Badge>}
                    </div>
                )}

                {/* CTAs */}
                <div className="bd-row" style={{ gap: 8, marginTop: 8 }}>
                    {/* Buy Now / Book Service */}
                    {buyNowEnabled && (
                        <a href={`${mainHref}/buy`} style={{ flex: 1 }}>
                            <Button variant="primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                <Cart size={16} />
                                {isCreator && deliveryType === "LOCAL_SERVICE" ? "Book Service" : "Buy Now"}
                            </Button>
                        </a>
                    )}

                    {/* RFQ (not for creators, hide in global mode) */}
                    {rfqEnabled && !isCreator && !hideRfq && (
                        <a href={`${mainHref}/rfq`} style={{ flex: 1 }}>
                            <Button
                                variant={isRfqOnly ? "primary" : "soft"}
                                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                            >
                                <RFQIcon size={16} />
                                Request Quote
                            </Button>
                        </a>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
