import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { OpsResolveCreatorDispute } from "@/components/ops/OpsResolveCreatorDispute";

export default async function OpsCreatorDisputeDetail({ params }: { params: { id: string } }) {
    await requireRole("OPS");

    const res = await apiGet<any>(`/api/ops/creator-disputes/${params.id}`);
    const data = res?.data ?? res;
    const dispute = data?.dispute;
    const events = data?.events ?? [];

    if (!dispute) return <div className="bd-card bd-card-pad">Not found</div>;

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <a className="bd-btn" href="/ops/creator-disputes" style={{ width: "fit-content" }}>Back</a>

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950, fontSize: 18 }}>Dispute {String(dispute.id).slice(0, 8)}</div>
                <div style={{ color: "var(--bd-muted)" }}>Order: {dispute.order_id}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className="bd-badge">Status: {dispute.status}</span>
                    <span className="bd-badge">Reason: {dispute.reason}</span>
                </div>
                <div style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>{dispute.details ?? ""}</div>
            </div>

            <OpsResolveCreatorDispute disputeId={params.id} status={dispute.status} />

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Timeline</div>
                {events.length === 0 ? <div style={{ color: "var(--bd-muted)" }}>No events.</div> : events.map((e: any) => (
                    <div key={e.id} style={{ borderTop: "1px solid var(--bd-border)", paddingTop: 10 }}>
                        <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>{new Date(e.createdAt).toLocaleString()}</div>
                        <div><b>{e.type}</b> {e.note ? `· ${e.note}` : ""}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
