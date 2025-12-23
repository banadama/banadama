import { Icons } from "@/components/icons/icons";

function fmtMoney(value: any, currency?: string) {
    const n = typeof value === "number" ? value : value ? Number(value) : NaN;
    if (!Number.isFinite(n)) return null;
    const cur = currency || "USD";
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(n);
    } catch {
        return `${cur} ${n.toFixed(2)}`;
    }
}

export function SpecBlock({
    buyNowEnabled,
    rfqEnabled,
    buyNowPrice,
    currency,
    moq,
    leadTimeDays,
}: {
    buyNowEnabled: boolean;
    rfqEnabled: boolean;
    buyNowPrice?: number | string | null;
    currency?: string | null;
    moq?: number | string | null;
    leadTimeDays?: number | string | null;
}) {
    const price = buyNowEnabled ? fmtMoney(buyNowPrice, currency || "USD") : null;

    const TagIcon = Icons.get("Tag");
    const LayersIcon = Icons.get("Layers");
    const ClockIcon = Icons.get("Clock");
    const CreditCardIcon = Icons.get("CreditCard");
    const CartIcon = Icons.get("Cart");
    const RFQIcon = Icons.get("RFQ");

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 12, background: "var(--bd-muted-bg)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                    <div style={{ color: "var(--bd-muted)", fontSize: 12, display: "flex", gap: 8, alignItems: "center" }}>
                        <TagIcon size={14} /> Price
                    </div>
                    <div style={{ fontWeight: 950, fontSize: 18, marginTop: 6 }}>
                        {buyNowEnabled ? (price ?? "—") : (rfqEnabled ? "Request Quote" : "—")}
                    </div>
                    <div style={{ color: "var(--bd-muted)", fontSize: 12, marginTop: 6 }}>
                        {buyNowEnabled ? "Fixed price for Buy Now" : (rfqEnabled ? "Pricing via RFQ" : "Not available")}
                    </div>
                </div>

                <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                    <div style={{ color: "var(--bd-muted)", fontSize: 12, display: "flex", gap: 8, alignItems: "center" }}>
                        <LayersIcon size={14} /> MOQ
                    </div>
                    <div style={{ fontWeight: 950, fontSize: 18, marginTop: 6 }}>
                        {moq ? String(moq) : "—"}
                    </div>
                    <div style={{ color: "var(--bd-muted)", fontSize: 12, marginTop: 6 }}>
                        Minimum order quantity
                    </div>
                </div>

                <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                    <div style={{ color: "var(--bd-muted)", fontSize: 12, display: "flex", gap: 8, alignItems: "center" }}>
                        <ClockIcon size={14} /> Lead time
                    </div>
                    <div style={{ fontWeight: 950, fontSize: 18, marginTop: 6 }}>
                        {leadTimeDays ? `${String(leadTimeDays)} days` : "—"}
                    </div>
                    <div style={{ color: "var(--bd-muted)", fontSize: 12, marginTop: 6 }}>
                        Estimated processing time
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: "var(--bd-muted)", fontSize: 13 }}>
                <span className="bd-badge">
                    <CreditCardIcon size={14} /> Currency: {currency || "USD"}
                </span>
                {buyNowEnabled ? (
                    <span className="bd-badge">
                        <CartIcon size={14} /> Buy Now enabled
                    </span>
                ) : null}
                {rfqEnabled ? (
                    <span className="bd-badge">
                        <RFQIcon size={14} /> RFQ enabled
                    </span>
                ) : null}
            </div>
        </div>
    );
}
