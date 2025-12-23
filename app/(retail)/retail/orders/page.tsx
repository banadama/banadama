// app/(retail)/retail/orders/page.tsx - Retail Purchase Orders List
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";

export default async function RetailPurchaseOrdersPage() {
    await requireRole("RETAIL");

    let orders = [];
    try {
        const res = await apiGet("/api/supplier/purchase-orders");
        orders = res?.orders ?? [];
    } catch { }

    return (
        <div className="bd-card bd-card-pad">
            <div style={{ fontWeight: 950, fontSize: 18, marginBottom: 12 }}>Purchase Orders</div>
            <div style={{ display: "grid", gap: 10 }}>
                {orders.length ? orders.map((o: any) => (
                    <a key={o.id} href={`/retail/orders/${o.id}`} className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                        <div style={{ fontWeight: 900 }}>PO #{o.id}</div>
                        <div style={{ color: "var(--bd-muted)", marginTop: 6 }}>Status: {o.status}</div>
                    </a>
                )) : (
                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none", color: "var(--bd-muted)" }}>
                        No purchase orders assigned yet.
                    </div>
                )}
            </div>
        </div>
    );
}
