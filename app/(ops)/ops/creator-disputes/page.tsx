import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function OpsCreatorDisputes({ searchParams }: { searchParams: any }) {
    await requireRole("OPS");
    const status = typeof searchParams?.status === "string" ? searchParams.status : "OPEN";

    const res = await apiGet<any>(`/api/ops/creator-disputes?status=${encodeURIComponent(status)}`);
    const data = res?.data ?? res;
    const disputes = data?.disputes ?? [];

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontWeight: 950, fontSize: 20 }}>Creator Disputes</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a className="bd-btn" href="/ops/creator-disputes?status=OPEN">OPEN</a>
                    <a className="bd-btn" href="/ops/creator-disputes?status=IN_REVIEW">IN_REVIEW</a>
                    <a className="bd-btn" href="/ops/creator-disputes?status=RESOLVED">RESOLVED</a>
                </div>
            </div>

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                {disputes.length === 0 ? (
                    <div style={{ color: "var(--bd-muted)" }}>No disputes.</div>
                ) : disputes.map((d: any) => (
                    <a key={d.id} href={`/ops/creator-disputes/${d.id}`} style={{ textDecoration: "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--bd-border)" }}>
                            <div style={{ display: "grid", gap: 4 }}>
                                <div style={{ fontWeight: 900 }}>Order {String(d.orderId).slice(0, 8)}</div>
                                <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>{d.reason}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                {d.unread > 0 ? (
                                    <span className="bd-badge" style={{ fontWeight: 900, background: "var(--bd-primary)", color: "white" }}>
                                        Unread: {d.unread}
                                    </span>
                                ) : null}
                                <StatusBadge status={d.status} />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
