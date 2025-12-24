import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Icons } from "@/components/icons/icons";

export default async function OpsDisputeInbox({ searchParams }: { searchParams: any }) {
    await requireRole("OPS");

    const status = typeof searchParams?.status === "string" ? searchParams.status : "BOTH";
    const res = await apiGet<any>(`/api/ops/dispute-threads?status=${encodeURIComponent(status)}&limit=100`);
    const data = res?.data ?? res;
    const threads = data?.threads ?? [];

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontWeight: 950, fontSize: 20 }}>Dispute Inbox</div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a className="bd-btn" href="/ops/dispute-inbox?status=BOTH">OPEN + IN_REVIEW</a>
                    <a className="bd-btn" href="/ops/dispute-inbox?status=OPEN">OPEN</a>
                    <a className="bd-btn" href="/ops/dispute-inbox?status=IN_REVIEW">IN_REVIEW</a>
                </div>
            </div>

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                {threads.length === 0 ? (
                    <div style={{ color: "var(--bd-muted)" }}>No dispute threads.</div>
                ) : (
                    threads.map((t: any) => (
                        <a key={t.threadId} href={`/ops/messages?threadId=${t.threadId}`} style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--bd-border)" }}>
                                <div style={{ display: "grid", gap: 4 }}>
                                    <div style={{ fontWeight: 900 }}>
                                        Order {String(t.orderId ?? "").slice(0, 8)} · {t.reason}
                                    </div>
                                    <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                                        Last: {t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleString() : "—"}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                    <StatusBadge status={t.disputeStatus} />
                                    {t.unread > 0 ? (
                                        <span className="bd-badge" style={{ fontWeight: 950, background: "var(--bd-primary)", color: "white" }}>
                                            <Icons.Chat size={14} /> {t.unread}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
