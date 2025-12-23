import { requireRole, getCurrentUser } from "@/lib/auth";
import { getCreatorListing } from "@/lib/creatorApi";
import { BuyerCreatorCheckoutClient } from "@/components/creators/BuyerCreatorCheckoutClient";
import { Metadata } from "next";
import { Icons } from "@/components/icons/icons";

export const metadata: Metadata = {
    title: "Checkout - Creator Service",
};

export default async function BuyerCreatorCheckout({ params }: { params: { listingId: string } }) {
    await requireRole("BUYER");

    const listing = await getCreatorListing(params.listingId);
    if (!listing) return <div className="bd-card bd-card-pad">Listing not found</div>;

    // Same-country enforcement for LOCAL_SERVICE
    if (listing.type === "LOCAL_SERVICE") {
        const lc = String(listing.country ?? "").toUpperCase();
        if (lc !== "NG" && lc !== "BD") {
            return (
                <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                    <div style={{ fontWeight: 950, fontSize: 18 }}>Booking unavailable</div>
                    <div style={{ color: "var(--bd-muted)" }}>Local services are available only in NG/BD.</div>
                    <a className="bd-btn" href={`/creators/listings/${listing.id}`}>
                        <Icons.ChevronLeft size={18} /> Back
                    </a>
                </div>
            );
        }

        const me = await getCurrentUser();
        const bc = String(me?.country ?? "").toUpperCase();

        if (bc && bc !== lc) {
            return (
                <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                    <div style={{ fontWeight: 950, fontSize: 18 }}>Country mismatch</div>
                    <div style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>
                        This local service is available only for buyers in <b>{lc}</b>.
                        Your buyer country is <b>{bc}</b>.
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <a className="bd-btn" href={`/creators?type=LOCAL_SERVICE&country=${lc}`}>
                            <Icons.Search size={18} /> Browse {lc} local services
                        </a>
                        <a className="bd-btn bd-btn-primary" href={`/creators/listings/${listing.id}`}>
                            <Icons.ChevronLeft size={18} /> Back to listing
                        </a>
                    </div>
                </div>
            );
        }
    }

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 950, fontSize: 20 }}>Checkout</div>
            <BuyerCreatorCheckoutClient listing={listing} />
        </div>
    );
}
