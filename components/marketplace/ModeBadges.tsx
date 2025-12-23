// components/marketplace/ModeBadges.tsx - Product Mode Badges
import { Icons } from "@/components/icons/icons";

export function ModeBadges({
    buyNowEnabled,
    rfqEnabled,
    context,
}: {
    buyNowEnabled: boolean;
    rfqEnabled: boolean;
    context: "MARKETPLACE" | "GLOBAL";
}) {
    const showRFQ = context !== "GLOBAL" && rfqEnabled;

    const CartIcon = Icons.get("Cart");
    const DocumentIcon = Icons.get("Document");

    return (
        <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {buyNowEnabled ? (
                <span className="bd-badge">
                    <CartIcon size={14} /> Buy Now
                </span>
            ) : null}

            {showRFQ ? (
                <span className="bd-badge">
                    <DocumentIcon size={14} /> RFQ
                </span>
            ) : null}
        </span>
    );
}
