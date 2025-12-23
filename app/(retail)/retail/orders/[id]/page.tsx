// app/(retail)/retail/orders/[id]/page.tsx - Retail Purchase Order Detail
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { OrderStatusUpdater, MessageComposer } from "@/components/ops/actions";

export default async function RetailPurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await requireRole("RETAIL");
    const { id } = await params;

    let order: any = null;
    try {
        order = await apiGet(`/api/orders/${id}`);
    } catch { }

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div className="bd-card bd-card-pad">
                <div style={{ fontWeight: 950, fontSize: 18 }}>PO #{id}</div>
                <div style={{ color: "var(--bd-muted)", marginTop: 6 }}>
                    Current status: {order?.status ?? "PENDING"}
                </div>
            </div>

            <OrderStatusUpdater orderId={id} current={order?.status ?? "IN_PRODUCTION"} />

            {order?.threadId ? (
                <div className="bd-card bd-card-pad">
                    <div style={{ fontWeight: 950, marginBottom: 10 }}>Messages (Ops mediated)</div>
                    <MessageComposer threadId={order.threadId} />
                </div>
            ) : null}
        </div>
    );
}
