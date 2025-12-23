import { requireRole, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CreatorListingCard } from "@/components/creators/CreatorListingCard";
import { Icons } from "@/components/icons/icons";

export default async function CreatorListings() {
    const user = await requireRole("CREATOR");

    let listings: any[] = [];

    try {
        const creator = await prisma.creatorProfile.findUnique({
            where: { userId: user.id },
        });

        if (creator) {
            listings = await prisma.creatorListing.findMany({
                where: { creatorId: creator.id },
                orderBy: { createdAt: "desc" },
            });
        }
    } catch (error) {
        console.error("Error fetching creator listings:", error);
        listings = [];
    }

    const PlusIcon = Icons.get("Plus");

    return (
        <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 950, fontSize: 24 }}>My Listings</div>
                <a className="bd-btn bd-btn-primary" href="/creator/listings/new">
                    <PlusIcon size={18} /> New listing
                </a>
            </div>

            {listings.length === 0 ? (
                <div className="bd-card bd-card-pad" style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ color: "var(--bd-muted)", marginBottom: 15 }}>You don't have any listings yet.</div>
                    <a className="bd-btn" href="/creator/listings/new" style={{ margin: "0 auto" }}>Create your first listing</a>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {listings.map((l: any) => (
                        <div key={l.id} className="bd-card bd-card-pad" style={{ display: "grid", gap: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 10 }}>
                                <div style={{ fontWeight: 900, fontSize: 16 }}>{l.title}</div>
                                <span className={`bd-badge ${l.status === "ACTIVE" ? "bd-badge-success" : ""}`}>
                                    {l.status}
                                </span>
                            </div>

                            <div style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.4 }}>
                                {String(l.description || "").slice(0, 100)}
                                {String(l.description || "").length > 100 ? "..." : ""}
                            </div>

                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <span className="bd-badge">{l.type === "DIGITAL" ? "Digital" : "Local Service"}</span>
                                <span className="bd-badge">{l.category}</span>
                                {l.price && <span className="bd-badge">{l.currency} {l.price}</span>}
                            </div>

                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                <a className="bd-btn bd-btn-primary" href={`/creator/listings/${l.id}/edit`} style={{ flex: 1, justifyContent: "center" }}>
                                    Edit
                                </a>
                                <a className="bd-btn" href={`/creators/listings/${l.id}`} style={{ flex: 1, justifyContent: "center" }}>
                                    View
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
