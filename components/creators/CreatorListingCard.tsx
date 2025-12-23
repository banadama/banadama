import { Icons } from "@/components/icons/icons";
import { VerificationTick } from "@/components/trust/VerificationTick";
import { creatorCategoryLabel } from "@/lib/creatorCategoryLabels";

export function CreatorListingCard({
    listing,
    href,
    showBuyCta,
}: {
    listing: any;
    href: string;
    showBuyCta?: boolean;
}) {
    const isLocal = listing.type === "LOCAL_SERVICE";
    const priceLabel =
        listing.price_type === "QUOTED"
            ? "Quoted"
            : listing.price
                ? `${listing.currency ?? "USD"} ${Number(listing.price).toFixed(2)}`
                : "—";

    const location =
        isLocal && (listing.city || listing.state)
            ? `${listing.city ?? ""}${listing.city && listing.state ? ", " : ""}${listing.state ?? ""}`
            : null;

    const TagIcon = Icons.get("Tag");
    const MapPinIcon = Icons.get("MapPin");
    const LayersIcon = Icons.get("Layers");
    const CreditCardIcon = Icons.get("CreditCard");
    const UsersIcon = Icons.get("Users");
    const CartIcon = Icons.get("Cart");
    const CalendarIcon = Icons.get("Calendar");

    return (
        <div className="bd-card bd-card-pad" style={{ textDecoration: "none", display: "grid", gap: 10 }}>
            <a href={href} style={{ textDecoration: "none", color: "inherit", display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 950, fontSize: 16, lineHeight: 1.2 }}>{listing.title}</div>
                    <div className="bd-badge">
                        <TagIcon size={14} /> {creatorCategoryLabel(listing.category)}
                    </div>
                </div>

                <div style={{ color: "var(--bd-muted)", lineHeight: 1.4 }}>
                    {String(listing.description ?? "").slice(0, 140)}
                    {String(listing.description ?? "").length > 140 ? "…" : ""}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className="bd-badge">
                        {isLocal ? <MapPinIcon size={14} /> : <LayersIcon size={14} />}
                        {isLocal ? "Local service" : "Digital"}
                    </span>

                    <span className="bd-badge">
                        <CreditCardIcon size={14} /> {priceLabel}
                    </span>

                    {location ? (
                        <span className="bd-badge">
                            <MapPinIcon size={14} /> {location}
                        </span>
                    ) : null}

                    {listing.creatorName ? (
                        <span className="bd-badge" style={{ gap: 8, maxWidth: "100%" }}>
                            <UsersIcon size={14} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{listing.creatorName}</span>
                            <VerificationTick level={listing.creatorTick ?? "NONE"} />
                        </span>
                    ) : null}
                </div>
            </a>

            {showBuyCta ? (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 5 }}>
                    {listing.type === "DIGITAL" ? (
                        <a className="bd-btn bd-btn-primary" href={`/buyer/creators/checkout/${listing.id}`} style={{ justifyContent: "center", width: "100%" }}>
                            <CartIcon size={18} /> Buy digital
                        </a>
                    ) : (
                        <a className="bd-btn bd-btn-primary" href={`/buyer/creators/checkout/${listing.id}`} style={{ justifyContent: "center", width: "100%" }}>
                            <CalendarIcon size={18} /> Book service
                        </a>
                    )}
                </div>
            ) : null}
        </div>
    );
}
