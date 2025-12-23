// components/checkout/EscrowNoticeCard.tsx - Escrow protection notice
import * as React from "react";
import { Icons } from "@/components/icons/icons";

export function EscrowNoticeCard() {
    return (
        <div className="bd-card bd-card-pad" style={{ background: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.3)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ color: "var(--bd-success)", flexShrink: 0 }}>
                    <Icons.Lock size={24} />
                </div>
                <div>
                    <div style={{ fontWeight: 800, marginBottom: 4, color: "var(--bd-success)" }}>
                        Escrow Protected
                    </div>
                    <div className="bd-small" style={{ lineHeight: 1.5 }}>
                        Your payment is held securely in escrow. Funds are released to the supplier only after you confirm delivery.
                        If there's an issue, our Ops team will resolve it.
                    </div>
                </div>
            </div>
        </div>
    );
}
