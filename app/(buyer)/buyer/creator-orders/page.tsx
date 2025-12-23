import { requireRole } from "@/lib/auth";
import { getCreatorOrdersBuyer } from "@/lib/creatorApi";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Creator Orders",
};

export default async function BuyerCreatorOrders() {
    await requireRole("BUYER");
    const orders = await getCreatorOrdersBuyer();

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 950, fontSize: 20 }}>Creator Orders</div>

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                {orders.length === 0 ? (
                    <div style={{ color: "var(--bd-muted)" }}>No creator orders yet.</div>
                ) : (
                    orders.map((o: any) => (
                        <a key={o.id} href={`/buyer/creator-orders/${o.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--bd-border)" }}>
                                <div style={{ display: "grid", gap: 4 }}>
                                    <div style={{ fontWeight: 900 }}>{o.listing?.title ?? "Creator order"}</div>
                                    <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                                        {o.type} · {o.currency ?? "USD"} {Number(o.total ?? 0).toFixed(2)}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    {o.disputeUnread > 0 ? (
                                        <span className="bd-badge" style={{ fontWeight: 900, background: "var(--bd-primary)", color: "white" }}>
                                            Unread: {o.disputeUnread}
                                        </span>
                                    ) : null}
                                    <StatusBadge status={o.status} />
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
