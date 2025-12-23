// components/ops/actions/rfq/QuoteBuilderCard.tsx
"use client";

import * as React from "react";
import { apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useOpsAction } from "@/components/ops/useOpsAction";
import { Icons } from "@/components/icons/icons";

export function QuoteBuilderCard({ rfqId }: { rfqId: string }) {
    const toast = useToast();
    const { loading, run } = useOpsAction();
    const [payload, setPayload] = React.useState<any>({
        itemsTotal: "",
        shipping: "",
        fees: "",
        notes: "",
    });

    async function submitQuote() {
        if (!payload.itemsTotal) {
            toast.push({ type: "warning", title: "Missing pricing", message: "Enter items total to generate quote." });
            return;
        }

        await run(
            () => apiPost(`/api/rfq/${rfqId}/quote`, payload),
            { start: "Generating quote", ok: "Quote generated", fail: "Quote failed" }
        );

        location.reload();
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Generate Quote</div>

                <input className="bd-input" placeholder="Items total" value={payload.itemsTotal} onChange={(e) => setPayload({ ...payload, itemsTotal: e.target.value })} />
                <input className="bd-input" placeholder="Shipping" value={payload.shipping} onChange={(e) => setPayload({ ...payload, shipping: e.target.value })} />
                <input className="bd-input" placeholder="Fees" value={payload.fees} onChange={(e) => setPayload({ ...payload, fees: e.target.value })} />
                <textarea className="bd-input" style={{ minHeight: 90, paddingTop: 10 }} placeholder="Notes" value={payload.notes} onChange={(e) => setPayload({ ...payload, notes: e.target.value })} />

                <button className="bd-btn bd-btn-primary" onClick={submitQuote} disabled={loading} style={{ justifyContent: "center" }}>
                    <Icons.Quote size={18} /> {loading ? "Working..." : "Send Quote"}
                </button>
            </div>
        </div>
    );
}
