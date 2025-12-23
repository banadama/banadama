"use client";

import * as React from "react";
import { apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";

const RESOLUTIONS = [
    "REFUND_BUYER",
    "PARTIAL_REFUND",
    "REDELIVER",
    "RELEASE_PAYOUT",
    "CANCEL_ORDER",
] as const;

export function OpsResolveCreatorDispute({ disputeId, status }: { disputeId: string; status: string }) {
    const toast = useToast();
    const [resolution, setResolution] = React.useState<string>("REDELIVER");
    const [note, setNote] = React.useState("");
    const [refundAmount, setRefundAmount] = React.useState("");
    const [loading, setLoading] = React.useState<"ASSIGN" | "RESOLVE" | null>(null);

    const canResolve = status !== "RESOLVED";

    async function assign() {
        setLoading("ASSIGN");
        try {
            await apiPost<any>(`/api/ops/creator-disputes/${disputeId}`, { action: "ASSIGN" });
            toast.push({ type: "success", title: "Assigned" });
            window.location.reload();
        } catch (e: any) {
            toast.push({ type: "error", title: "Assign failed", message: e?.message });
        } finally {
            setLoading(null);
        }
    }

    async function resolve() {
        setLoading("RESOLVE");
        try {
            await apiPost<any>(`/api/ops/creator-disputes/${disputeId}`, {
                action: "RESOLVE",
                resolution,
                note,
                meta: resolution === "PARTIAL_REFUND" ? { refundAmount: Number(refundAmount) } : undefined
            });
            toast.push({ type: "success", title: "Resolved" });
            window.location.reload();
        } catch (e: any) {
            toast.push({ type: "error", title: "Resolve failed", message: e?.message });
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 950 }}>Ops actions</div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="bd-btn" onClick={assign} disabled={loading !== null || status === "IN_REVIEW"}>
                    <Icons.Users size={18} /> {loading === "ASSIGN" ? "Assigning" : "Assign to me"}
                </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    <select className="bd-input" value={resolution} onChange={(e) => setResolution(e.target.value)} disabled={!canResolve}>
                        {RESOLUTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input className="bd-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" disabled={!canResolve} />
                </div>

                {resolution === "PARTIAL_REFUND" && (
                    <input
                        type="number"
                        className="bd-input"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="Refund amount to buyer (e.g. 50)"
                        disabled={!canResolve}
                    />
                )}
            </div>

            <button className="bd-btn bd-btn-primary" onClick={resolve} disabled={!canResolve || loading !== null} style={{ justifyContent: "center" }}>
                <Icons.Check size={18} /> {loading === "RESOLVE" ? "Resolving" : "Resolve dispute"}
            </button>

            <div style={{ color: "var(--bd-muted)", fontSize: 13, lineHeight: 1.6 }}>
                Escrow stays locked while disputed. Resolution controls refund / redelivery / payout release.
            </div>
        </div>
    );
}
