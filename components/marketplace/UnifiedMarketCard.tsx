import { ProductCard } from "@/components/marketplace/ProductCard";
import { CreatorListingCard } from "@/components/creators/CreatorListingCard";

export function UnifiedMarketCard({ item, from }: { item: any; from: "marketplace" | "near-me" | "global" }) {
    if (item.kind === "CREATOR_DIGITAL") {
        return (
            <CreatorListingCard
                listing={{
                    ...item,
                    type: "DIGITAL",
                    category: item.category,
                    categoryName: item.categoryName,
                    description: item.description,
                    creatorName: item.creatorName,
                    creatorTick: item.creatorTick,
                    priceType: item.price_type || "FIXED",
                }}
                href={`/creators/listings/${item.id}`}
                showBuyCta={true}
            />
        );
    }

    // PRODUCT
    return (
        <ProductCard
            product={item}
            context="MARKETPLACE"
            detailHref={`/marketplace/products/${item.id}?from=${from}`}
        />
    );
}
