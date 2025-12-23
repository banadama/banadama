"use client";

import * as React from "react";
import { apiPost, apiGet } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";

const REASONS = [
    "NOT_AS_DESCRIBED",
    "LATE_DELIVERY",
    "INCOMPLETE",
    "QUALITY_ISSUE",
    "OTHER",
] as const;

export function BuyerOpenDispute({ orderId, status }: { orderId: string; status: string }) {
    const toast = useToast();
    const [reason, setReason] = React.useState<string>("NOT_AS_DESCRIBED");
    const [details, setDetails] = React.useState("");
    const [existing, setExisting] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);

    const canOpen = ["PAID_ESCROW", "IN_PROGRESS", "DELIVERED"].includes(status);

    React.useEffect(() => {
        (async () => {
            try {
                const res = await apiGet<any>(`/api/creator/orders/${orderId}/dispute`);
                const d = res?.data?.dispute ?? res?.dispute ?? null;
                if (d) setExisting(d);
            } catch { }
        })();
    }, [orderId]);

    async function open() {
        setLoading(true);
        try {
            const res = await apiPost<any>(`/api/creator/orders/${orderId}/dispute`, { reason, details });
            const d = res?.data?.dispute ?? res?.dispute;
            setExisting(d);
            toast.push({ type: "success", title: "Dispute opened", message: "Ops will review and respond." });
            window.location.reload();
        } catch (e: any) {
            toast.push({ type: "error", title: "Failed to open dispute", message: e?.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 950 }}>Dispute</div>
                <span className="bd-badge"><Icons.ShieldCheck size={14} /> Ops-mediated</span>
            </div>

            {existing ? (
                <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ color: "var(--bd-muted)" }}>
                        Dispute status: <b>{existing.status}</b> · Reason: <b>{existing.reason}</b>
                    </div>
                    <a href={`/buyer/creator-orders/${orderId}/dispute-chat`} className="bd-btn" style={{ width: "fit-content" }}>
                        <Icons.Chat size={16} /> Go to Dispute Chat
                    </a>
                </div>
            ) : (
                <>
                    <div style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>
                        If there’s an issue, open a dispute. Escrow remains locked until Ops resolves it.
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                        <select className="bd-input" value={reason} onChange={(e) => setReason(e.target.value)}>
                            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <input className="bd-input" placeholder="Short details" value={details} onChange={(e) => setDetails(e.target.value)} />
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button className="bd-btn bd-btn-primary" disabled={!canOpen || loading} onClick={open} style={{ justifyContent: "center" }}>
                            <Icons.AlertTriangle size={18} /> {loading ? "Opening" : "Open dispute"}
                        </button>
                        {!canOpen ? (
                            <span style={{ color: "var(--bd-muted)" }}>Dispute is not available for this status.</span>
                        ) : null}
                    </div>
                </>
            )}
        </div>
    );
}
