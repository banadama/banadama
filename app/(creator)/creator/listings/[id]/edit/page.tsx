import { requireRole } from "@/lib/auth";
import { CreatorListingForm } from "@/components/creators/CreatorListingForm";
import { Icons } from "@/components/icons/icons";

export default async function EditCreatorListing({ params }: { params: { id: string } }) {
    await requireRole("CREATOR");
    return (
        <div style={{ display: "grid", gap: 24 }}>
            <div>
                <a className="bd-btn" href="/creator/listings" style={{ width: "fit-content" }}>
                    <Icons.ChevronLeft size={18} /> Back to listings
                </a>
            </div>

            <div style={{ fontWeight: 950, fontSize: 24 }}>Edit Listing</div>

            <CreatorListingForm mode="edit" listingId={params.id} />
        </div>
    );
}
