import { requireRole } from "@/lib/auth";
import { getCreatorOrder, getCreatorDeliveries } from "@/lib/creatorApi";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BuyerCreatorOrderActions } from "@/components/creators/BuyerCreatorOrderActions";
import { BuyerOpenDispute } from "@/components/creators/BuyerOpenDispute";
import { Metadata } from "next";
import Link from "next/link";
import { Icons } from "@/components/icons/icons";

export const metadata: Metadata = {
    title: "Order Details",
};

export default async function BuyerCreatorOrderDetail({ params }: { params: { id: string } }) {
    await requireRole("BUYER");

    const [order, deliveries] = await Promise.all([
        getCreatorOrder(params.id),
        getCreatorDeliveries(params.id),
    ]);

    if (!order) return <div className="bd-card bd-card-pad">Order not found</div>;

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div>
                <Link href="/buyer/creator-orders" className="bd-btn" style={{ width: "fit-content" }}>
                    <Icons.ChevronLeft size={18} /> Back
                </Link>
            </div>

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 950, fontSize: 18 }}>{order.listing?.title || order.listingTitle || "Creator order"}</div>
                    <StatusBadge status={order.status} />
                </div>

                <div style={{ color: "var(--bd-muted)" }}>
                    Total: {order.currency ?? "USD"} {Number(order.total ?? 0).toFixed(2)}
                </div>

                {order.type === "LOCAL_SERVICE" && order.serviceDate ? (
                    <div className="bd-badge" style={{ width: "fit-content" }}>
                        <Icons.Calendar size={14} /> Service date: {new Date(order.serviceDate).toLocaleString()}
                    </div>
                ) : null}
            </div>

            <BuyerCreatorOrderActions orderId={params.id} status={order.status} />

            <BuyerOpenDispute orderId={params.id} status={order.status} />

            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Deliveries</div>
                {deliveries.length === 0 ? (
                    <div style={{ color: "var(--bd-muted)" }}>No deliveries yet.</div>
                ) : (
                    deliveries.map((d: any) => (
                        <div key={d.id} style={{ borderTop: "1px solid var(--bd-border)", paddingTop: 10 }}>
                            <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                                {new Date(d.deliveredAt).toLocaleString()}
                            </div>
                            <div style={{ marginTop: 6 }}>{d.message ?? ""}</div>
                            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                                {(Array.isArray(d.files) ? d.files : []).map((f: string, idx: number) => (
                                    <a key={idx} href={f} target="_blank" rel="noopener noreferrer" className="bd-btn" style={{ width: "fit-content" }}>
                                        <Icons.Download size={14} /> Open file {idx + 1}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
