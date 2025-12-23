import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { VerificationTick } from "@/components/trust/VerificationTick";
import { creatorCategoryLabel } from "@/lib/creatorCategoryLabels";

export default async function CreatorListingDetail({ params }: { params: { id: string } }) {
    const res = await apiGet<any>(`/api/creators/listings/${params.id}`);
    const l = res?.listing || res;

    if (!l) {
        return (
            <div className="bd-container" style={{ padding: "40px 0" }}>
                <div className="bd-card bd-card-pad">Listing not found</div>
            </div>
        );
    }

    const isLocal = l.type === "LOCAL_SERVICE";
    const priceLabel =
        l.price_type === "QUOTED" ? "Quoted" : l.price ? `${l.currency ?? "USD"} ${Number(l.price).toFixed(2)}` : "—";

    return (
        <div className="bd-container" style={{ display: "grid", gap: 24, padding: "40px 0" }}>
            <div>
                <a className="bd-btn" href="/creators" style={{ width: "fit-content" }}>
                    <Icons.ChevronLeft size={18} /> Back to Hub
                </a>
            </div>

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 950, fontSize: 28 }}>{l.title}</div>
                    <span className="bd-badge" style={{ fontSize: 14, padding: "6px 12px" }}>
                        <Icons.Tag size={14} /> {creatorCategoryLabel(l.category)}
                    </span>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className="bd-badge">
                        {isLocal ? <Icons.MapPin size={14} /> : <Icons.Layers size={14} />}
                        {isLocal ? "Local service" : "Digital asset"}
                    </span>

                    <span className="bd-badge">
                        <Icons.CreditCard size={14} /> {priceLabel}
                    </span>

                    {l.creatorName ? (
                        <span className="bd-badge" style={{ gap: 8 }}>
                            <Icons.Users size={14} /> {l.creatorName} <VerificationTick level={l.creatorTick ?? "NONE"} />
                        </span>
                    ) : null}

                    {(l.city || l.state) ? (
                        <span className="bd-badge">
                            <Icons.MapPin size={14} /> {l.city ?? ""}{l.city && l.state ? ", " : ""}{l.state ?? ""}
                        </span>
                    ) : null}
                </div>

                <div style={{ color: "var(--bd-muted)", lineHeight: 1.8, fontSize: 16, whiteSpace: "pre-wrap" }}>
                    {l.description}
                </div>

                {/* Action Panel */}
                <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 15, background: "var(--bd-muted-bg)" }}>
                    <div style={{ fontWeight: 950, fontSize: 18 }}>Ready to proceed?</div>
                    <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                        Payments are secured in Banadama Escrow. Funds are released to the creator only after delivery is confirmed or verified.
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                        <a className="bd-btn bd-btn-primary" href={`/buyer/creators/checkout/${l.id}`}>
                            <Icons.Cart size={18} /> {isLocal ? "Book service" : "Buy digital delivery"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
