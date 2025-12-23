import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function CreatorOrders() {
    await requireRole("CREATOR");
    const res = await apiGet("/api/creator/orders").catch(() => ({ orders: [] }));
    const data = res?.data ?? res;
    const orders = data?.orders ?? [];

    return (
        <div style={{ display: "grid", gap: 24 }}>
            <div style={{ fontWeight: 950, fontSize: 24 }}>My Orders</div>

            <div className="bd-card bd-card-pad" style={{ display: "grid", padding: 0, overflow: "hidden" }}>
                {orders.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "var(--bd-muted)" }}>
                        No orders received yet.
                    </div>
                ) : (
                    <table className="bd-table" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "12px 16px" }}>Order / Listing</th>
                                <th style={{ textAlign: "left", padding: "12px 16px" }}>Total</th>
                                <th style={{ textAlign: "left", padding: "12px 16px" }}>Status</th>
                                <th style={{ textAlign: "right", padding: "12px 16px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o: any) => (
                                <tr key={o.id} style={{ borderTop: "1px solid var(--bd-border)" }}>
                                    <td style={{ padding: "16px" }}>
                                        <div style={{ fontWeight: 900 }}>{o.listingTitle ?? `Order #${o.id.slice(-6)}`}</div>
                                        <div style={{ color: "var(--bd-muted)", fontSize: 13, marginTop: 4 }}>
                                            {o.type} asset
                                        </div>
                                    </td>
                                    <td style={{ padding: "16px" }}>
                                        <div style={{ fontWeight: 700 }}>{o.currency ?? "USD"} {Number(o.total ?? 0).toFixed(2)}</div>
                                    </td>
                                    <td style={{ padding: "16px" }}>
                                        <StatusBadge status={o.status} />
                                    </td>
                                    <td style={{ padding: "16px", textAlign: "right" }}>
                                        <a className="bd-btn bd-btn-sm" href={`/creator/orders/${o.id}`}>
                                            View Details
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
