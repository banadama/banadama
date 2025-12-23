import { requireRole } from "@/lib/auth";
import { CreatorListingForm } from "@/components/creators/CreatorListingForm";
import { Icons } from "@/components/icons/icons";

export default async function NewCreatorListing() {
    await requireRole("CREATOR");
    return (
        <div style={{ display: "grid", gap: 24 }}>
            <div>
                <a className="bd-btn" href="/creator/listings" style={{ width: "fit-content" }}>
                    <Icons.ChevronLeft size={18} /> Back to listings
                </a>
            </div>

            <div style={{ fontWeight: 950, fontSize: 24 }}>New Listing</div>

            <CreatorListingForm mode="create" />
        </div>
    );
}
