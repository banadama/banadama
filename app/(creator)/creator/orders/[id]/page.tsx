import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CreatorDeliveryForm } from "@/components/creators/CreatorDeliveryForm";
import { Icons } from "@/components/icons/icons";

export default async function CreatorOrderDetail({ params }: { params: { id: string } }) {
    await requireRole("CREATOR");

    const [orderRes, delRes] = await Promise.all([
        apiGet(`/api/creator/orders/${params.id}`).catch(() => null),
        apiGet(`/api/creator/orders/${params.id}/deliveries`).catch(() => null),
    ]);

    const order = (orderRes?.data?.order ?? orderRes?.order) as any;
    const deliveries = (delRes?.data?.deliveries ?? delRes?.deliveries ?? []) as any[];

    if (!order) {
        return (
            <div className="bd-card bd-card-pad">Order not found</div>
        );
    }

    const canDeliver = ["PAID_ESCROW", "IN_PROGRESS"].includes(order.status);

    return (
        <div style={{ display: "grid", gap: 24 }}>
            <div>
                <a className="bd-btn" href="/creator/orders" style={{ width: "fit-content" }}>
                    <Icons.ChevronLeft size={18} /> Back to orders
                </a>
            </div>

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ fontWeight: 950, fontSize: 20 }}>{order.listingTitle ?? "Service Delivery Request"}</div>
                    <StatusBadge status={order.status} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 20, padding: "15px 0", borderTop: "1px solid var(--bd-border)", borderBottom: "1px solid var(--bd-border)" }}>
                    <div>
                        <div style={{ color: "var(--bd-muted)", fontSize: 13, marginBottom: 4 }}>Total Amount</div>
                        <div style={{ fontWeight: 800, fontSize: 18 }}>{order.currency ?? "USD"} {Number(order.total ?? 0).toFixed(2)}</div>
                    </div>
                    <div>
                        <div style={{ color: "var(--bd-muted)", fontSize: 13, marginBottom: 4 }}>Order Type</div>
                        <div style={{ fontWeight: 700 }}>{order.type === "LOCAL_SERVICE" ? "Local Booking" : "Digital Asset"}</div>
                    </div>
                    {order.type === "LOCAL_SERVICE" && order.serviceDate && (
                        <div>
                            <div style={{ color: "var(--bd-muted)", fontSize: 13, marginBottom: 4 }}>Service Date</div>
                            <div style={{ fontWeight: 700 }}>{new Date(order.serviceDate).toLocaleDateString()}</div>
                        </div>
                    )}
                </div>

                {order.location && typeof order.location === 'object' && Object.keys(order.location).length > 0 && (
                    <div style={{ fontSize: 14 }}>
                        <div style={{ fontWeight: 950, marginBottom: 5 }}>Location Details:</div>
                        <div style={{ color: "var(--bd-muted)" }}>{JSON.stringify(order.location)}</div>
                    </div>
                )}
            </div>

            {canDeliver && (
                <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ fontWeight: 950, fontSize: 18 }}>Action Required: Delivery</div>
                    <CreatorDeliveryForm orderId={params.id} />
                </div>
            )}

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 15 }}>
                <div style={{ fontWeight: 950, fontSize: 18 }}>Past Deliveries</div>
                {deliveries.length === 0 ? (
                    <div style={{ color: "var(--bd-muted)", padding: "20px 0", textAlign: "center", fontStyle: "italic" }}>
                        No delivery proof submitted yet.
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 16 }}>
                        {deliveries.map((d: any) => (
                            <div key={d.id} className="bd-card bd-card-pad" style={{ boxShadow: "none", border: "1px solid var(--bd-border)", background: "var(--bd-muted-bg)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--bd-muted)", marginBottom: 8 }}>
                                    <span>{new Date(d.deliveredAt ?? d.delivered_at).toLocaleString()}</span>
                                    <span>#{d.id.slice(-4)}</span>
                                </div>
                                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{d.message ?? "No message provided."}</div>
                                {d.files && Array.isArray(d.files) && d.files.length > 0 && (
                                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        {d.files.map((f: string, idx: number) => (
                                            <a key={idx} href={f} target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn-sm" style={{ gap: 6 }}>
                                                <Icons.ExternalLink size={14} /> View File
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
