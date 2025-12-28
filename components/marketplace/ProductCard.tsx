// components/marketplace/ProductCard.tsx - Premium Dashboard Style
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
    hideRfq?: boolean;
    detailHref?: string;
}

function DeliveryBadge({ type }: { type: DeliveryType }) {
    switch (type) {
        case "DIGITAL":
            return (
                <Badge variant="success" size="sm" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 font-bold rounded-lg px-2">
                    <Icons.Document size={12} className="mr-1" /> Digital
                </Badge>
            );
        case "LOCAL_SERVICE":
            return (
                <Badge variant="warning" size="sm" className="bg-amber-500/10 border-amber-500/20 text-amber-600 font-bold rounded-lg px-2">
                    <Icons.Location size={12} className="mr-1" /> Local
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

    const creatorConfig = creatorType ? CREATOR_TYPE_CONFIG[creatorType] : null;

    return (
        <Card className="group bg-white border border-slate-100 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 flex flex-col h-full overflow-hidden rounded-[1.5rem] relative">
            <Link href={mainHref} className="relative aspect-square overflow-hidden bg-slate-50">
                <div
                    className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                    style={{
                        background: `url(${imageUrl}) center/cover no-repeat`,
                    }}
                />

                {/* Status Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {buyNowEnabled && (
                        <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-orange-500/20 uppercase tracking-widest">
                            Limited
                        </div>
                    )}
                    {isCreator && deliveryType && <DeliveryBadge type={deliveryType} />}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <CardBody className="flex flex-col gap-3 p-5 flex-1 relative">
                <div className="flex items-center justify-between">
                    <div className="flex text-[#FFA41C] gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Icons.Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {Math.floor(Math.random() * 50) + 10} Orders
                    </span>
                </div>

                <Link href={mainHref}>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors">
                        {title}
                    </h3>
                </Link>

                <TagRow
                    categoryLabel={(product as any).categoryName || (product as any).categorySlug}
                    supplierName={supplier?.name}
                    supplierTick={supplier?.verification as any}
                    supplierCity={product.supplierCity}
                    supplierState={product.supplierState}
                />

                <div className="mt-auto pt-4 flex flex-col gap-4 border-t border-slate-50">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">
                            {priceBuyNow ? formatPrice(priceBuyNow) : "RFQ"}
                        </span>
                        {moq && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ MOQ: {moq}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {buyNowEnabled ? (
                            <Link href={`${mainHref}/buy`} className="col-span-2">
                                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-black py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                                    BUY NOW
                                </Button>
                            </Link>
                        ) : null}

                        {rfqEnabled && !isCreator && !hideRfq ? (
                            <Link href={`${mainHref}/rfq`}>
                                <Button className="w-full bg-slate-900 hover:bg-black text-white text-[10px] font-black py-3 rounded-xl active:scale-95 transition-all uppercase tracking-widest">
                                    RFQ
                                </Button>
                            </Link>
                        ) : (
                            <div />
                        )}

                        <Link href={mainHref} className={rfqEnabled && !isCreator && !hideRfq ? "" : "col-span-2"}>
                            <Button variant="glass" className="w-full border-slate-200 text-slate-600 text-[10px] font-black py-3 rounded-xl hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-widest">
                                INFO
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

