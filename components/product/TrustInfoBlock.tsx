import { Icons } from "@/components/icons/icons";

export function TrustInfoBlock({
    country,
    context,
}: {
    country?: "NG" | "BD" | string | null;
    context: "MARKETPLACE" | "NEAR_ME" | "GLOBAL" | "PRODUCT_DETAIL";
}) {
    const isGlobal = context === "GLOBAL";
    const isLocal = context === "NEAR_ME" || context === "MARKETPLACE";

    const shippingText = isGlobal
        ? "Global market is buy-only. Shipping and fulfillment are coordinated by Ops. Import duties and timelines vary by destination."
        : "Shipping and fulfillment are coordinated by Ops. Local delivery options depend on supplier city/state and availability.";

    const escrowText =
        "Payments are secured in escrow. Funds are released to the supplier only after the buyer confirms delivery (or Ops confirms resolution under policy).";

    const TruckIcon = Icons.get("Truck");
    const UsersIcon = Icons.get("Users");
    const MapPinIcon = Icons.get("MapPin");
    const GlobeIcon = Icons.get("Globe");
    const FlagIcon = Icons.get("Flag");
    const ShieldCheckIcon = Icons.get("ShieldCheck");
    const LockIcon = Icons.get("Lock");
    const CheckIcon = Icons.get("Check");
    const ChatIcon = Icons.get("Chat");

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10, background: "var(--bd-muted-bg)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <TruckIcon size={18} />
                    <div style={{ fontWeight: 950, fontSize: 15 }}>Shipping & Logistics</div>
                </div>

                <div style={{ color: "var(--bd-muted)", lineHeight: 1.5, fontSize: 14 }}>
                    {shippingText}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                    <span className="bd-badge">
                        <UsersIcon size={14} /> Ops-managed
                    </span>
                    {isLocal ? (
                        <span className="bd-badge">
                            <MapPinIcon size={14} /> Local options (NG/BD)
                        </span>
                    ) : null}
                    {isGlobal ? (
                        <span className="bd-badge">
                            <GlobeIcon size={14} /> Global buy-only
                        </span>
                    ) : null}
                    {country ? (
                        <span className="bd-badge">
                            <FlagIcon size={14} /> Supplier: {country}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10, background: "var(--bd-muted-bg)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <ShieldCheckIcon size={18} />
                    <div style={{ fontWeight: 950, fontSize: 15 }}>Escrow Protection</div>
                </div>

                <div style={{ color: "var(--bd-muted)", lineHeight: 1.5, fontSize: 14 }}>
                    {escrowText}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                    <span className="bd-badge">
                        <LockIcon size={14} /> Funds locked
                    </span>
                    <span className="bd-badge">
                        <CheckIcon size={14} /> Release after confirmation
                    </span>
                    <span className="bd-badge">
                        <ChatIcon size={14} /> Ops-mediated support
                    </span>
                </div>
            </div>
        </div>
    );
}
